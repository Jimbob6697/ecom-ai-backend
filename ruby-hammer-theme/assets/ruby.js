/* Ruby Hammer: keeps the free delivery message on the product page up to date. */
(() => {
  const format = (cents) => {
    const amount = cents / 100;
    const currency = (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) || 'GBP';
    try {
      return new Intl.NumberFormat(document.documentElement.lang || 'en-GB', { style: 'currency', currency }).format(amount);
    } catch (error) {
      return `£${amount.toFixed(2)}`;
    }
  };

  function initDeliveryNotes(root = document) {
    root.querySelectorAll('[data-delivery-note]').forEach((note) => {
      if (note.dataset.ready) return;
      note.dataset.ready = 'true';
      const product = note.closest('[data-product]');
      const template = product.querySelector('[data-delivery-template]');
      const text = note.querySelector('[data-delivery-text]');
      const idField = product.querySelector('[data-variant-id]');
      const quantity = product.querySelector('[name="quantity"]');
      let variants = [];
      try {
        variants = JSON.parse(product.querySelector('[data-variants]').textContent);
      } catch (error) {
        return;
      }
      const threshold = Number(note.dataset.threshold);
      const basket = Number(note.dataset.basket);

      const update = () => {
        const variant = variants.find((item) => String(item.id) === String(idField.value));
        if (!variant) return;
        const count = Math.max(1, Number(quantity && quantity.value) || 1);
        const remaining = threshold - basket - variant.cents * count;
        note.classList.toggle('is-free', remaining <= 0);
        if (remaining <= 0) text.textContent = note.dataset.free;
        else text.innerHTML = template.innerHTML.replace('[amount]', format(remaining));
      };

      // The theme script changes the variant after an option is chosen, so wait a moment.
      product.addEventListener('change', () => setTimeout(update, 60));
      product.addEventListener('click', (event) => {
        if (event.target.closest('[data-quantity-minus], [data-quantity-plus]')) setTimeout(update, 60);
      });
    });
  }

  document.addEventListener('shopify:section:load', (event) => initDeliveryNotes(event.target));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initDeliveryNotes());
  else initDeliveryNotes();
})();
