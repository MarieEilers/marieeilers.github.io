// Hervorhebungen im Text: <mark> (Neon-Marker), .strich (Unterstreichung), .kreis (Kringel).
// Sie zeichnen sich, sobald sie beim Scrollen ins Bild kommen, je einmal.
// Ohne JS bleiben Marker und Strich sichtbar; bei prefers-reduced-motion stehen alle sofort da.
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  document.querySelectorAll('main .kreis').forEach(function (k) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 40');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', 'M54 4 C 22 1, 2 9, 3 21 C 4 33, 30 39, 56 37 C 83 35, 98 28, 97 18 C 96 7, 74 2, 44 6');
    p.setAttribute('pathLength', '1');
    svg.appendChild(p);
    k.appendChild(svg);
  });
  var els = document.querySelectorAll('main mark, main .marker, main .strich, main .kreis');
  var an = function (el) { el.classList.add('an'); };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach(an);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { an(e.target); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.6 });
  els.forEach(function (el) { io.observe(el); });
})();
