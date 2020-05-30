/**
 * wc-responsive-container
 * by pinkhominid
 * MIT Licensed
 *
 * See Philip Walton's Responsive Components: a Solution to the Container Queries Problem
 * https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/
 */

// Create a single observer for all responsive elements
const ro = new ResizeObserver(entries => {
    var defaultBreakpoints = {sm: 384, md: 576, lg: 768, xl: 960};

    entries.forEach(entry => {
      // If breakpoints are defined on the observed element,
      // use them. Otherwise use the defaults.
      const breakpoints = entry.target.getAttribute('breaks') ?
          JSON.parse(entry.target.getAttribute('breaks')) :
          defaultBreakpoints;

      // Update the matching breakpoints on the observed element.
      Object.keys(breakpoints).forEach(breakpoint => {
        const minWidth = breakpoints[breakpoint];
        if (entry.contentRect.width >= minWidth) {
          entry.target.classList.add(breakpoint);
        } else {
          entry.target.classList.remove(breakpoint);
        }
      });
    });
});

// Add responsive behavior to any element
export const ResponsiveElementMixin = (superclass) =>
  class extends superclass {
    connectedCallback() {
      if(super.connectedCallback) super.connectedCallback();
      ro.observe(this);
    }
    disconnectedCallback() {
      if(super.disconnectedCallback) super.disconnectedCallback();
      ro.unobserve(this);
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
