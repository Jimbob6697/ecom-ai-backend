/* Untameable: the drag-to-compare slider in the Before and after section. */
(() => {
  function initCompare(root = document) {
    root.querySelectorAll('[data-compare]').forEach((compare) => {
      if (compare.dataset.ready) return;
      compare.dataset.ready = 'true';
      const range = compare.querySelector('[data-compare-range]');
      if (!range) return;
      const update = () => compare.style.setProperty('--pos', `${range.value}%`);
      range.addEventListener('input', update);
      update();
    });
  }

  document.addEventListener('shopify:section:load', (event) => initCompare(event.target));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initCompare());
  else initCompare();
})();
