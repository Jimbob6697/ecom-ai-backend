/* Good Grain: label colours, hero jars, the jar story and product page extras. */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Label colours
     A card or page marked data-label-auto has no colour set in Shopify, so
     the colour is read from the middle of its product photo (where the label
     sits) and remembered for the rest of the visit.
     --------------------------------------------------------------------- */
  const rootStyle = getComputedStyle(document.documentElement);
  const inkBase = rootStyle.getPropertyValue('--color-text').trim() || '#0e3a5c';
  const onDark = rootStyle.getPropertyValue('--color-on-dark').trim() || '#fdf3d7';

  const toRgb = (hex) => {
    const value = parseInt(hex.replace('#', ''), 16);
    return [value >> 16, (value >> 8) & 255, value & 255];
  };
  const toHex = (rgb) => `#${rgb.map((part) => Math.round(part).toString(16).padStart(2, '0')).join('')}`;

  function applyLabel(element, hex) {
    const [r, g, b] = toRgb(hex);
    const bright = (r * 299 + g * 587 + b * 114) / 1000 > 165;
    let ink = hex;
    if (bright) {
      const base = /^#[0-9a-f]{6}$/i.test(inkBase) ? toRgb(inkBase) : [14, 58, 92];
      ink = toHex([r, g, b].map((part, index) => part * 0.45 + base[index] * 0.55));
    }
    element.style.setProperty('--label', hex);
    element.style.setProperty('--on-label', bright ? inkBase : onDark);
    element.style.setProperty('--label-ink', ink);
  }

  function readLabel(image) {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, size, size);
    const { data } = context.getImageData(0, 0, size, size);
    const bins = new Map();
    for (let y = Math.round(size * 0.35); y < size * 0.8; y += 1) {
      for (let x = Math.round(size * 0.18); x < size * 0.82; x += 1) {
        const offset = (y * size + x) * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        if (data[offset + 3] < 200) continue;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;
        const value = max / 255;
        // Skip the cream lettering, the glass and the oats themselves.
        if ((value > 0.93 && saturation < 0.25) || (saturation < 0.18 && value > 0.35)) continue;
        const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
        const bin = bins.get(key) || [0, 0, 0, 0];
        bin[0] += r;
        bin[1] += g;
        bin[2] += b;
        bin[3] += 1;
        bins.set(key, bin);
      }
    }
    let best = null;
    bins.forEach((bin) => {
      if (!best || bin[3] > best[3]) best = bin;
    });
    // A real label fills a good part of the photo. Anything less is a lifestyle shot.
    if (!best || best[3] < 260) return null;
    return toHex([best[0] / best[3], best[1] / best[3], best[2] / best[3]]);
  }

  function initLabels(root = document) {
    $$('[data-label-auto]', root).forEach((element) => {
      if (element.dataset.labelReady) return;
      element.dataset.labelReady = 'true';
      const image = $('img', element);
      if (!image) return;
      const key = `label:${(image.currentSrc || image.src).split('?')[0]}`;
      const finish = (hex) => {
        if (!hex) return;
        applyLabel(element, hex);
        if (element.hasAttribute('data-label-page')) applyLabel(document.body, hex);
        element.dispatchEvent(new CustomEvent('label:ready', { bubbles: true }));
      };
      try {
        const saved = sessionStorage.getItem(key);
        if (saved) return finish(saved === 'none' ? null : saved);
      } catch (error) {
        /* storage unavailable */
      }
      const read = () => {
        let hex = null;
        try {
          hex = readLabel(image);
        } catch (error) {
          return; // the photo could not be read (cross-origin); keep the default colour
        }
        try {
          sessionStorage.setItem(key, hex || 'none');
        } catch (error) {
          /* storage unavailable */
        }
        finish(hex);
      };
      if (image.complete && image.naturalWidth) read();
      else image.addEventListener('load', read, { once: true });
    });
  }

  /* ---------------------------------------------------------------------
     Cut-out check: a PNG is treated as a cut-out jar and floated on a coloured
     disc. If its corners turn out to be solid it is an ordinary photo, so it
     is shown edge to edge instead.
     --------------------------------------------------------------------- */
  function initCutouts(root = document) {
    $$('.product-card--cutout, .product__slide--jar', root).forEach((holder) => {
      if (holder.dataset.cutoutReady) return;
      holder.dataset.cutoutReady = 'true';
      const image = $('img', holder);
      if (!image) return;
      const check = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 24;
          canvas.height = 24;
          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0, 24, 24);
          const corners = [context.getImageData(0, 0, 1, 1), context.getImageData(23, 0, 1, 1), context.getImageData(0, 23, 1, 1)];
          if (corners.every((pixel) => pixel.data[3] > 250)) {
            holder.classList.toggle('product-card--cutout', false);
            holder.classList.toggle('product__slide--jar', false);
            holder.classList.add('is-photo');
          }
        } catch (error) {
          /* the photo could not be read; leave it as it is */
        }
      };
      if (image.complete && image.naturalWidth) check();
      else image.addEventListener('load', check, { once: true });
    });
  }

  /* ---------------------------------------------------------------------
     Hero: the background drifts through each jar's label colour
     --------------------------------------------------------------------- */
  function initHero(root = document) {
    $$('[data-hero-jars]', root).forEach((hero) => {
      if (hero.dataset.ready) return;
      hero.dataset.ready = 'true';
      const jars = $$('[data-hero-jar]', hero);
      if (!jars.length) return;
      let index = 0;
      let timer = null;

      const show = (next) => {
        index = (next + jars.length) % jars.length;
        const jar = jars[index];
        jars.forEach((item) => item.classList.toggle('is-active', item === jar));
        ['--label', '--on-label', '--label-ink'].forEach((name) => {
          const value = jar.style.getPropertyValue(name);
          if (value) hero.style.setProperty(name, value);
          else hero.style.removeProperty(name);
        });
      };
      const play = () => {
        if (reduceMotion || jars.length < 2) return;
        clearInterval(timer);
        timer = setInterval(() => show(index + 1), 3600);
      };

      jars.forEach((jar, position) => {
        jar.addEventListener('pointerenter', () => {
          clearInterval(timer);
          show(position);
        });
        jar.addEventListener('focus', () => {
          clearInterval(timer);
          show(position);
        });
        jar.addEventListener('pointerleave', play);
        jar.addEventListener('blur', play);
      });
      hero.addEventListener('label:ready', () => show(index));

      if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
        hero.addEventListener('pointermove', (event) => {
          const box = hero.getBoundingClientRect();
          hero.style.setProperty('--mx', ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
          hero.style.setProperty('--my', ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
        });
      }

      // Only cycle while the hero is on screen.
      new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : clearInterval(timer))).observe(hero);
      show(0);
    });
  }

  /* ---------------------------------------------------------------------
     Into the jar: scroll position drives each ingredient and its layer
     --------------------------------------------------------------------- */
  const stories = [];

  function updateStories() {
    stories.forEach(({ section, steps }) => {
      const box = section.getBoundingClientRect();
      const distance = box.height - window.innerHeight;
      if (distance <= 0 || box.bottom < -200 || box.top > window.innerHeight + 200) return;
      const count = steps.length - 1;
      const progress = clamp(-box.top / distance, 0, 1);
      const position = progress * (count + 0.75);
      for (let step = 0; step < count; step += 1) {
        section.style.setProperty(`--l${step}`, clamp(position - step, 0, 1).toFixed(3));
      }
      section.style.setProperty('--lf', clamp((position - count) / 0.5, 0, 1).toFixed(3));
      section.style.setProperty('--p', progress.toFixed(3));
      const active = Math.min(count, Math.floor(position));
      steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === active));
    });
  }

  function initStories(root = document) {
    $$('[data-jar-story]', root).forEach((section) => {
      if (section.dataset.ready) return;
      section.dataset.ready = 'true';
      if (reduceMotion || (window.Shopify && window.Shopify.designMode)) return;
      section.classList.add('is-live');
      stories.push({ section, steps: $$('[data-jar-step]', section) });
    });
    updateStories();
  }

  /* ---------------------------------------------------------------------
     Product page
     --------------------------------------------------------------------- */
  function initProduct(root = document) {
    // Protein and fibre bubbles: use figures written in the description when no metafield is set.
    $$('[data-stats]', root).forEach((list) => {
      const description = $('[data-product-description]', list.closest('[data-product]') || document);
      if (!description) return;
      const text = description.textContent;
      [
        ['protein', /(\d+(?:\.\d+)?)\s*g\s+(?:of\s+)?protein/i],
        ['fibre', /(\d+(?:\.\d+)?)\s*g\s+(?:of\s+)?fib(?:re|er)/i],
      ].forEach(([name, pattern]) => {
        const item = $(`[data-stat="${name}"]`, list);
        if (!item || !item.hidden) return;
        const found = text.match(pattern);
        if (!found) return;
        $('[data-stat-value]', item).textContent = `${found[1]}g`;
        item.hidden = false;
      });
    });
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateStories();
      const jar = $('.product__slide--jar');
      if (jar && !reduceMotion) jar.style.setProperty('--scroll', clamp(window.scrollY / 700, 0, 1).toFixed(3));
    });
  }

  function init(root = document) {
    initLabels(root);
    initCutouts(root);
    initHero(root);
    initStories(root);
    initProduct(root);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  document.addEventListener('shopify:section:load', (event) => init(event.target));
  // Cards that arrive later (recommendations, filtered collections, the basket).
  new MutationObserver((records) => {
    if (records.some((record) => [...record.addedNodes].some((node) => node.nodeType === 1))) {
      initLabels();
      initCutouts();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
