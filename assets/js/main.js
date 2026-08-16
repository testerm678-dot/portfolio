/* =====================================================================
   Tuhin Hossain — Portfolio interactions
   Vanilla JS, no dependencies.
   ===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- Theme ---------------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('th-theme'); } catch (e) { /* private mode */ }

  // Dark is the intended first impression, so first-time visitors always get it
  // regardless of their OS setting. Only an explicit toggle switches to light.
  root.setAttribute('data-theme', stored === 'light' ? 'light' : 'dark');
  syncThemeColor();

  var themeToggle = $('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('th-theme', next); } catch (e) { /* ignore */ }
      syncThemeColor();
    });
  }

  function syncThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', root.getAttribute('data-theme') === 'light' ? '#F6F8FC' : '#0B1020');
  }

  /* ---------------- Mobile nav ---------------- */
  var burger = $('#navBurger');
  var navLinks = $('#navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* ---------------- Scroll: progress, sticky nav, back-to-top, active link ---------------- */
  var nav = $('#nav');
  var progress = $('#scrollProgress');
  var toTop = $('#toTop');
  var sections = $$('main section[id]');
  var linkMap = {};
  $$('#navLinks a').forEach(function (a) { linkMap[a.getAttribute('href').slice(1)] = a; });

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      var max = document.documentElement.scrollHeight - window.innerHeight;

      if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      if (nav) nav.classList.toggle('is-stuck', y > 8);
      if (toTop) toTop.classList.toggle('is-visible', y > 600);

      var current = '';
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop - 140 <= y) current = sections[i].id;
      }
      for (var id in linkMap) {
        if (Object.prototype.hasOwnProperty.call(linkMap, id)) {
          linkMap[id].classList.toggle('is-active', id === current);
        }
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Reveal on scroll ---------------- */
  var revealables = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('is-in'); }, i * 70);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Animated stat counters ---------------- */
  var counters = $$('.stats strong[data-count]');
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = format(target) + suffix; return; }
    var start = performance.now();
    var dur = 1400;
    function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(Math.round(target * eased)) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function format(n) { return n >= 1000 ? n.toLocaleString('en-US') : String(n); }

  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        cio.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------------- Project filters ---------------- */
  var filters = $$('.filter');
  var cards = $$('#projectGrid .pcard');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      cards.forEach(function (card) {
        var show = cat === 'all' || card.getAttribute('data-cat') === cat;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          card.classList.remove('is-in');
          // Re-trigger the reveal transition for newly shown cards.
          void card.offsetWidth;
          card.classList.add('is-in');
        }
      });
    });
  });

  /* ---------------- Terminal typing animation ---------------- */
  var term = $('#termBody');
  var LINES = [
    '<span class="d">$</span> <span class="b">pytest</span> tests/regression --headed',
    '<span class="d">collecting …</span> 128 tests across web · android · ios',
    '',
    '<span class="g">PASS</span>  auth/login_valid_credentials',
    '<span class="g">PASS</span>  pharmacy/create_invoice_stock_deduction',
    '<span class="g">PASS</span>  pharmacy/expiry_batch_alert',
    '<span class="r">FAIL</span>  checkout/apply_discount_boundary  <span class="d">→ logged JIRA-2184</span>',
    '<span class="g">PASS</span>  api/orders_schema_validation  <span class="d">(newman)</span>',
    '<span class="g">PASS</span>  mobile/release_candidate_smoke  <span class="d">(android 14)</span>',
    '',
    '<span class="d">$</span> <span class="b">newman</span> run Orders.postman_collection.json',
    '<span class="y">→</span> 42 requests · 0 failed assertions · avg 214 ms',
    '',
    '<span class="d">$</span> <span class="b">jmeter</span> -n -t load_500_users.jmx',
    '<span class="y">→</span> throughput 312/s · p95 1.8s · error 0.2%',
    '',
    '<span class="g">127 passed</span> · <span class="r">1 failed</span> · defect triaged · <span class="g">release: GO ✓</span>'
  ];

  function typeTerminal() {
    if (!term) return;
    if (reduceMotion) { term.innerHTML = LINES.join('\n'); return; }
    var li = 0;
    term.innerHTML = '';
    (function nextLine() {
      if (li >= LINES.length) {
        term.insertAdjacentHTML('beforeend', '\n<span class="d">$</span> <span class="cursor"></span>');
        return;
      }
      var line = LINES[li++];
      if (line === '') { term.insertAdjacentHTML('beforeend', '\n'); return setTimeout(nextLine, 90); }

      // Type the plain text, then swap in the marked-up line — keeps the
      // character-by-character feel without breaking the HTML tags.
      var plain = line.replace(/<[^>]+>/g, '');
      var holder = document.createElement('span');
      term.appendChild(holder);
      var ci = 0;
      (function typeChar() {
        holder.textContent = plain.slice(0, ++ci);
        if (ci < plain.length) return setTimeout(typeChar, 9);
        holder.innerHTML = line + '\n';
        setTimeout(nextLine, 150);
      })();
    })();
  }

  if (term && 'IntersectionObserver' in window) {
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        typeTerminal();
        tio.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    tio.observe(term);
  } else {
    typeTerminal();
  }

  /* ---------------- Contact form ----------------
     No backend: composes a pre-filled email. To use a real endpoint,
     see README (Formspree / Web3Forms swap is 2 lines).             */
  var form = $('#contactForm');
  var status = $('#formStatus');
  var MAIL_TO = 'tuhinhossain212209@gmail.com';

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      [['cf-name', function (v) { return v.trim().length > 1; }],
       ['cf-email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }],
       ['cf-message', function (v) { return v.trim().length > 9; }]
      ].forEach(function (pair) {
        var input = document.getElementById(pair[0]);
        var ok = pair[1](input.value);
        input.closest('.field').classList.toggle('is-invalid', !ok);
        if (!ok && valid) { input.focus(); }
        valid = valid && ok;
      });

      if (!valid) {
        if (status) { status.style.color = 'var(--fail)'; status.textContent = 'Please fix the highlighted fields.'; }
        return;
      }

      var name = $('#cf-name').value.trim();
      var email = $('#cf-email').value.trim();
      var subject = $('#cf-subject').value.trim() || ('Portfolio enquiry from ' + name);
      var message = $('#cf-message').value.trim();

      var body = message + '\n\n—\n' + name + '\n' + email;
      window.location.href = 'mailto:' + MAIL_TO +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      if (status) {
        status.style.color = 'var(--accent)';
        status.textContent = 'Opening your email app… if nothing happens, write to ' + MAIL_TO;
      }
    });

    $$('#contactForm input, #contactForm textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.closest('.field').classList.remove('is-invalid'); });
    });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

