/**
 * wc-responsive-container
 * by pinkhominid
 * MIT Licensed
 *
 * See Philip Walton's Responsive Components: a Solution to the Container Queries Problem
 * https://philipwalton.com/articles/responsive-components-a-solution-to-the-container-queries-problem/
 */

// Create a single observer for all <wc-responsive-container> elements.
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

class ResponsiveContainerElement extends HTMLElement {
  connectedCallback() {
    if (this.style.display.startsWith('inline')) this.style.display = 'block';
    ro.observe(this);
  }
  disconnectedCallback() {
    ro.unobserve(this);
  }
}

self.customElements.define('wc-responsive-container', ResponsiveContainerElement);
