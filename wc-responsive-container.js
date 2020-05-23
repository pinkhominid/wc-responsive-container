// Create a single observer for all <wc-responsive-container> elements.
const ro = new ResizeObserver(entries => {
    var defaultBreakpoints = {SM: 384, MD: 576, LG: 768, XL: 960};

    entries.forEach(function(entry) {
      // If breakpoints are defined on the observed element,
      // use them. Otherwise use the defaults.
      var breakpoints = entry.target.dataset.breakpoints ?
          JSON.parse(entry.target.dataset.breakpoints) :
          defaultBreakpoints;

      // Update the matching breakpoints on the observed element.
      Object.keys(breakpoints).forEach(function(breakpoint) {
        var minWidth = breakpoints[breakpoint];
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
    this.style.display = 'block';
    ro.observe(this);
  }
  disconnectedCallback() {
    ro.unobserve(this);
  }
}

self.customElements.define('wc-responsive-container', ResponsiveContainerElement);
