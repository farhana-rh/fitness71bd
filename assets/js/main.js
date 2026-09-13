/* =============================================================================
   THE FITNESS 71 — site behaviour
   Vanilla JS, no dependencies. Every feature degrades gracefully without it.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------------- */
  /* 1. Sticky header state                                                  */
  /* ---------------------------------------------------------------------- */
  var header = $('.site-header');
  var toTop  = $('.to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (toTop)  toTop.classList.toggle('is-visible', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 2. Mobile navigation                                                    */
  /* ---------------------------------------------------------------------- */
  var navToggle = $('.nav-toggle');
  var nav       = $('#site-nav');
  var scrim     = $('.nav-scrim');

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('is-open', open);
    if (scrim) scrim.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (scrim) scrim.addEventListener('click', function () { setNav(false); });

  // Close the drawer once a link is followed, and when returning to desktop.
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
  }
  var desktop = window.matchMedia('(min-width: 1121px)');
  (desktop.addEventListener ? desktop.addEventListener.bind(desktop, 'change')
                            : desktop.addListener.bind(desktop))(function (e) {
    if (e.matches) setNav(false);
  });

  /* ---------------------------------------------------------------------- */
  /* 3. Reveal on scroll                                                     */
  /* ---------------------------------------------------------------------- */
  var revealables = $$('[data-reveal]');
  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      // Stagger siblings that share a parent so grids cascade rather than pop.
      var seen = new Map();
      revealables.forEach(function (el) {
        var p = el.parentElement;
        var i = seen.get(p) || 0;
        seen.set(p, i + 1);
        if (!el.style.getPropertyValue('--d')) {
          el.style.setProperty('--d', Math.min(i, 6) * 80 + 'ms');
        }
        io.observe(el);
      });
    }
  }

  /* ---------------------------------------------------------------------- */
  /* 4. Stat counters                                                        */
  /* ---------------------------------------------------------------------- */
  var counters = $$('[data-count]');
  if (counters.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = el.dataset.count; });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          cio.unobserve(el);
          var target = parseFloat(el.dataset.count) || 0;
          var start = null;
          var dur = 1400;
          function step(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString('en-US');
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString('en-US');
          }
          requestAnimationFrame(step);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
    }
  }

  /* ---------------------------------------------------------------------- */
  /* 5. Pricing duration toggle                                              */
  /*    Prices live in data-price-* attributes on each .plan — edit there.    */
  /* ---------------------------------------------------------------------- */
  var priceToggle = $('.price-toggle');
  if (priceToggle) {
    var buttons = $$('button', priceToggle);

    function applyTerm(term) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-selected', String(b.dataset.term === term));
      });
      // Only plans that carry term pricing — personal-training packages are
      // also .plan elements but have a fixed per-package price.
      $$('.plan[data-price-1]').forEach(function (plan) {
        var amount = $('.plan__amount', plan);
        var per    = $('.plan__per', plan);
        var note   = $('.plan__note', plan);
        var price  = plan.getAttribute('data-price-' + term);
        if (amount && price) amount.textContent = price;
        if (per) per.textContent = ({
          '1':  '/ month',
          '3':  '/ 3 months',
          '6':  '/ 6 months',
          '12': '/ year'
        })[term] || '';
        if (note) {
          var saving = plan.getAttribute('data-save-' + term);
          note.textContent = saving || '';
          note.hidden = !saving;
        }
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { applyTerm(b.dataset.term); });
    });
    applyTerm('1');
  }

  /* ---------------------------------------------------------------------- */
  /* 6. Gallery filter + lightbox                                            */
  /* ---------------------------------------------------------------------- */
  var filters = $('.filters');
  var shots   = $$('.shot');

  if (filters && shots.length) {
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var cat = btn.dataset.filter;
      $$('button', filters).forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      shots.forEach(function (s) {
        s.hidden = !(cat === 'all' || s.dataset.category === cat);
      });
    });
  }

  var lightbox = $('.lightbox');
  if (lightbox && shots.length) {
    var lbImg   = $('.lightbox__fig img', lightbox);
    var lbCap   = $('.lightbox__cap', lightbox);
    var lastFocus = null;
    var index = 0;

    function visibleShots() { return shots.filter(function (s) { return !s.hidden; }); }

    function show(i) {
      var list = visibleShots();
      if (!list.length) return;
      index = (i + list.length) % list.length;
      var shot = list[index];
      var img  = $('img', shot);
      lbImg.src = img.getAttribute('data-full') || img.src;
      lbImg.alt = img.alt;
      lbCap.innerHTML = '<em>' + (shot.dataset.categoryLabel || '') + '</em>' +
                        (shot.dataset.caption || '') +
                        ' <span class="muted">(' + (index + 1) + ' / ' + list.length + ')</span>';
    }

    function openLb(i) {
      lastFocus = document.activeElement;
      show(i);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      $('.lightbox__close', lightbox).focus();
    }

    function closeLb() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }

    shots.forEach(function (shot) {
      shot.addEventListener('click', function () {
        openLb(visibleShots().indexOf(shot));
      });
    });

    $('.lightbox__close', lightbox).addEventListener('click', closeLb);
    $('.lightbox__prev', lightbox).addEventListener('click', function () { show(index - 1); });
    $('.lightbox__next', lightbox).addEventListener('click', function () { show(index + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLb();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowLeft')  show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  // Escape also closes the mobile drawer
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) setNav(false);
  });

  /* ---------------------------------------------------------------------- */
  /* 7. Contact / enquiry form                                               */
  /*    Front-end validation only. Wire the submit to a real endpoint —      */
  /*    see README "Contact form".                                           */
  /* ---------------------------------------------------------------------- */
  var form = $('#enquiry-form');
  if (form) {
    var status = $('#form-status');

    function fail(field, message) {
      var wrap = field.closest('.field');
      wrap.classList.add('has-error');
      var err = $('.field__err', wrap);
      if (err) err.textContent = message;
      field.setAttribute('aria-invalid', 'true');
    }

    function clear(field) {
      var wrap = field.closest('.field');
      wrap.classList.remove('has-error');
      field.removeAttribute('aria-invalid');
    }

    $$('input, select, textarea', form).forEach(function (f) {
      f.addEventListener('input', function () { clear(f); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var firstBad = null;

      var name = form.elements.name;
      var phone = form.elements.phone;
      var email = form.elements.email;
      var message = form.elements.message;
      var consent = form.elements.consent;

      if (!name.value.trim()) { fail(name, 'Please tell us your name.'); ok = false; firstBad = firstBad || name; }

      // Accepts 01XXXXXXXXX, +8801XXXXXXXXX, spaces and dashes.
      var digits = phone.value.replace(/[^0-9]/g, '');
      if (digits.length < 10 || digits.length > 15) {
        fail(phone, 'Enter a valid phone number, e.g. 01XXXXXXXXX.');
        ok = false; firstBad = firstBad || phone;
      }

      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        fail(email, 'That email address does not look right.');
        ok = false; firstBad = firstBad || email;
      }

      if (message.value.trim().length < 10) {
        fail(message, 'A sentence or two helps us answer properly.');
        ok = false; firstBad = firstBad || message;
      }

      if (consent && !consent.checked) {
        fail(consent, 'Please agree before sending.');
        ok = false; firstBad = firstBad || consent;
      }

      if (!ok) {
        if (firstBad) firstBad.focus();
        if (status) {
          status.hidden = false;
          status.innerHTML = '<strong>Check the highlighted fields.</strong>' +
                             'A couple of details are missing or look incorrect.';
        }
        return;
      }

      // --- Replace this block with a real POST to your backend / form service.
      if (status) {
        status.hidden = false;
        status.innerHTML = '<strong>Thanks, ' +
          name.value.trim().replace(/[<>&"]/g, '') +
          '.</strong>Your enquiry has been recorded. We usually reply within one working day — ' +
          'for anything urgent, call the gym directly.';
        status.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      form.reset();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 8. Footer year                                                          */
  /* ---------------------------------------------------------------------- */
  $$('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
