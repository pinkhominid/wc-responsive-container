/**
 * wc-responsive-container
 * by pinkhominid
 * MIT Licensed
 *
 * See Philip Walton's Responsive Components: a Solution to the Container Queries Problem
 * https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/
 *
 * TODO
 * - ResizeObserver singleton
 */

const debounce = fn => {
  let id;
  return (...args) => {
    if(id != null) clearTimeout(id);

    id = setTimeout(
      () => {
        fn.apply(null, args);
        id = null;
      },
      200
    );
  };
};

// https://www.30secondsofcode.org/blog/s/javascript-memoization
const memoize = fn => new Proxy(fn, {
  cache: new Map(),
  apply (target, thisArg, argsList) {
    let cacheKey = argsList.toString();
    if(!this.cache.has(cacheKey)) {
      this.cache.set(cacheKey, target.apply(thisArg, argsList));
    }
    return this.cache.get(cacheKey);
  }
});

const onResize = entries =>
  entries.forEach(entry =>
    requestAnimationFrame(() => {
      // If breakpoints are defined on the observed element,
      // use them. Otherwise use the defaults.
      const breaksAttr = entry.target.getAttribute('breaks');
      const breakpoints = breaksAttr
        ? memoizedJSONParse(breaksAttr)
        : defaultBreakpoints;
      const breaksAddList = [];
      const breaksRemoveList = [];
      const overflownAddList = [];
      const overflownRemoveList = [];

      // Update the matching breakpoints on the observed element
      Object.entries(breakpoints).forEach(([breakpoint, minWidth]) => {
        const gteMin = entry.contentRect.width >= minWidth;
        const hasBreakClass = entry.target.classList.contains(breakpoint);

        if (gteMin && !hasBreakClass) {
          breaksAddList.push(breakpoint);
        } else if (!gteMin && hasBreakClass) {
          breaksRemoveList.push(breakpoint);
        }
      });
      updateClassList(entry.target, breaksRemoveList, breaksAddList);

      // mark overflown (in second pass)
      const isOverflown = isElemOverflown(entry.target);
      const hasOverflownClass = entry.target.classList.contains('overflown');
      if (isOverflown && !hasOverflownClass){
        overflownAddList.push('overflown');
      } else if (!isOverflown && hasOverflownClass) {
        overflownRemoveList.push('overflown');
      }
      updateClassList(entry.target, overflownRemoveList, overflownAddList);

      // call event handler, if present
      if (entry.target.onResize) entry.target.onResize();
    })
  );

const isElemOverflown = ({ clientWidth, scrollWidth }) => scrollWidth > clientWidth;

const updateClassList = (target, removeList, addList) => {
  if (removeList.length) {
    target.classList.remove(...removeList);
  }
  if (addList.length) {
    target.classList.add(...addList);
  }
  forceChildrenLayoutRecalcIfNeeded(target);
};

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const forceChildrenLayoutRecalcIfNeeded = target => {
  if (!isSafari) return;
  // Safari needs this, unfortunately, to refresh it's styling
  Array.from(target.children).forEach(child => {
    child.style.zoom = window.getComputedStyle(child).zoom;
  })
};

const defaultBreakpoints = {sm: 384, md: 576, lg: 768, xl: 960};
const roPropName = '__wc-responsive-container-ro';
const memoizedJSONParse = memoize(JSON.parse);

// Add responsive behavior to any element
export const ResponsiveElementMixin = (superclass) =>
  class extends superclass {
    connectedCallback() {
      if(super.connectedCallback) super.connectedCallback();

      if (!this[roPropName]) {
        this[roPropName] = new ResizeObserver(debounce(onResize));
      }

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
    if (getComputedStyle(this).display === 'inline') this.style.display = 'block';
  }
}

if (self.customElements.get('wc-responsive-container')) {
  self.console.warn(`'wc-responsive-container' has already been defined as a custom element`);
} else {
  self.customElements.define('wc-responsive-container', ResponsiveContainerElement);
}
