class ScrollSpyNav extends HTMLElement {
  constructor() {
    super();

    this.links = this.querySelectorAll("a");
    this.sectionIds = [...this.links].map((el) => this.getLinkHashValue(el));
    this.activeLink;
    this.marker;
    this.observer;
    this.observerOptions = {};
    this.scrollDirection = "up";
    this.prevScrollPos = 0;
    this.duration = 200;
    this.ease = "cubic-bezier(0.25, 1, 0.5, 1)";
    this.ready;
  }

  connectedCallback() {
    document.fonts.ready.then(() => {
      this.getObserverOptions();
      this.setObserver();
      this.setCSSCustomProps();
      this.createMarker();
      this.handleSmoothScrollOnClick();
    });
  }

  adjustMenuPosition(target) {
    const rect = target.getBoundingClientRect();
    const offset = parseFloat(
      getComputedStyle(this).getPropertyValue("padding-inline-start")
    );
    const overflowLeft = Math.floor(rect.left + offset) < 0;
    const overflowRight = Math.floor(rect.right + offset) > this.offsetWidth;

    if (!overflowLeft && !overflowRight) return;

    if (overflowLeft) {
      this.setScrollMenuPosition(this.scrollLeft - offset + rect.left);
    } else if (overflowRight) {
      this.setScrollMenuPosition(
        this.scrollLeft + offset + rect.right - this.offsetWidth
      );
    }
  }

  animateMarker(target) {
    const last = target.getBoundingClientRect();
    const first = this.activeLink?.getBoundingClientRect() || last;
    const deltaX = first.left - last.left;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const keyframes = [
      {
        transform: `translateX(${deltaX}px) scaleX(${first.width})`,
      },
      { transform: `translateX(0) scaleX(${last.width})` },
    ];

    const options = {
      duration: reducedMotion ? 0 : this.duration,
      easing: this.ease,
      fill: "forwards",
    };

    target.after(this.marker);
    this.setActiveLink(target);
    this.marker.animate(keyframes, options);
  }

  createMarker() {
    const el = document.createElement("div");
    el.setAttribute("data-marker", "");
    this.marker = el;
  }

  getLinkHashValue(target) {
    return target.hash.substring(1);
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

  getTargetSection(target) {
    if (this.scrollDirection === "up") return target;

    if (target.nextElementSibling) {
      return target.nextElementSibling;
    } else {
      return target;
    }
  }

  handleSmoothScrollOnClick() {
    const handleObserver = () => {
      if (this.observer) return;
      this.setObserver();
    };

    this.addEventListener("click", () => {
      if (!this.observer) return;
      this.observer.disconnect();
      this.observer = null;
    });

    if ("onscrollend" in window) {
      document.addEventListener("scrollend", handleObserver);
    } else {
      document.addEventListener("scroll", () => {
        clearTimeout(this.scrollEndTimer);
        this.scrollEndTimer = setTimeout(handleObserver, 100);
      });
    }
  }

  setCSSCustomProps() {
    this.setDuration();
    this.setEasing();
  }

  setDuration() {
    const value = getComputedStyle(this).getPropertyValue(
      "--scrollspy-nav-marker-duration"
    );

    if (!value) return;

    const unit = value.split(/\d+/g).pop();
    const duration = unit === "s" ? parseInt(value) * 1000 : parseInt(value);

    this.duration = duration;
  }

  setEasing() {
    const value = getComputedStyle(this).getPropertyValue(
      "--scrollspy-nav-marker-ease"
    );

    if (!value) return;

    this.ease = value;
  }

  setScrollDirection() {
    if (window.scrollTop > this.prevScrollPos) {
      this.scrollDirection = "down";
    } else {
      this.scrollDirection = "up";
    }

    this.prevScrollPos = window.scrollTop;
  }

  setObserver() {
    const onIntersect = (entries) => {
      entries.forEach((entry) => {
        this.setScrollDirection();

        if (!this.shouldUpdate(entry)) return;

        const link = this.querySelector(`[href="#${entry.target.id}"`);
        const target = this.getTargetSection(link);

        this.animateMarker(target);
        this.adjustMenuPosition(target);
      });

      if (!this.activeLink) {
        this.animateMarker(this.links[0]);
      }
    };

    this.observer = new IntersectionObserver(onIntersect, this.observerOptions);

    this.sectionIds.forEach((id) => {
      this.observer.observe(document.getElementById(id));
    });
  }

  setActiveLink(target) {
    this.activeLink?.removeAttribute("aria-current");
    target.setAttribute("aria-current", "true");
    this.activeLink = target;
  }

  setScrollMenuPosition(value) {
    this.scrollTo({
      left: value,
      behavior: "smooth",
    });
  }

  shouldUpdate(entry) {
    if (this.scrollDirection === "down" && !entry.isIntersecting) {
      return true;
    }

    if (this.scrollDirection === "up" && entry.isIntersecting) {
      return true;
    }

    return false;
  }
}

if (typeof window !== "undefined" && "customElements" in window) {
  window.customElements.define("scrollspy-nav", ScrollSpyNav);
}
