/* Voltline theme — interactions and motion. Vanilla JS, no dependencies. */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const designMode = Boolean(window.Shopify && window.Shopify.designMode);
  const theme = window.theme || { routes: {}, strings: {} };

  const debounce = (fn, wait) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  };

  /* ---------------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------------- */
  const revealObserver =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            });
          },
          { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
        )
      : null;

  function initReveal(root = document) {
    const elements = $$('[data-reveal]', root);
    const animate = document.body.classList.contains('has-reveal') && revealObserver && !reduceMotion && !designMode;
    elements.forEach((element) => {
      if (animate) revealObserver.observe(element);
      else element.classList.add('is-visible');
    });
  }

  /* ---------------------------------------------------------------------
     Scroll-linked effects: hero scale/fade, parallax, word-by-word text
     --------------------------------------------------------------------- */
  let scrollTargets = { heroes: [], parallax: [], words: [] };
  let ticking = false;

  function splitWords(element) {
    if (element.dataset.split) return;
    element.dataset.split = 'true';
    const words = element.textContent.trim().split(/\s+/);
    element.textContent = '';
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      element.append(span);
      if (index < words.length - 1) element.append(' ');
    });
  }

  function collectScrollTargets() {
    scrollTargets = {
      heroes: $$('[data-scroll-fx]'),
      parallax: $$('[data-parallax]'),
      words: $$('[data-word-reveal]'),
    };
    scrollTargets.words.forEach((element) => {
      splitWords(element);
      if (reduceMotion || designMode) $$('.word', element).forEach((word) => word.classList.add('is-lit'));
    });
  }

  function updateScroll() {
    ticking = false;
    const viewport = window.innerHeight;
    const header = $('[data-header]');
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 4);
    if (reduceMotion) return;

    scrollTargets.heroes.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const start = Math.min(rect.top + window.scrollY, viewport);
      const progress = clamp((start - rect.top) / rect.height);
      element.style.setProperty('--p', progress.toFixed(4));
    });

    scrollTargets.parallax.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > viewport + 100) return;
      const progress = clamp((viewport - rect.top) / (viewport + rect.height));
      element.style.setProperty('--p', progress.toFixed(4));
    });

    if (designMode) return;
    scrollTargets.words.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const start = viewport * 0.82;
      const end = viewport * 0.38;
      const progress = clamp((start - rect.top) / (start - end + rect.height));
      const words = $$('.word', element);
      const lit = Math.round(progress * words.length);
      words.forEach((word, index) => word.classList.toggle('is-lit', index < lit));
    });
  }

  function requestScrollUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScroll);
  }

  /* ---------------------------------------------------------------------
     Count-up numbers
     --------------------------------------------------------------------- */
  function initCountUp(root = document) {
    $$('[data-count-up]', root).forEach((element) => {
      const match = element.textContent.trim().match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
      if (!match || reduceMotion || designMode || !('IntersectionObserver' in window)) return;
      const [, prefix, number, suffix] = match;
      const target = parseFloat(number);
      const decimals = (number.split('.')[1] || '').length;
      const render = (value) => {
        element.textContent = prefix + value.toFixed(decimals) + suffix;
      };
      render(0);
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          const started = performance.now();
          const duration = 1400;
          const tick = (now) => {
            const t = clamp((now - started) / duration);
            render(target * (1 - Math.pow(1 - t, 4)));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        },
        { threshold: 0.6 }
      );
      observer.observe(element);
    });
  }

  /* ---------------------------------------------------------------------
     Page dim (shared by the header flyout and the cart drawer)
     --------------------------------------------------------------------- */
  const dim = $('[data-page-dim]');
  let dimTimer;

  function showDim(above = false) {
    if (!dim) return;
    clearTimeout(dimTimer);
    dim.hidden = false;
    dim.classList.toggle('is-above', above);
    requestAnimationFrame(() => dim.classList.add('is-active'));
  }

  function hideDim() {
    if (!dim) return;
    dim.classList.remove('is-active');
    dimTimer = setTimeout(() => {
      dim.hidden = true;
      dim.classList.remove('is-above');
    }, 400);
  }

  /* ---------------------------------------------------------------------
     Header: flyout navigation, search panel and mobile menu
     --------------------------------------------------------------------- */
  function initHeader() {
    const header = $('[data-header]');
    if (!header || header.dataset.ready) return;
    header.dataset.ready = 'true';

    const panels = $$('[data-flyout-panel]', header);
    const triggers = $$('[data-flyout-trigger]', header);
    const mobileMenu = $('[data-mobile-menu]', header);
    const menuToggle = $('[data-menu-toggle]', header);
    const hoverCapable = window.matchMedia('(hover: hover)').matches;
    let activeId = null;
    let closeTimer;

    const setHeaderOffset = () => {
      const bottom = header.getBoundingClientRect().bottom;
      document.documentElement.style.setProperty('--header-offset', `${Math.max(bottom, 0)}px`);
    };

    const open = (id) => {
      clearTimeout(closeTimer);
      if (activeId === id) return;
      closeMobileMenu();
      activeId = id;
      panels.forEach((panel) => (panel.hidden = panel.id !== id));
      triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', String(trigger.dataset.flyoutTrigger === id)));
      header.classList.add('is-open');
      showDim();
      if (id === 'flyout-search') {
        const input = $('[data-predictive-input]', header);
        if (input) setTimeout(() => input.focus(), 120);
      }
    };

    const close = () => {
      clearTimeout(closeTimer);
      if (!activeId) return;
      activeId = null;
      triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
      header.classList.remove('is-open');
      if (!$('[data-cart-drawer].is-open')) hideDim();
    };

    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(close, 180);
    };

    function closeMobileMenu() {
      if (!mobileMenu || mobileMenu.hidden) return;
      mobileMenu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
    }

    triggers.forEach((trigger) => {
      const id = trigger.dataset.flyoutTrigger;
      const clickOnly = trigger.hasAttribute('data-flyout-click');

      if (hoverCapable && !clickOnly) {
        trigger.addEventListener('mouseenter', () => open(id));
      }

      trigger.addEventListener('click', (event) => {
        if (clickOnly) {
          event.preventDefault();
          activeId === id ? close() : open(id);
        } else if (!hoverCapable && activeId !== id) {
          // Touch devices: first tap opens the flyout, second tap follows the link.
          event.preventDefault();
          open(id);
        }
      });

      trigger.addEventListener('keydown', (event) => {
        if (clickOnly || (event.key !== 'ArrowDown' && event.key !== ' ')) return;
        event.preventDefault();
        open(id);
        const first = $(`#${id} a`);
        if (first) first.focus();
      });
    });

    // Plain links (no flyout) close any open panel when hovered.
    $$('.site-nav__link:not([data-flyout-trigger])', header).forEach((link) => {
      link.addEventListener('mouseenter', () => {
        if (activeId && activeId !== 'flyout-search') scheduleClose();
      });
    });

    header.addEventListener('mouseleave', () => {
      if (activeId && activeId !== 'flyout-search') scheduleClose();
    });
    header.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    header.addEventListener('focusout', (event) => {
      if (activeId && event.relatedTarget && !header.contains(event.relatedTarget)) close();
    });

    if (dim) dim.addEventListener('click', close);
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (activeId) {
        const trigger = triggers.find((item) => item.dataset.flyoutTrigger === activeId);
        close();
        if (trigger) trigger.focus();
      }
      closeMobileMenu();
    });

    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        if (mobileMenu.hidden) {
          close();
          setHeaderOffset();
          mobileMenu.hidden = false;
          menuToggle.setAttribute('aria-expanded', 'true');
          document.documentElement.style.overflow = 'hidden';
        } else {
          closeMobileMenu();
        }
      });
      window.addEventListener('resize', debounce(() => window.innerWidth > 833 && closeMobileMenu(), 150));
    }

    initPredictiveSearch(header);
  }

  function initPredictiveSearch(header) {
    const input = $('[data-predictive-input]', header);
    const results = $('[data-predictive-results]', header);
    const fallback = $('[data-predictive-default]', header);
    if (!input || !results || !theme.routes.predictiveSearch) return;
    let controller;

    const search = debounce(async () => {
      const query = input.value.trim();
      if (controller) controller.abort();
      if (query.length < 2) {
        results.innerHTML = '';
        if (fallback) fallback.hidden = false;
        return;
      }
      controller = new AbortController();
      const params = new URLSearchParams({
        q: query,
        'resources[type]': 'product',
        'resources[limit]': '6',
        section_id: 'predictive-search',
      });
      try {
        const response = await fetch(`${theme.routes.predictiveSearch}?${params}`, { signal: controller.signal });
        if (!response.ok) return;
        const html = new DOMParser().parseFromString(await response.text(), 'text/html');
        const content = $('[data-predictive-content]', html);
        results.innerHTML = content ? content.outerHTML : '';
        if (fallback) fallback.hidden = Boolean(content);
      } catch (error) {
        if (error.name !== 'AbortError') console.error(error);
      }
    }, 220);

    input.addEventListener('input', search);
  }

  /* ---------------------------------------------------------------------
     Horizontal scrollers (product shelves, model picker)
     --------------------------------------------------------------------- */
  function initScrollers(root = document) {
    $$('[data-scroller]', root).forEach((scroller) => {
      if (scroller.dataset.ready) return;
      scroller.dataset.ready = 'true';
      const track = $('[data-scroller-track]', scroller);
      const prev = $('[data-scroller-prev]', scroller);
      const next = $('[data-scroller-next]', scroller);
      if (!track || !prev || !next) return;

      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        scroller.classList.toggle('is-scrollable', max > 4);
        prev.disabled = track.scrollLeft <= 4;
        next.disabled = track.scrollLeft >= max - 4;
      };

      const move = (direction) => {
        track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
      };

      prev.addEventListener('click', () => move(-1));
      next.addEventListener('click', () => move(1));
      track.addEventListener('scroll', debounce(update, 60), { passive: true });
      window.addEventListener('resize', debounce(update, 150));
      update();
    });
  }

  /* ---------------------------------------------------------------------
     Cart: drawer, AJAX add, quantity changes
     --------------------------------------------------------------------- */
  const cartSections = () => $$('[data-cart-section]').map((element) => element.dataset.cartSection);
  let lastFocused = null;

  function openDrawer() {
    const drawer = $('[data-cart-drawer]');
    if (!drawer || drawer.classList.contains('is-open')) return;
    lastFocused = document.activeElement;
    drawer.inert = false;
    drawer.classList.add('is-open');
    $$('.cart-item', drawer).forEach((item, index) => item.style.setProperty('--i', index));
    showDim(true);
    document.documentElement.style.overflow = 'hidden';
    setTimeout(() => drawer.focus({ preventScroll: true }), 60);
  }

  function closeDrawer() {
    const drawer = $('[data-cart-drawer]');
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.inert = true;
    hideDim();
    document.documentElement.style.overflow = '';
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus({ preventScroll: true });
  }

  function renderCartSections(sections) {
    if (!sections) return;
    let count = null;
    Object.entries(sections).forEach(([id, html]) => {
      if (!html) return;
      const fresh = $(`[data-cart-section="${id}"]`, new DOMParser().parseFromString(html, 'text/html'));
      const current = $(`[data-cart-section="${id}"]`);
      if (!fresh || !current) return;
      current.innerHTML = fresh.innerHTML;
      current.dataset.itemCount = fresh.dataset.itemCount;
      count = Number(fresh.dataset.itemCount);
    });
    if (count !== null && !Number.isNaN(count)) updateCartCount(count);
  }

  function updateCartCount(count) {
    $$('[data-cart-count]').forEach((badge) => {
      badge.textContent = count;
      badge.hidden = count === 0;
      badge.classList.remove('is-bumped');
      void badge.offsetWidth;
      badge.classList.add('is-bumped');
    });
  }

  async function changeLine(line, quantity) {
    const containers = $$('[data-cart-content]');
    containers.forEach((element) => element.classList.add('is-updating'));
    try {
      const response = await fetch(theme.routes.cartChange, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line, quantity, sections: cartSections(), sections_url: window.location.pathname }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.description || data.message || 'Cart error');
      renderCartSections(data.sections);
    } catch (error) {
      console.error(error);
      window.location.reload();
    } finally {
      containers.forEach((element) => element.classList.remove('is-updating'));
    }
  }

  function initCart() {
    document.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-cart-toggle]');
      if (toggle && $('[data-cart-drawer]')) {
        event.preventDefault();
        openDrawer();
        return;
      }

      if (event.target.closest('[data-drawer-close]')) {
        closeDrawer();
        return;
      }

      const step = event.target.closest('[data-quantity-minus], [data-quantity-plus]');
      if (step) {
        const input = $('input', step.closest('[data-quantity]'));
        const min = Number(input.min || 0);
        const delta = step.hasAttribute('data-quantity-plus') ? 1 : -1;
        const value = Math.max(min, (Number(input.value) || 0) + delta);
        if (String(value) !== input.value) {
          input.value = value;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return;
      }

      const remove = event.target.closest('[data-cart-remove]');
      if (remove) {
        event.preventDefault();
        changeLine(Number(remove.closest('[data-cart-item]').dataset.line), 0);
      }
    });

    document.addEventListener('change', (event) => {
      const input = event.target.closest('[data-cart-quantity]');
      if (!input) return;
      changeLine(Number(input.closest('[data-cart-item]').dataset.line), Math.max(0, Number(input.value) || 0));
    });

    if (dim) dim.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (event) => event.key === 'Escape' && closeDrawer());

    document.addEventListener('submit', async (event) => {
      const form = event.target.closest('[data-product-form]');
      if (!form || theme.cartType !== 'drawer' || !$('[data-cart-drawer]')) return;
      event.preventDefault();

      const buttons = $$(`[data-add-button]`).filter((button) => button.form === form);
      const error = $('[data-form-error]', form);
      if (error) error.hidden = true;
      buttons.forEach((button) => button.classList.add('is-loading'));

      const body = new FormData(form);
      body.append('sections', cartSections().join(','));
      body.append('sections_url', window.location.pathname);

      try {
        const response = await fetch(theme.routes.cartAdd, {
          method: 'POST',
          headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.description || data.message || 'Could not add to bag');
        renderCartSections(data.sections);
        openDrawer();
      } catch (problem) {
        if (error) {
          error.textContent = problem.message;
          error.hidden = false;
        }
      } finally {
        buttons.forEach((button) => button.classList.remove('is-loading'));
      }
    });
  }

  /* ---------------------------------------------------------------------
     Product page: gallery, variant picker, sticky buy bar
     --------------------------------------------------------------------- */
  function initProduct(root = document) {
    $$('[data-product]', root).forEach((product) => {
      if (product.dataset.ready) return;
      product.dataset.ready = 'true';

      // Gallery
      const track = $('[data-gallery-track]', product);
      const thumbs = $$('[data-gallery-thumb]', product);
      const slides = track ? Array.from(track.children) : [];

      const goTo = (index, smooth = true) => {
        const slide = slides[index];
        if (!slide) return;
        track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
      };

      thumbs.forEach((thumb) => thumb.addEventListener('click', () => goTo(Number(thumb.dataset.galleryThumb))));
      if (track && thumbs.length) {
        track.addEventListener(
          'scroll',
          debounce(() => {
            const index = Math.round(track.scrollLeft / track.clientWidth);
            thumbs.forEach((thumb, i) => thumb.classList.toggle('is-active', i === index));
          }, 50),
          { passive: true }
        );
      }

      // Variants
      const dataElement = $('[data-variants]', product);
      const variants = dataElement ? JSON.parse(dataElement.textContent) : [];
      const idInput = $('[data-variant-id]', product);

      const updateVariant = () => {
        const selected = $$('[data-option-position]', product).map((fieldset) => {
          const checked = $('input:checked', fieldset);
          return checked ? checked.value : null;
        });
        const variant = variants.find((item) => item.options.every((value, index) => value === selected[index]));
        const labels = $$('[data-add-label]', product);
        const buttons = $$('[data-add-button]', product);

        if (!variant) {
          buttons.forEach((button) => (button.disabled = true));
          labels.forEach((label) => (label.textContent = theme.strings.unavailable));
          return;
        }

        idInput.value = variant.id;
        buttons.forEach((button) => (button.disabled = !variant.available));
        labels.forEach((label) => (label.textContent = variant.available ? theme.strings.addToBag : theme.strings.soldOut));
        $$('[data-product-price]', product).forEach((element) => (element.innerHTML = variant.price));

        if (variant.media) {
          const index = slides.findIndex((slide) => slide.dataset.mediaId === String(variant.media));
          if (index > -1) goTo(index);
        }

        const url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url);
      };

      product.addEventListener('change', (event) => {
        if (event.target.matches('[data-option-input]')) updateVariant();
      });

      // Sticky buy bar appears once the main button has scrolled out of view.
      const bar = $('[data-buy-bar]', product);
      const mainButton = $('.product__add', product);
      if (bar && mainButton && 'IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
          const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          bar.classList.toggle('is-visible', passed);
          bar.setAttribute('aria-hidden', String(!passed));
          $$('button', bar).forEach((button) => (button.tabIndex = passed ? 0 : -1));
        }).observe(mainButton);
      }
    });
  }

  function initRecommendations(root = document) {
    $$('[data-recommendations]', root).forEach(async (container) => {
      if (container.dataset.ready || container.children.length || !container.dataset.url) return;
      container.dataset.ready = 'true';
      try {
        const response = await fetch(container.dataset.url);
        if (!response.ok) return;
        const html = new DOMParser().parseFromString(await response.text(), 'text/html');
        const fresh = $('[data-recommendations]', html);
        if (!fresh || !fresh.children.length) return;
        container.innerHTML = fresh.innerHTML;
        initScrollers(container);
        initReveal(container);
      } catch (error) {
        console.error(error);
      }
    });
  }

  /* ---------------------------------------------------------------------
     Collection filters
     --------------------------------------------------------------------- */
  function initFilters(root = document) {
    $$('[data-filter-form]', root).forEach((form) => {
      if (form.dataset.ready) return;
      form.dataset.ready = 'true';
      const toggle = $('[data-filter-toggle]', form);
      const panel = $('[data-filters]', form);

      if (toggle && panel) {
        toggle.addEventListener('click', () => {
          panel.hidden = !panel.hidden;
          toggle.setAttribute('aria-expanded', String(!panel.hidden));
        });
      }

      form.addEventListener('change', (event) => {
        if (event.target.matches('[data-submit-on-change], input[type="checkbox"]')) form.requestSubmit();
      });

      // Keep URLs clean by not submitting empty fields.
      form.addEventListener('submit', () => {
        $$('input[type="number"]', form).forEach((input) => {
          if (input.value === '') input.disabled = true;
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  function initSection(root = document) {
    initReveal(root);
    initCountUp(root);
    initScrollers(root);
    initProduct(root);
    initRecommendations(root);
    initFilters(root);
    collectScrollTargets();
    requestScrollUpdate();
  }

  function boot() {
    initHeader();
    initCart();
    initSection();
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // Theme editor: re-initialise sections as merchants add, move and edit them.
  document.addEventListener('shopify:section:load', (event) => {
    initHeader();
    initSection(event.target);
  });
  document.addEventListener('shopify:section:unload', () => setTimeout(collectScrollTargets, 0));
  document.addEventListener('shopify:block:select', (event) => {
    event.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
  document.addEventListener('shopify:section:select', (event) => {
    if (event.target.querySelector('[data-cart-drawer]')) openDrawer();
  });
  document.addEventListener('shopify:section:deselect', (event) => {
    if (event.target.querySelector('[data-cart-drawer]')) closeDrawer();
  });

  // Restore state when the page is returned to from the back/forward cache.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    closeDrawer();
    $$('.is-loading').forEach((element) => element.classList.remove('is-loading'));
  });
})();
