/* ============================================================
   app-switcher.js
   ────────────────
   Drop this in next to your app's other files and include it
   before </body>:

       <script src="app-switcher.js"></script>

   It turns the existing logo (the ".brand" element already in
   every app's #topbar) into a button that opens an animated
   dropdown listing the *other* apps in the suite, plus a
   blurred backdrop with a centered "made with love" / Ko-fi
   credit block.

   ── Companion files (same folder as this script) ──────────
     app-switcher.css              all visual styling/animation
     app-switcher-dropdown.html    dropdown panel markup
     app-switcher-credit.html      centered credit + Ko-fi block

   Edit the markup/wording of the dropdown or the credit block
   by editing those two .html files directly — this script only
   contains the logic (which app is "current", positioning,
   open/close behaviour). Nothing here needs to change when you
   tweak copy or styling.

   ── Adding / renaming / removing an app ────────────────────
   Just edit the APPS array below. The dropdown always shows
   every app except whichever one's logo matches the current
   page, so there's nothing else to keep in sync.

   ── Requirement ─────────────────────────────────────────────
   This script fetch()es the two .html partials above, so the
   suite needs to be served over http/https (a real host, or a
   local dev server such as `python -m http.server`). Opening an
   app directly as a file:// page will block those fetch calls —
   the browser's CORS rules don't allow it.
   ============================================================ */
