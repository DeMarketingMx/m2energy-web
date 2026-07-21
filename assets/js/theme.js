/* ============================================================
   M2 Energy — Theme toggle (Oscura / Clara)
   Light version validada contra WCAG AA (contraste >=4.5:1).
   El default es la versión oscura actual; "clara" es opt-in y
   se recuerda en localStorage para que el comparativo persista.
   ============================================================ */
(function () {
  var KEY = 'm2-theme';
  var root = document.documentElement;

  function current() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply(theme) {
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    syncButton();
  }

  function syncButton() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var isLight = current() === 'light';
    // El botón ofrece cambiar a la OTRA versión.
    var icon = btn.querySelector('.theme-ico');
    var label = btn.querySelector('.theme-lbl');
    if (icon) icon.textContent = isLight ? '\u{1F319}' : '☀️'; // 🌙 / ☀️
    if (label) label.textContent = isLight ? 'Oscura' : 'Clara';
    btn.setAttribute('aria-pressed', String(isLight));
    btn.setAttribute('title', isLight ? 'Cambiar a versión oscura' : 'Cambiar a versión clara');
  }

  function injectStyles() {
    if (document.getElementById('m2-theme-css')) return;
    var css = document.createElement('style');
    css.id = 'm2-theme-css';
    css.textContent =
      '.theme-toggle{display:inline-flex;align-items:center;gap:7px;cursor:pointer;' +
      'font-family:inherit;font-size:13px;font-weight:600;letter-spacing:.02em;' +
      'padding:8px 14px;border-radius:999px;border:1px solid var(--line-str,rgba(255,255,255,.18));' +
      'background:var(--amber-soft,rgba(246,190,31,.10));color:var(--ink,#fafcff);' +
      'transition:transform .2s,border-color .2s,background .2s;line-height:1;white-space:nowrap;}' +
      '.theme-toggle:hover{transform:translateY(-1px);border-color:var(--amber);' +
      'background:var(--amber-soft,rgba(246,190,31,.18));}' +
      '.theme-toggle .theme-ico{font-size:14px;line-height:1;}' +
      '.theme-toggle.is-float{position:fixed;right:18px;bottom:18px;z-index:9999;' +
      'box-shadow:0 8px 28px -8px rgba(0,0,0,.5);backdrop-filter:blur(8px);}';
    document.head.appendChild(css);
  }

  function makeButton() {
    var btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Cambiar versión de color del sitio');
    var ico = document.createElement('span');
    ico.className = 'theme-ico';
    ico.setAttribute('aria-hidden', 'true');
    var lbl = document.createElement('span');
    lbl.className = 'theme-lbl';
    btn.appendChild(ico);
    btn.appendChild(lbl);
    btn.addEventListener('click', function () {
      apply(current() === 'light' ? 'dark' : 'light');
    });
    return btn;
  }

  function mount() {
    injectStyles();
    if (document.getElementById('themeToggle')) { syncButton(); return; }
    var btn = makeButton();
    var lang = document.getElementById('langToggle');
    if (lang && lang.parentNode) {
      lang.parentNode.insertBefore(btn, lang); // a la izquierda del toggle de idioma
    } else {
      var right = document.querySelector('.nav-right');
      if (right) {
        right.insertBefore(btn, right.firstChild);
      } else {
        btn.classList.add('is-float'); // fallback: pill flotante
        document.body.appendChild(btn);
      }
    }
    syncButton();
  }

  // Estado inicial: ?theme= en la URL manda (para links directos al comparativo),
  // si no, lo guardado en localStorage. (El snippet inline del <head> ya cubre no-FOUC.)
  try {
    var q = (location.search.match(/[?&]theme=(light|dark)/) || [])[1];
    if (q) { apply(q); }
    else if (localStorage.getItem(KEY) === 'light') root.setAttribute('data-theme', 'light');
  } catch (e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
