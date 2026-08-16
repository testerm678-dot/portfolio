/* =====================================================================
   Tuhin Hossain — portfolio interactions
   Vanilla JS, no dependencies. Deliberately minimal: scroll-spy,
   form handling, footer year. No scroll-reveal animation — the design
   is meant to read as a dense document, not to fade in piece by piece.
   ===================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- Scroll-spy on the rail ---------------- */
  var sections = $$('main section[id]');
  var links = {};
  $$('#railNav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });

  var ticking = false;
  function spy() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      var current = '';
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop - 160 <= y) current = sections[i].id;
      }
      for (var id in links) {
        if (Object.prototype.hasOwnProperty.call(links, id)) {
          links[id].classList.toggle('is-active', id === current);
        }
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', spy);
  spy();

  /* ---------------- Contact form ----------------
     No backend: validates, then composes a pre-filled email.
     To post to a real endpoint instead, see README (Formspree swap). */
  var form = $('#contactForm');
  var status = $('#formStatus');
  var MAIL_TO = 'tuhinhossain212209@gmail.com';

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var checks = [
        ['cf-name', function (v) { return v.trim().length > 1; }],
        ['cf-email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }],
        ['cf-message', function (v) { return v.trim().length > 9; }]
      ];
      var valid = true;
      var firstBad = null;

      checks.forEach(function (pair) {
        var input = document.getElementById(pair[0]);
        var ok = pair[1](input.value);
        input.closest('.f').classList.toggle('is-invalid', !ok);
        if (!ok) { valid = false; if (!firstBad) firstBad = input; }
      });

      if (!valid) {
        if (firstBad) firstBad.focus();
        if (status) { status.style.color = 'var(--fail)'; status.textContent = '✕ Fix the highlighted fields'; }
        return;
      }

      var name = $('#cf-name').value.trim();
      var email = $('#cf-email').value.trim();
      var message = $('#cf-message').value.trim();
      var subject = 'Portfolio enquiry from ' + name;
      var body = message + '\n\n—\n' + name + '\n' + email;

      window.location.href = 'mailto:' + MAIL_TO +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      if (status) {
        status.style.color = 'var(--sig)';
        status.textContent = '→ Opening your mail app. If nothing happens, write to ' + MAIL_TO;
      }
    });

    $$('#contactForm input, #contactForm textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.closest('.f').classList.remove('is-invalid'); });
    });
  }

  /* ---------------- Footer year ---------------- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
