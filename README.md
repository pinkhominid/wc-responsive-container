# wc-responsive-container
Web component to allow an author to control styling based on the size of a containing element rather than the size of the user’s viewport.

An implementation based on Philip Walton's [Responsive Components: a Solution to the Container Queries Problem](https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/) using custom elements and resize observer.

## Why?
If a container is within a dynamic app layout that can affect the container size, e.g. layout has closable drawers, it becomes difficult to encapsulate and localize the responsive logic within the container. Media queries as they exist today fall short. [Container queries](https://wicg.github.io/container-queries/) are a long desired CSS feature that could help, but unfortunately progress has stalled.

## Install

```js
npm i wc-responsive-container
```

## Example

```html
<style>
  article {
    width: 85%;
    height: 85vh;
    margin: 50px auto;
  }
  section {
    background-color: lightgray;
    outline: 3px dotted tomato;
    padding: 2rem;
  }
  wc-responsive-container {
    box-sizing: border-box;
    min-height: 100%;
    display: grid;
    grid-gap: 2rem;
    padding: 2rem;
    outline: 3px dotted skyblue;
  }
  wc-responsive-container * {
    box-sizing: inherit;
  }
  wc-responsive-container.lg {
    grid-template-columns: repeat(3, 1fr);
  }
  wc-responsive-container.lg > [lg-colspan="2"] {
    grid-column: span 2;
  }
  wc-responsive-container.lg > [lg-colspan="3"] {
    grid-column: span 3;
  }
</style>
<script type="module" src="./node_modules/wc-responsive-container/wc-responsive-container.js"></script>
<article>
  <wc-responsive-container breaks='{"sm": 300, "md": 500, "lg": 700, "xl": 900}'>
    <section lg-colspan="1">
      1
    </section>
    <section lg-colspan="2">
      2
    </section>
    <section lg-colspan="3">
      3
    </section>
  </wc-responsive-container>
</article>
```
