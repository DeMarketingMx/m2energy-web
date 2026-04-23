/* ==========================================================
   M2 Energy — i18n Engine
   Storage : localStorage key "m2energy_lang"  default: "es"
   Button  : shows TARGET language (🇺🇸 ENG when in ES, 🇲🇽 ESP when in EN)
   ========================================================== */
(function () {
  var STORAGE_KEY = 'm2energy_lang';
  var DEFAULT_LANG = 'es';

  function getLang() {
    try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; } catch (e) { return DEFAULT_LANG; }
  }
  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }
  function getVal(obj, path) {
    return path.split('.').reduce(function (o, k) { return o && o[k] !== undefined ? o[k] : undefined; }, obj);
  }

  function applyLang(lang) {
    if (!window.M2_TRANSLATIONS || !window.M2_TRANSLATIONS[lang]) return;
    var t = window.M2_TRANSLATIONS[lang];

    // Set html[lang] and html[data-lang]
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    // data-i18n → textContent
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = getVal(t, el.getAttribute('data-i18n'));
      if (v !== undefined) el.textContent = v;
    });

    // data-i18n-html → innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = getVal(t, el.getAttribute('data-i18n-html'));
      if (v !== undefined) el.innerHTML = v;
    });

    // data-i18n-placeholder → placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = getVal(t, el.getAttribute('data-i18n-placeholder'));
      if (v !== undefined) el.placeholder = v;
    });

    // data-i18n-aria → aria-label attribute
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = getVal(t, el.getAttribute('data-i18n-aria'));
      if (v !== undefined) el.setAttribute('aria-label', v);
    });

    // Toggle button: show TARGET language
    var flag  = document.getElementById('langFlag');
    var label = document.getElementById('langLabel');
    if (flag && label) {
      if (lang === 'es') { flag.textContent = '🇺🇸'; label.textContent = 'ENG'; }
      else               { flag.textContent = '🇲🇽'; label.textContent = 'ESP'; }
    }
  }

  window.M2i18n = {
    init: function () { applyLang(getLang()); },
    toggle: function () {
      var next = getLang() === 'es' ? 'en' : 'es';
      setLang(next);
      applyLang(next);
    },
    getLang: getLang,
    setLang: setLang
  };
})();
