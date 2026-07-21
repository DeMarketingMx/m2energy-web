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

  // Etiquetas por idioma. El botón siempre ofrece cambiar a la OTRA versión.
  var STR = {
    es: { light: 'Clara', dark: 'Oscura', aria: 'Cambiar versión de color del sitio',
          toLight: 'Cambiar a versión clara', toDark: 'Cambiar a versión oscura' },
    en: { light: 'Light', dark: 'Dark', aria: 'Toggle site color version',
          toLight: 'Switch to light version', toDark: 'Switch to dark version' }
  };
  function lang() {
    try {
      if (window.M2i18n && M2i18n.getLang) return M2i18n.getLang();
    } catch (e) {}
    var l = document.documentElement.lang || 'es';
    return l.indexOf('en') === 0 ? 'en' : 'es';
  }

  function syncButton() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var isLight = current() === 'light';
    var s = STR[lang()] || STR.es;
    var icon = btn.querySelector('.theme-ico');
    var label = btn.querySelector('.theme-lbl');
    if (icon) icon.textContent = isLight ? '\u{1F319}' : '☀️'; // 🌙 / ☀️
    if (label) label.textContent = isLight ? s.dark : s.light;
    btn.setAttribute('aria-label', s.aria);
    btn.setAttribute('aria-pressed', String(isLight));
    btn.setAttribute('title', isLight ? s.toDark : s.toLight);
  }

  function injectStyles() {
    if (document.getElementById('m2-theme-css')) return;
    var css = document.createElement('style');
    css.id = 'm2-theme-css';
    // Mismas características que el toggle de idioma (.lang-toggle):
    // relleno ámbar, texto oscuro, glow pulsante, misma forma/tamaño.
    css.textContent =
      '.theme-toggle{display:inline-flex;align-items:center;gap:8px;cursor:pointer;' +
      "font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:12.5px;" +
      'letter-spacing:.08em;text-transform:uppercase;line-height:1;white-space:nowrap;' +
      'padding:10px 18px;border:none;border-radius:999px;' +
      'background:var(--amber,#f6be1f);color:#0a1620;' +
      'animation:m2ThemePulse 2.8s ease-in-out infinite;' +
      'transition:transform .2s, box-shadow .2s;}' +
      '.theme-toggle:hover{transform:translateY(-1px);animation:none;' +
      'box-shadow:0 0 0 2px rgba(246,190,31,.55),0 0 32px 8px rgba(246,190,31,.55),0 10px 28px -4px rgba(246,190,31,.8);}' +
      '.theme-toggle .theme-ico{font-size:14px;line-height:1;}' +
      '.theme-toggle.is-float{position:fixed;right:18px;bottom:18px;z-index:9999;}' +
      '@keyframes m2ThemePulse{' +
      '0%,100%{box-shadow:0 0 0 2px rgba(246,190,31,.30),0 0 16px 3px rgba(246,190,31,.32),0 6px 18px -4px rgba(246,190,31,.5);}' +
      '50%{box-shadow:0 0 0 3px rgba(246,190,31,.50),0 0 28px 7px rgba(246,190,31,.55),0 6px 22px -4px rgba(246,190,31,.75);}}';
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
      lang.parentNode.insertBefore(btn, lang.nextSibling); // a la DERECHA del idioma (esquina)
    } else {
      var right = document.querySelector('.nav-right');
      if (right) {
        right.appendChild(btn); // esquina derecha
      } else {
        btn.classList.add('is-float'); // fallback: pill flotante
        document.body.appendChild(btn);
      }
    }
    syncButton();
    // Re-localiza la etiqueta cuando i18n cambia el idioma (fija html[lang]/data-lang)
    try {
      new MutationObserver(syncButton).observe(document.documentElement, {
        attributes: true, attributeFilter: ['lang', 'data-lang']
      });
    } catch (e) {}
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