(function () {
  'use strict';

  // ---- The suite ----------------------------------------------------
  // name  -> shown in the dropdown
  // logo  -> filename used to detect "is this the current app?"
  // href  -> where clicking the entry navigates to
  var APPS = [
    { name: 'QuickCollage', logo: 'QCLogo.png', href: 'QuickCollage.html' },
    { name: 'SequenceSpin', logo: 'SSLogo.png', href: 'SequenceSpin.html' },
    { name: 'SqueezeLight', logo: 'SLLogo.png', href: 'SqueezeLight.html' },
    { name: 'Code/Diff',    logo: 'CDLogo.png', href: 'CodeDiff.html' }
  ];

  // ---- Resolve companion files relative to *this* script -------------
  // (works no matter which folder the suite is served from, or whether
  // the html pages sit somewhere different than app-switcher.js)
  var scriptEl = document.currentScript;
  var BASE_URL = (scriptEl && scriptEl.src)
    ? scriptEl.src.slice(0, scriptEl.src.lastIndexOf('/') + 1)
    : '';

  var CSS_URL      = BASE_URL + 'app-switcher.css';
  var DROPDOWN_URL = BASE_URL + 'app-switcher-dropdown.html';
  var CREDIT_URL   = BASE_URL + 'app-switcher-credit.html';

  // ---- Load the stylesheet right away --------------------------------
  if (!document.querySelector('link[data-app-switcher]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_URL;
    link.setAttribute('data-app-switcher', '');
    document.head.appendChild(link);
  }

  var brandEl, backdropEl, dropdownEl, creditEl, listEl;
  var isOpen = false;
  var ready = false;

  function basename(path) {
    return (path || '').split('/').pop().split('?')[0].split('#')[0].toLowerCase();
  }

  // Which app is this page? Detected from the logo <img> already in
  // .brand, so it works regardless of URL/folder structure.
  function currentAppName() {
    var img = brandEl ? brandEl.querySelector('img') : null;
    var src = img ? basename(img.getAttribute('src')) : '';
    var match = null;
    APPS.forEach(function (app) {
      if (basename(app.logo) === src) match = app;
    });
    return match ? match.name : null;
  }

  // Quietly fetch the *other* apps' logos in the background on page load
  // (low priority — won't compete with this app's own assets) so they're
  // already cached by the time the dropdown is opened, instead of only
  // starting to load on that first click.
  function preloadLogos() {
    var here = currentAppName();
    APPS.filter(function (app) { return app.name !== here; }).forEach(function (app) {
      var link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = app.logo;
      link.setAttribute('fetchpriority', 'low');
      document.head.appendChild(link);
    });
  }

  function buildList() {
    listEl.innerHTML = '';
    var here = currentAppName();
    var others = APPS.filter(function (app) { return app.name !== here; });

    others.forEach(function (app, i) {
      // Each app's logo is already a wordmark (icon + name baked into the
      // image), so the button IS the logo — no extra text label needed.
      var item = document.createElement('a');
      item.className = 'as-app-item';
      item.href = app.href;
      item.title = app.name;
      item.setAttribute('role', 'menuitem');
      item.setAttribute('aria-label', 'Open ' + app.name);
      item.style.setProperty('--i', i);

      var img = document.createElement('img');
      img.src = app.logo;
      img.alt = app.name;

      item.appendChild(img);
      listEl.appendChild(item);
    });
  }

  function positionDropdown() {
    if (!brandEl || !dropdownEl) return;
    var r = brandEl.getBoundingClientRect();
    var panelW = dropdownEl.offsetWidth || 210;
    var left = r.left;
    var maxLeft = window.innerWidth - panelW - 12;
    if (left > maxLeft) left = Math.max(12, maxLeft);
    dropdownEl.style.left = left + 'px';
    dropdownEl.style.top = (r.bottom + 10) + 'px';
    dropdownEl.style.setProperty('--as-caret-left', (r.left + r.width / 2 - left) + 'px');
  }

  function openSwitcher() {
    if (!ready || isOpen) return;
    isOpen = true;
    buildList();
    document.body.classList.add('as-locked');
    backdropEl.classList.add('as-open');
    dropdownEl.classList.add('as-open');
    creditEl.classList.add('as-open');
    brandEl.classList.add('as-open');
    brandEl.setAttribute('aria-expanded', 'true');
    positionDropdown();
    window.addEventListener('resize', positionDropdown);
    window.addEventListener('scroll', positionDropdown, true);
  }

  function closeSwitcher() {
    if (!isOpen) return;
    isOpen = false;
    document.body.classList.remove('as-locked');
    backdropEl.classList.remove('as-open');
    dropdownEl.classList.remove('as-open');
    creditEl.classList.remove('as-open');
    brandEl.classList.remove('as-open');
    brandEl.setAttribute('aria-expanded', 'false');
    window.removeEventListener('resize', positionDropdown);
    window.removeEventListener('scroll', positionDropdown, true);
  }

  function toggleSwitcher(e) {
    if (e) e.preventDefault();
    if (isOpen) { closeSwitcher(); } else { openSwitcher(); }
  }

  function fetchText(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
      return res.text();
    });
  }

  function init() {
    brandEl = document.querySelector('#topbar .brand') || document.querySelector('.brand');
    if (!brandEl) return;

    brandEl.classList.add('as-trigger');
    brandEl.setAttribute('role', 'button');
    brandEl.setAttribute('tabindex', '0');
    brandEl.setAttribute('aria-haspopup', 'true');
    brandEl.setAttribute('aria-expanded', 'false');
    brandEl.title = 'Switch app';
    preloadLogos();

    // Small chevron so the logo visibly reads as "click me", and rotates
    // open/closed in sync with the dropdown.
    var chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chevron.setAttribute('class', 'as-trigger-chevron');
    chevron.setAttribute('viewBox', '0 0 24 24');
    chevron.setAttribute('fill', 'none');
    chevron.setAttribute('stroke', 'currentColor');
    chevron.setAttribute('stroke-width', '2.25');
    chevron.setAttribute('stroke-linecap', 'round');
    chevron.setAttribute('stroke-linejoin', 'round');
    chevron.setAttribute('aria-hidden', 'true');
    var chevronPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    chevronPath.setAttribute('d', 'M6 9l6 6 6-6');
    chevron.appendChild(chevronPath);
    brandEl.appendChild(chevron);

    backdropEl = document.createElement('div');
    backdropEl.id = 'as-backdrop';

    dropdownEl = document.createElement('div');
    dropdownEl.id = 'as-dropdown';
    dropdownEl.setAttribute('role', 'menu');

    creditEl = document.createElement('div');
    creditEl.id = 'as-credit';

    document.body.appendChild(backdropEl);
    document.body.appendChild(dropdownEl);
    document.body.appendChild(creditEl);

    Promise.all([fetchText(DROPDOWN_URL), fetchText(CREDIT_URL)])
      .then(function (results) {
        dropdownEl.innerHTML = results[0];
        creditEl.innerHTML = results[1];
        listEl = dropdownEl.querySelector('#as-app-list');
        ready = true;
      })
      .catch(function (err) {
        console.warn(
          '[app-switcher] could not load app-switcher-dropdown.html / ' +
          'app-switcher-credit.html (' + err.message + '). The suite needs ' +
          'to be served over http(s) — opening it directly as a file:// page ' +
          'blocks these fetch() calls. Try `python -m http.server` locally, ' +
          'or your real hosting once deployed.'
        );
      });

    brandEl.addEventListener('click', toggleSwitcher);
    brandEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') toggleSwitcher(e);
    });
    backdropEl.addEventListener('click', closeSwitcher);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSwitcher();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
