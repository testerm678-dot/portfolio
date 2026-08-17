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

  /* ---------------- Toasts ----------------
     Each toast announces itself (role=status / role=alert), so the wrapper is
     deliberately not a live region — that would double up the announcement.
     #formStatus stays the live region for field validation only; the two never
     fire at the same time.                                               */
  var toastWrap = $('#toastWrap');
  var MAX_TOASTS = 3;

  var SVG = {
    ok:    '<path d="M20 6 9 17l-5-5"/>',
    err:   '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    info:  '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2.5 7.5 9.5 6.5 9.5-6.5"/>',
    close: '<path d="M18 6 6 18"/><path d="M6 6l12 12"/>'
  };

  function icon(path, size) {
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" ' +
           'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
  }

  /* opts: { kind: 'ok'|'err'|'info', title, message, link: {href, text}, ttl } */
  function toast(opts) {
    if (!toastWrap) return;
    var kind = opts.kind || 'info';
    var ttl = opts.ttl || 6000;

    while (toastWrap.children.length >= MAX_TOASTS) {
      toastWrap.removeChild(toastWrap.firstChild);
    }

    var el = document.createElement('div');
    el.className = 'toast toast--' + kind;
    el.setAttribute('role', kind === 'err' ? 'alert' : 'status');
    el.innerHTML =
      '<span class="toast__ic">' + icon(SVG[kind], 18) + '</span>' +
      '<div class="toast__body"><strong class="toast__title"></strong><p class="toast__msg"></p></div>' +
      '<button class="toast__close" type="button" aria-label="Dismiss notification">' + icon(SVG.close, 14) + '</button>' +
      '<span class="toast__bar"></span>';

    // Titles and messages can carry a visitor's name, so they go in as text.
    el.querySelector('.toast__title').textContent = opts.title || '';
    var msg = el.querySelector('.toast__msg');
    msg.textContent = opts.message || '';
    if (opts.link) {
      msg.appendChild(document.createTextNode(' '));
      var a = document.createElement('a');
      a.href = opts.link.href;
      a.textContent = opts.link.text;
      msg.appendChild(a);
    }

    var bar = el.querySelector('.toast__bar');
    bar.style.animationDuration = ttl + 'ms';

    var timer = null, remaining = ttl, startedAt = 0, closed = false;

    function start() {
      startedAt = Date.now();
      timer = window.setTimeout(dismiss, remaining);
      bar.style.animationPlayState = 'running';
    }
    function hold() {
      if (timer === null) return;
      window.clearTimeout(timer);
      timer = null;
      remaining -= (Date.now() - startedAt);
      bar.style.animationPlayState = 'paused';
    }
    function resume() {
      if (timer !== null || closed) return;
      if (remaining < 1200) remaining = 1200;  // always leave time to read after a hover
      start();
    }
    function dismiss() {
      if (closed) return;
      closed = true;
      window.clearTimeout(timer);
      el.classList.remove('is-in');
      el.classList.add('is-out');
      var remove = function () { if (el.parentNode) el.parentNode.removeChild(el); };
      el.addEventListener('transitionend', remove, { once: true });
      window.setTimeout(remove, 500);  // fallback if the transition never fires
    }

    el.querySelector('.toast__close').addEventListener('click', dismiss);
    el.addEventListener('mouseenter', hold);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('focusin', hold);
    el.addEventListener('focusout', resume);

    toastWrap.appendChild(el);
    void el.offsetWidth;             // reflow, so the entry transition actually runs
    el.classList.add('is-in');
    start();
  }

  /* ---------------- Contact form ----------------
     Posts to Formspree, which keeps every submission in a dashboard as well as
     emailing it on. The dashboard is the point: if a notification email is ever
     filtered, bounced or sent to the wrong mailbox, the message is still there
     to read — a recruiter's message can never silently vanish.

     SETUP (once): sign up at https://formspree.io using the mailbox you
     actually read, create a form, and paste its endpoint below. Until a valid
     endpoint is in place the form falls back to opening the visitor's mail
     client, so it never claims a message was sent when it was not. */
  var ENDPOINT     = 'https://formspree.io/f/PASTE-YOUR-FORM-ID';
  var MAIL_TO      = 'tuhinhossain212209@gmail.com';
  var SEND_TIMEOUT = 15000;

  // Shape check on the endpoint. Formspree form IDs are alphanumeric, so the
  // hyphens in the placeholder above make it fail here — it can never be
  // posted to as though it were a real form.
  var hasEndpoint = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]{6,}$/.test(ENDPOINT);
  var canPost = hasEndpoint && typeof window.fetch === 'function';

  var form = $('#contactForm');
  var status = $('#formStatus');
  var submitBtn = $('#cfSubmit');
  var btnText = submitBtn ? submitBtn.querySelector('.btn__text') : null;
  var sending = false;

  function setBusy(on) {
    sending = on;
    if (form) form.classList.toggle('is-sending', on);
    if (!submitBtn) return;
    submitBtn.classList.toggle('is-busy', on);
    submitBtn.disabled = on;
    submitBtn.setAttribute('aria-busy', on ? 'true' : 'false');
    if (btnText) btnText.textContent = on ? 'Sending…' : 'Send message';
  }

  function clearStatus() {
    if (status) { status.textContent = ''; status.style.color = ''; }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sending) return;

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
      clearStatus();

      var name = $('#cf-name').value.trim();
      var email = $('#cf-email').value.trim();
      var subject = $('#cf-subject').value.trim() || ('Portfolio enquiry from ' + name);
      var message = $('#cf-message').value.trim();
      var trap = $('#cf-company');

      // Honeypot filled means a bot. Show the same success it expects and drop it.
      if (trap && trap.value) {
        form.reset();
        toast({ kind: 'ok', title: 'Message sent', message: 'Thanks — I will be in touch.' });
        return;
      }

      if (!canPost) { mailtoFallback(name, email, subject, message); return; }

      setBusy(true);
      var controller = window.AbortController ? new window.AbortController() : null;
      var timeout = window.setTimeout(function () { if (controller) controller.abort(); }, SEND_TIMEOUT);

      window.fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,             // Formspree uses this as the reply-to address
          _subject: subject,
          message: message
        }),
        signal: controller ? controller.signal : undefined
      })
        .then(function (res) {
          return res.json()
            .catch(function () { return {}; })
            .then(function (data) {
              if (!res.ok) {
                var errs = data.errors;
                throw new Error(errs && errs.length ? errs[0].message : ('HTTP ' + res.status));
              }
            });
        })
        .then(function () {
          form.reset();
          $$('#contactForm .field').forEach(function (f) { f.classList.remove('is-invalid'); });
          toast({
            kind: 'ok',
            title: 'Message sent',
            message: 'Thanks ' + name.split(/\s+/)[0] + ' — it is in my inbox. I reply within 24 hours on working days.',
            ttl: 7000
          });
        })
        .catch(function (err) {
          if (window.console && console.warn) console.warn('Contact form:', err);
          toast({
            kind: 'err',
            title: 'That did not send',
            message: 'Something went wrong on the way. Your message is still in the form — please try again, or email me at',
            link: { href: 'mailto:' + MAIL_TO, text: MAIL_TO },
            ttl: 12000
          });
        })
        .then(function () {
          window.clearTimeout(timeout);
          setBusy(false);
        });
    });

    $$('#contactForm input, #contactForm textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        var field = el.closest('.field');
        if (field) field.classList.remove('is-invalid');
        if (status && status.textContent) clearStatus();
      });
    });
  }

  function mailtoFallback(name, email, subject, message) {
    var body = message + '\n\n—\n' + name + '\n' + email;
    window.location.href = 'mailto:' + MAIL_TO +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    toast({
      kind: 'info',
      title: 'Opening your mail app',
      message: 'Your message is drafted and ready to send. If nothing opened, write to',
      link: { href: 'mailto:' + MAIL_TO, text: MAIL_TO },
      ttl: 11000
    });
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

/* =====================================================================
   Cursor effects.
   The pointer itself is a native CSS cursor (see the cursor block in
   styles.css), so it never lags. This adds the two moving parts:
   a wide aurora that eases along behind it, and two ripples per click.
   Removable by deleting this block and that CSS section.
   ===================================================================== */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var body = document.body;

  var fx = document.createElement('div');
  fx.className = 'cursor-fx';
  fx.setAttribute('aria-hidden', 'true');
  body.appendChild(fx);

  /* ---- aurora: only meaningful with a real pointer ---- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var aurora = document.createElement('div');
    aurora.className = 'cursor-aurora';
    aurora.setAttribute('aria-hidden', 'true');
    body.appendChild(aurora);

    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var cx = tx, cy = ty, running = false, landed = false;

    // The loop parks itself once the aurora has caught up, rather than
    // burning a frame callback forever while the pointer sits still.
    function follow() {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      aurora.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) {
        window.requestAnimationFrame(follow);
      } else {
        running = false;
      }
    }

    document.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!landed) {          // first move: land it there, don't sweep in from centre
        landed = true;
        cx = tx; cy = ty;
        aurora.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
        body.classList.add('aurora-on');
      }
      if (!running) { running = true; window.requestAnimationFrame(follow); }
    }, { passive: true });

    document.addEventListener('mouseleave', function () { body.classList.remove('aurora-on'); });
    document.addEventListener('mouseenter', function () { if (landed) body.classList.add('aurora-on'); });
  }

  /* ---- click ripples ---- */
  function wave(x, y, cls) {
    var r = document.createElement('span');
    r.className = cls;
    r.style.left = x + 'px';
    r.style.top = y + 'px';
    fx.appendChild(r);
    var drop = function () { if (r.parentNode) r.parentNode.removeChild(r); };
    r.addEventListener('animationend', drop);
    window.setTimeout(drop, 2900);   // fallback if the animation never ends
  }

  document.addEventListener('pointerdown', function (e) {
    wave(e.clientX, e.clientY, 'ripple');
    wave(e.clientX, e.clientY, 'ripple ripple--slow');
  }, { passive: true });
})();
