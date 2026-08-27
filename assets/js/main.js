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
     Posts to Web3Forms, which forwards each message to the address its access
     key is registered to. The visitor never leaves the page.

     SETUP (once): go to https://web3forms.com, enter MAIL_TO below — the
     mailbox you actually read — and they email back an access key. Paste it
     into ACCESS_KEY.

     The key is publishable by design: it only ever routes mail to the address
     it was created with, so it is safe in client-side code.

     Because the free plan keeps no copy of submissions, the registered address
     IS the only record. A key made against the wrong mailbox silently sends
     every message into a void while the API still answers success:true — that
     has happened here before. After changing the key, always send a real test
     submission and confirm it arrives; never trust the HTTP response alone. */
  var ACCESS_KEY   = 'd4603986-a5fa-4d37-ac8a-1fa71a76b692';
  var ENDPOINT     = 'https://api.web3forms.com/submit';
  var MAIL_TO      = 'tuhinhossain212209@gmail.com';
  var SEND_TIMEOUT = 15000;

  /* Second destination: a Google Apps Script web app that appends each
     submission to a spreadsheet. Web3Forms keeps no copy, so without this there
     is no way to answer "did that message arrive?" except by searching an inbox
     — which is how a real submission once looked lost for hours. Paste the
     deployed /exec URL here; leave it empty and the form simply emails only. */
  var SHEET_URL    = '';

  // Web3Forms keys are UUIDs; the placeholder above cannot pass this, so it can
  // never be posted as though it were a real key.
  var hasKey  = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ACCESS_KEY);
  var canPost = hasKey && typeof window.fetch === 'function';
  // Real Apps Script deployment ids run ~57 characters; the length floor is what
  // stops a half-pasted placeholder from being treated as a live endpoint.
  var canLog  = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]{25,}\/exec$/.test(SHEET_URL) &&
                typeof window.fetch === 'function';

  // Turns a rejection into a resolved outcome, so one dead channel cannot stop
  // the other from being awaited.
  function reflect(channel, p) {
    return p.then(
      function ()    { return { channel: channel, ok: true }; },
      function (err) { return { channel: channel, ok: false, error: err }; }
    );
  }

  function withTimeout(run) {
    var controller = window.AbortController ? new window.AbortController() : null;
    var timer = window.setTimeout(function () { if (controller) controller.abort(); }, SEND_TIMEOUT);
    return run(controller ? controller.signal : undefined)
      .then(function (v) { window.clearTimeout(timer); return v; },
            function (e) { window.clearTimeout(timer); throw e; });
  }

  function sendEmail(d) {
    return withTimeout(function (signal) {
      return window.fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: d.subject,
          from_name: 'Portfolio contact form',
          name: d.name,
          email: d.email,
          replyto: d.email,       // replying to the notification reaches the visitor
          message: d.message
        }),
        signal: signal
      }).then(function (res) {
        return res.json()
          .catch(function () { return {}; })
          .then(function (data) {
            if (!res.ok || data.success === false) {
              throw new Error(data.message || ('HTTP ' + res.status));
            }
          });
      });
    });
  }

  function sendToSheet(d) {
    return withTimeout(function (signal) {
      // text/plain keeps this a CORS "simple request", so Apps Script never has
      // to answer a preflight it does not handle.
      return window.fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(d),
        signal: signal
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
      });
    });
  }

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

      if (!canPost && !canLog) { mailtoFallback(name, email, subject, message); return; }

      setBusy(true);
      var payload = { name: name, email: email, subject: subject, message: message };

      // Both destinations are attempted at once. The visitor is told the message
      // was sent only if at least one of them actually accepted it, so a green
      // toast always means the message exists somewhere.
      var jobs = [];
      if (canPost) jobs.push(reflect('email', sendEmail(payload)));
      if (canLog)  jobs.push(reflect('sheet', sendToSheet(payload)));

      Promise.all(jobs).then(function (results) {
        var kept = results.filter(function (r) { return r.ok; });
        var lost = results.filter(function (r) { return !r.ok; });

        // A partial failure still means the message survived, but it should not
        // pass silently — the surviving channel may be the one without email.
        lost.forEach(function (r) {
          if (window.console && console.warn) console.warn('Contact form: ' + r.channel + ' failed —', r.error);
        });

        if (kept.length) {
          form.reset();
          $$('#contactForm .field').forEach(function (f) { f.classList.remove('is-invalid'); });
          toast({
            kind: 'ok',
            title: 'Message sent',
            message: 'Thanks ' + name.split(/\s+/)[0] + ' — it has reached me. I reply within 24 hours on working days.',
            ttl: 7000
          });
        } else {
          toast({
            kind: 'err',
            title: 'That did not send',
            message: 'Something went wrong on the way. Your message is still in the form — please try again, or email me at',
            link: { href: 'mailto:' + MAIL_TO, text: MAIL_TO },
            ttl: 12000
          });
        }
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

    /* ---------------- Visitor counter ----------------
      The endpoint is optional so the static portfolio remains usable before
      the Apps Script web app is deployed. sessionStorage makes one browser
      session count once while keeping the visitor anonymous. */
  var VISITOR_ENDPOINT = SHEET_URL;
  var visitorTotal = $('#visitorTotal');
  if (visitorTotal && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]{25,}\/exec$/.test(VISITOR_ENDPOINT)) {
    var sessionId = null;
    try {
      sessionId = sessionStorage.getItem('th-visitor-session');
      if (!sessionId) {
        sessionId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() :
          String(Date.now()) + '-' + Math.random().toString(36).slice(2);
        sessionStorage.setItem('th-visitor-session', sessionId);
      }
    } catch (e) { /* private mode or blocked storage */ }

    if (sessionId) {
      var callbackName = '__thVisitorCallback';
      var script = document.createElement('script');
      var cleanup = function () {
        window[callbackName] = null;
        if (script.parentNode) script.parentNode.removeChild(script);
      };
      window[callbackName] = function (data) {
        if (data && typeof data.total === 'number') visitorTotal.textContent = format(data.total);
        cleanup();
      };
      script.onerror = cleanup;
      script.src = VISITOR_ENDPOINT + '?session=' + encodeURIComponent(sessionId) + '&callback=' + callbackName;
      document.head.appendChild(script);
    }
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
