// Terminal-Replay: spielt eine aufgezeichnete Sitzung Zeile für Zeile ab, sobald sie ins Bild scrollt.
// Eingaben (.r-cmd, .r-du) werden getippt, Ausgaben (.r-sys, .r-claude) blenden nacheinander ein.
// Ohne JS oder bei prefers-reduced-motion ist alles sofort sichtbar.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var TIPP_MS = 16, TIPP_MAX = 1600;

  function warte(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function tippe(el, text) {
    var schritt = Math.max(1, Math.ceil(text.length / (TIPP_MAX / TIPP_MS)));
    var i = 0;
    el.textContent = '';
    el.classList.add('r-sichtbar', 'r-tippt');
    return new Promise(function (fertig) {
      (function weiter() {
        i = Math.min(text.length, i + schritt);
        el.textContent = text.slice(0, i);
        if (i < text.length) setTimeout(weiter, TIPP_MS);
        else { el.classList.remove('r-tippt'); fertig(); }
      })();
    });
  }

  function abspielen(box) {
    if (box.dataset.laeuft === '1') return;
    box.dataset.laeuft = '1';
    var desktop = box.classList.contains('desktop');
    var zeilen = Array.prototype.slice.call(box.querySelectorAll('.r-zeile'));
    zeilen.forEach(function (z) {
      var getippt = z.classList.contains('r-cmd') || (z.classList.contains('r-du') && !desktop);
      if (!z.dataset.text && getippt) z.dataset.text = z.textContent;
      z.classList.remove('r-sichtbar');
    });
    var kette = Promise.resolve();
    zeilen.forEach(function (z) {
      kette = kette.then(function () {
        if (z.dataset.text) return tippe(z, z.dataset.text).then(function () { return warte(380); });
        var vorher = z.previousElementSibling;
        if (desktop && z.classList.contains('r-claude') && vorher && vorher.classList.contains('r-du')) {
          // Desktop-Chat: kurz „denkt nach …“ zeigen, bevor Claude antwortet
          var denkt = document.createElement('p');
          denkt.className = 'r-denkt';
          denkt.textContent = 'denkt nach';
          z.parentNode.insertBefore(denkt, z);
          return warte(1200).then(function () { denkt.remove(); z.classList.add('r-sichtbar'); });
        }
        var dauer = desktop && z.classList.contains('r-du') ? 500 : Math.min(1300, Math.max(260, z.textContent.length * 4));
        return warte(dauer).then(function () { z.classList.add('r-sichtbar'); });
      });
    });
    kette.then(function () { box.dataset.laeuft = '0'; box.classList.add('r-fertig'); });
  }

  document.querySelectorAll('.replay').forEach(function (box) {
    box.classList.add('r-aktiv');
    var knopf = document.createElement('button');
    knopf.type = 'button';
    knopf.className = 'r-nochmal';
    knopf.textContent = '↻ nochmal';
    knopf.addEventListener('click', function () { box.classList.remove('r-fertig'); abspielen(box); });
    box.appendChild(knopf);

    var io = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) { abspielen(box); io.unobserve(box); }
      });
    }, { threshold: 0.35 });
    io.observe(box);
  });
})();
