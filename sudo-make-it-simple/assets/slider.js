// Slider: Pfeile, Zähler und Pfeiltasten für [data-slider]. Ohne JS bleibt die Spur wischbar.
(function () {
  document.querySelectorAll('[data-slider]').forEach(function (f) {
    var spur = f.querySelector('.slider-spur');
    var bilder = spur.querySelectorAll('img');
    var zaehler = f.querySelector('.slider-zaehler');
    var zurueck = f.querySelector('.zurueck'), weiter = f.querySelector('.weiter');
    var n = bilder.length;
    function index() { return Math.round(spur.scrollLeft / spur.clientWidth); }
    function zwei(x) { return (x < 10 ? '0' : '') + x; }
    function zeige() {
      var i = index();
      zaehler.textContent = zwei(i + 1) + ' / ' + zwei(n);
      zurueck.disabled = i === 0; weiter.disabled = i === n - 1;
    }
    function gehe(d) { spur.scrollTo({ left: (index() + d) * spur.clientWidth, behavior: 'smooth' }); }
    zurueck.hidden = false; weiter.hidden = false;
    zurueck.addEventListener('click', function () { gehe(-1); });
    weiter.addEventListener('click', function () { gehe(1); });
    spur.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); gehe(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); gehe(-1); }
    });
    var t; spur.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(zeige, 60); });
    zeige();
  });
})();