/* =====================================================================
   Cursor glow + hover highlight.
   The native cursor is left alone — hiding it costs the visitor the
   pointer hand and text caret they rely on. Instead a soft light
   trails the pointer and the component underneath warms up.
   Removable by deleting this block, its CSS section, and the
   .cursor-glow div in index.html.
   ===================================================================== */
(function () {
  'use strict';

  var glow = document.querySelector('.cursor-glow');
  if (!glow) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Components that may take the highlight — everything here is a block
  // with its own border/background, so a shadow sits correctly on it.
  var HOVERABLE = '.pcard, .card, .tl__card, .cinfo, .btn, .filter, .chip, .stack__group, .process li, .facts li, .icon-btn, .hero__social a';

  var body = document.body;
  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var gx = mx, gy = my, seen = false, current = null;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (!seen) { seen = true; gx = mx; gy = my; body.classList.add('glow-on'); }

    var hit = e.target.closest ? e.target.closest(HOVERABLE) : null;
    if (hit !== current) {
      if (current) current.classList.remove('is-hovered');
      if (hit) hit.classList.add('is-hovered');
      current = hit;
      body.classList.toggle('glow-hot', !!hit);
    }
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    body.classList.remove('glow-on', 'glow-hot');
    if (current) { current.classList.remove('is-hovered'); current = null; }
  });
  document.addEventListener('mouseenter', function () { body.classList.add('glow-on'); });

  // Never leave a highlight stuck behind after a click navigates or filters.
  document.addEventListener('click', function () {
    if (current) { current.classList.remove('is-hovered'); current = null; }
    body.classList.remove('glow-hot');
  });

  (function frame() {
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
    window.requestAnimationFrame(frame);
  })();
})();
