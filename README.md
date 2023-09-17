# `<scrollspy-nav>`

A web component for sticky-positioned page anchor navigation. It [observes](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) which section of a page is visible, sets an `aria-current` attribute on the active link element, and animates a marker indicator over to it. Check it out on [the demo page](https://hexagoncircle.github.io/scrollspy-nav/). 👀

- Uses the [FLIP technique](https://css-tricks.com/animating-layouts-with-the-flip-technique/) to animate marker position.
- The marker element is configurable through CSS custom properties (or directly with CSS, go nuts).
- If a menu item is obscured in the viewport overflow horizontally, when it becomes active it will be scrolled fully into view.
- Configure [intersection observer options](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#intersection_observer_options) with `observer-root`, `observer-root-margin` and `observer-threshold` attributes if it's necessary.
- Available as a [WebC](https://www.11ty.dev/docs/languages/webc/) component for use in 11ty + WebC projects.

## Usage

- Add the `scrollspy-nav.css` file to the `<head>` or move its rulesets into the page's CSS file.
- Add the `scrollspy-nav.js` before the closing `</body>` tag.
- _or_, import as a WebC component to a project.

## Examples

Wrap a list of anchor links with the `<scrollspy-nav>` custom element.

```html
<scrollspy-nav role="navigation" aria-label="Page section navigation">
  <ul>
    <li>
      <a href="#section-1">Section one</a>
    </li>
    <li>
      <a href="#section-2">Section two</a>
    </li>
    <li>
      <a href="#section-3">Section three</a>
    </li>
  </ul>
</scrollspy-nav>

<article id="section-1"></article>
<article id="section-2"></article>
<article id="section-3"></article>
```

### Change intersection point

In the example below, the active link is set once its related section intersects the middle of the viewport.

```html
<scrollspy-nav observer-root-margin="-50% 0%"></scrollspy-nav>
```

### Modify marker styles

CSS custom properties are available that can change the marker size, color, and position as well as its animation duration and easing. Below is the CSS used on the second `<scrollspy-nav>` element from [the demo page](https://hexagoncircle.github.io/scrollspy-nav/).

```css
.custom-nav {
  --scrollspy-nav-marker-top: 0;
  --scrollspy-nav-marker-height: 5px;
  --scrollspy-nav-marker-color: royalblue;
  --scrollspy-nav-marker-duration: 400ms;
  --scrollspy-nav-marker-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```
