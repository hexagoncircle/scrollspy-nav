# scrollspy-nav

A web component for sticky-positioned page anchor navigation. It observes which section of a page is visible, sets an `aria-selected` state, and animates a marker indicator over to the active item.

- Uses the [FLIP technique](https://css-tricks.com/animating-layouts-with-the-flip-technique/) to animate marker position.
- The marker element is configurable through CSS custom properties.
- If an active menu item overflows the viewport, it will be scrolled into view when its related section is visible.

This currently exists as a [WebC](https://www.11ty.dev/docs/languages/webc/) component for use in 11ty projects. However, the component `script` and `style` rules can be ported separately into any project.

## Example

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
```
