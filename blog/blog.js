// M2 Energy · blog — nav scroll + índice (scroll-spy)
(function () {
  // Nav: fondo translúcido al hacer scroll
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 20); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Índice "En este artículo": resaltar la sección activa al hacer scroll
  var links = Array.prototype.slice.call(document.querySelectorAll('.post-toc a'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  var byId = {};
  var targets = [];
  links.forEach(function (a) {
    var id = (a.getAttribute('href') || '').slice(1);
    var el = id && document.getElementById(id);
    if (el) { byId[id] = a; targets.push(el); }
  });

  var current = null;
  function activate(a) {
    if (a === current) return;
    if (current) current.classList.remove('is-active');
    current = a;
    if (a) a.classList.add('is-active');
  }

  // Marca como activa la sección cuyo encabezado está más arriba dentro de la banda visible.
  var observer = new IntersectionObserver(function (entries) {
    var visible = entries.filter(function (e) { return e.isIntersecting; })
                         .map(function (e) { return e.target; });
    if (visible.length) {
      visible.sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
      activate(byId[visible[0].id]);
    }
  }, { rootMargin: '-96px 0px -62% 0px', threshold: 0 });

  targets.forEach(function (t) { observer.observe(t); });
})();
