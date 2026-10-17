// Scroll-Reveal: blendet Inhaltsblöcke beim Scrollen sanft ein.
// Die .reveal-Klasse wird nur hier per JS vergeben — ohne JS bleibt alles sichtbar.
// Bei prefers-reduced-motion passiert nichts (Inhalte sofort sichtbar).
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var els = document.querySelectorAll(
    'h2, .section, .item, .phase, .parts > li, .liste > li, .dialog, figure, .tablewrap, .qa'
  );
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

  els.forEach(function (el) {
    el.classList.add('reveal');
    io.observe(el);
  });
})();
