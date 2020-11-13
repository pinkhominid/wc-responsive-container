/**
 * wc-responsive-container
 * by pinkhominid
 * MIT Licensed
 *
 * See Philip Walton's Responsive Components: a Solution to the Container Queries Problem
 * https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/
 */

const debounce = fn => {
  let id;
  return (...args) => {
    if(id != null) window.cancelAnimationFrame(id);

    id = window.requestAnimationFrame(() => {
      fn.apply(this, args);
      id = null;
    });
  };
};

// https://www.30secondsofcode.org/blog/s/javascript-memoization
const memoize = fn => new Proxy(fn, {
  cache: new Map(),
  apply (target, thisArg, argsList) {
    let cacheKey = argsList.toString();
    if(!this.cache.has(cacheKey))
      this.cache.set(cacheKey, target.apply(thisArg, argsList));
    return this.cache.get(cacheKey);
  }
});

const onResize = entries => {
  entries.forEach(entry => {
    // If breakpoints are defined on the observed element,
    // use them. Otherwise use the defaults.
    const breaksAttr = entry.target.getAttribute('breaks');
    const breakpoints = breaksAttr
      ? memoizedJSONParse(breaksAttr)
      : defaultBreakpoints;

    // Update the matching breakpoints on the observed element.
    Object.entries(breakpoints).forEach(([breakpoint, minWidth]) =>
      entry.target.classList[entry.contentRect.width >= minWidth ? 'add' : 'remove'](breakpoint)
    );
  });
};

const defaultBreakpoints = {sm: 384, md: 576, lg: 768, xl: 960};
const roPropName = '__wc-responsive-container-ro';
const memoizedJSONParse = memoize(JSON.parse);

// Add responsive behavior to any element
export const ResponsiveElementMixin = (superclass) =>
  class extends superclass {
    connectedCallback() {
      if(super.connectedCallback) super.connectedCallback();

      if (!this[roPropName])
        this[roPropName] = new ResizeObserver(debounce(onResize));

      this[roPropName].observe(this);
    }
    disconnectedCallback() {
      this[roPropName].unobserve(this);
      if(super.disconnectedCallback) super.disconnectedCallback();
    }
  };

export class ResponsiveContainerElement extends ResponsiveElementMixin(HTMLElement) {
  connectedCallback() {
    super.connectedCallback();
    // Default to display block if inline
    // TODO: find a low specificity way w/o extra friction (shadow DOM)
    if (this.style.display.startsWith('inline')) this.style.display = 'block';
  }
}

self.customElements.define('wc-responsive-container', ResponsiveContainerElement);
