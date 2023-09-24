class ScrollSpyNav extends HTMLElement {
  constructor() {
    super();

    this.activeLink;
    this.duration = 200;
    this.ease = "cubic-bezier(0.25, 1, 0.5, 1)";
    this.links = this.querySelectorAll("a");
    this.marker;
    this.observer;
    this.observerOptions = {};
    this.sections = [];
  }

  connectedCallback() {
    this.getSections();
    this.getObserverOptions();
    this.setCSSCustomProps();
    this.handleClick();

    document.addEventListener("readystatechange", (e) => {
      if (e.target.readyState === "complete") {
        this.setObserver();
        this.createMarker();
      }
    });
  }

  adjustMenuPosition(el) {
    const rect = el.getBoundingClientRect();
    const offset = parseFloat(this.getProp("padding-inline-start"));
    const overflowLeft = Math.floor(rect.left - offset) < 0;
    const overflowRight = Math.floor(rect.right + offset) > this.offsetWidth;

    if (!overflowLeft && !overflowRight) return;

    let value = 0;

    if (overflowLeft) {
      value = this.scrollLeft - offset + rect.left;
    } else if (overflowRight) {
      value = this.scrollLeft + offset + rect.right - this.offsetWidth;
    }

    this.scrollTo({
      left: value,
      behavior: this.reducedMotion() ? "auto" : "smooth",
    });
  }

  animateMarker(el) {
    const last = el.getBoundingClientRect();
    const first = this.activeLink?.getBoundingClientRect() || last;
    const deltaX = first.left - last.left;

    const keyframes = [
      { transform: `translateX(${deltaX}px) scaleX(${first.width})` },
      { transform: `translateX(0) scaleX(${last.width})` },
    ];

    const options = {
      duration: this.reducedMotion() ? 0 : this.duration,
      easing: this.ease,
      fill: "forwards",
    };

    el.after(this.marker);
    this.setActiveLink(el);
    this.marker.animate(keyframes, options);
  }

  createMarker() {
    const el = document.createElement("div");
    el.setAttribute("data-marker", "");
    this.marker = el;
  }

  getObserverOptions() {
    const root = this.getAttribute("observer-root");
    const rootMargin = this.getAttribute("observer-root-margin");
    const threshold = this.getAttribute("observer-threshold");

    this.observerOptions = {
      root: document.querySelector(root),
      rootMargin: rootMargin || "-25% 0% -75% 0%",
      threshold: Number(threshold),
    };
  }

  getProp(value) {
    return getComputedStyle(this).getPropertyValue(value);
  }

  getSections() {
    [...this.links].map((link) => {
      if (new URL(link.href).host !== window.location.host) return;

      const el = document.querySelector(link.hash);
      const value = link.hash.substring(1);

      if (!el) {
        console.warn(
          `${this.constructor.name}: Element with id "${value}" doesn't exist on this page.`
        );
        return;
      }

      this.sections.push(el);
    });
  }

  handleClick() {
    this.addEventListener("click", () => {
      if (!this.observer) return;
      this.observer.disconnect();
      this.observer = null;
      this.handleScroll();
    });
  }

  handleScroll() {
    const handleObserver = () => {
      if (this.observer) return;

      this.setObserver();

      if ("onscrollend" in window) {
        document.removeEventListener("scrollend", handleObserver);
      } else {
        document.removeEventListener("scroll", handleObserver);
      }
    };

    if ("onscrollend" in window) {
      document.addEventListener("scrollend", handleObserver);
    } else {
      document.addEventListener("scroll", () => {
        clearTimeout(this.scrollEndTimer);
        this.scrollEndTimer = setTimeout(handleObserver, 100);
      });
    }
  }

  reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  setActiveLink(el) {
    this.activeLink?.removeAttribute("aria-current");
    el.setAttribute("aria-current", "true");
    this.activeLink = el;
  }

  setCSSCustomProps() {
    this.setDuration();
    this.setEasing();
  }

  setDuration() {
    const value = this.getProp("--scrollspy-nav-marker-duration");

    if (!value) return;

    const unit = value.split(/\d+/g).pop();
    const duration = unit === "s" ? parseInt(value) * 1000 : parseInt(value);

    this.duration = duration;
  }

  setEasing() {
    const value = this.getProp("--scrollspy-nav-marker-ease");

    if (!value) return;

    this.ease = value;
  }

  setObserver() {
    const onIntersect = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const link = this.querySelector(`[href="#${entry.target.id}"`);

        this.animateMarker(link);
        this.adjustMenuPosition(link);
      });

      if (!this.activeLink) {
        this.animateMarker(this.links[0]);
      }
    };

    this.observer = new IntersectionObserver(onIntersect, this.observerOptions);
    this.sections.forEach((section) => this.observer.observe(section));
  }
}

if (typeof window !== "undefined" && "customElements" in window) {
  window.customElements.define("scrollspy-nav", ScrollSpyNav);
}
