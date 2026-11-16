// Maimon – menu, reveal, rozpis směn (signature) a formulář.
(function () {
  'use strict';
  var doc = document;

  /* ---------- menu ---------- */
  var burger = doc.querySelector('.burger'), menu = doc.getElementById('menu');
  if (burger && menu) {
    var zavri = function () { menu.classList.remove('otevreno'); burger.setAttribute('aria-expanded', 'false'); };
    burger.addEventListener('click', function () {
      var o = menu.classList.toggle('otevreno');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) zavri(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') zavri(); });
  }

  /* ---------- reveal ---------- */
  var rr = doc.querySelectorAll('.r');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (zaznamy) {
      zaznamy.forEach(function (z) { if (z.isIntersecting) { z.target.classList.add('v'); io.unobserve(z.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rr.forEach(function (el) { io.observe(el); });
  } else { rr.forEach(function (el) { el.classList.add('v'); }); }

  /* ---------- rozpis směn ---------- */
  var DNY = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
  var SMENY = ['ranní', 'odpolední', 'noční'];
  var KAM = { 'Výroba': 'do výroby', 'Sklad': 'do skladu', 'VZV': 'na vysokozdvižné vozíky',
    'Potraviny': 'do potravinářské výroby', 'Kovo': 'do kovovýroby', 'jiný obor': '' };

  function lidi(n) { return n === 1 ? '1 člověka' : (n < 5 ? n + ' lidi' : n + ' lidí'); }
  function smenSlovo(n) { return n === 1 ? 'směna' : (n > 1 && n < 5 ? 'směny' : 'směn'); }
  function spoj(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' a ' + a[a.length - 1]; }
  function rozsahDnu(idx) {
    if (idx.length === 7) return 'celý týden';
    var useky = [], i = 0;
    while (i < idx.length) {
      var j = i;
      while (j + 1 < idx.length && idx[j + 1] === idx[j] + 1) j++;
      if (j - i >= 2) useky.push(DNY[idx[i]] + '–' + DNY[idx[j]]);
      else for (var k = i; k <= j; k++) useky.push(DNY[idx[k]]);
      i = j + 1;
    }
    return useky.join(', ');
  }

  var rozpis = doc.getElementById('rozpis');
  var vetaRozpisu = '';
  if (rozpis) {
    var volby = rozpis.querySelector('.rozpis-volby');
    var out = function (n) { return rozpis.querySelector('[data-out="' + n + '"]'); };
    var bunky = [[], [], []];
    rozpis.querySelectorAll('.bunka').forEach(function (b) { bunky[+b.dataset.s][+b.dataset.d] = b; });
    var dnyTl = rozpis.querySelectorAll('.den');
    var smenyCb = volby.querySelectorAll('input[name="smena"]');
    var pocetEl = volby.querySelector('output[name="pocet"]');
    var pocet = parseInt(pocetEl.textContent, 10) || 6;
    var mrizka = [0, 1, 2].map(function (s) {
      return DNY.map(function (_, d) { return smenyCb[s].checked && d < 5; });
    });

    var prekresli = function (pop) {
      var aktivniSmeny = [], aktivniDny = [], celkem = 0;
      for (var s = 0; s < 3; s++) {
        var radek = false;
        for (var d = 0; d < 7; d++) {
          var on = mrizka[s][d], b = bunky[s][d];
          if (on) { celkem++; radek = true; }
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.firstChild.textContent = on ? pocet : '';
          if (pop && pop.s === s && pop.d === d) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
        }
        smenyCb[s].checked = radek;
        if (radek) aktivniSmeny.push(SMENY[s]);
      }
      for (var d2 = 0; d2 < 7; d2++) {
        var sloupec = mrizka[0][d2] || mrizka[1][d2] || mrizka[2][d2];
        dnyTl[d2].classList.toggle('on', sloupec);
        dnyTl[d2].setAttribute('aria-pressed', sloupec ? 'true' : 'false');
        if (sloupec) aktivniDny.push(d2);
      }
      var obor = (volby.querySelector('input[name="obor"]:checked') || {}).value || 'jiný obor';
      var nastup = (volby.querySelector('input[name="nastup"]:checked') || {}).value || '';
      out('obor').textContent = obor === 'jiný obor' ? 'Jiný obor' : obor;
      out('smen').textContent = celkem * pocet;
      out('smen-slovo').textContent = smenSlovo(celkem * pocet);
      pocetEl.textContent = pocet;

      if (!celkem) {
        vetaRozpisu = '';
        out('veta').textContent = 'Rozpis je prázdný. Klikněte do tabulky na směny, které potřebujete obsadit.';
        return;
      }
      var kam = KAM[obor] !== undefined ? KAM[obor] : '';
      var smeny = aktivniSmeny.length === 3 ? 'všechny tři směny' : spoj(aktivniSmeny) + ' směnu';
      vetaRozpisu = 'Hledáme ' + lidi(pocet) + (kam ? ' ' + kam : '') + ' na ' + smeny + ', ' + rozsahDnu(aktivniDny) +
        (nastup ? ', nástup ' + nastup : '') + '.';
      out('veta').textContent = vetaRozpisu;
    };

    volby.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'smena') {
        var s = +t.value, dny = [];
        for (var d = 0; d < 7; d++) if (dnyTl[d].classList.contains('on')) dny.push(d);
        if (!dny.length) dny = [0, 1, 2, 3, 4];
        for (var d3 = 0; d3 < 7; d3++) mrizka[s][d3] = t.checked && dny.indexOf(d3) > -1;
      }
      prekresli();
    });
    volby.querySelectorAll('[data-krok]').forEach(function (b) {
      b.addEventListener('click', function () {
        pocet = Math.min(50, Math.max(1, pocet + parseInt(b.dataset.krok, 10)));
        prekresli();
      });
    });
    dnyTl.forEach(function (b) {
      b.addEventListener('click', function () {
        var d = +b.dataset.den, zapnout = !b.classList.contains('on'), smeny = [];
        for (var s = 0; s < 3; s++) if (smenyCb[s].checked) smeny.push(s);
        if (!smeny.length) smeny = [0];
        for (var s2 = 0; s2 < 3; s2++) mrizka[s2][d] = zapnout && smeny.indexOf(s2) > -1;
        prekresli();
      });
    });
    rozpis.querySelectorAll('.bunka').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = +b.dataset.s, d = +b.dataset.d;
        mrizka[s][d] = !mrizka[s][d];
        prekresli({ s: s, d: d });
      });
    });
    try {
      var oborZ = sessionStorage.getItem('maimon-obor');
      if (oborZ) {
        sessionStorage.removeItem('maimon-obor');
        rozpis.querySelectorAll('input[name="obor"]').forEach(function (r) { if (r.value === oborZ) r.checked = true; });
      }
    } catch (err) { /* bez úložiště zůstane výchozí obor */ }
    prekresli();

    var odeslat = rozpis.querySelector('[data-rozpis-odeslat]');
    if (odeslat) odeslat.addEventListener('click', function (e) {
      if (!vetaRozpisu) return;
      var text = vetaRozpisu + ' Celkem ' + out('smen').textContent + ' ' + out('smen-slovo').textContent + ' týdně.';
      try { sessionStorage.setItem('maimon-rozpis', text); } catch (err) { /* bez úložiště jen přejdeme */ }
      if (doc.getElementById('poptavka-form')) {
        e.preventDefault();
        predvyplnit(text);
        var cil = doc.getElementById('poptavka');
        cil.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        setTimeout(function () { var f = doc.querySelector('#poptavka-form input[name="firma"]'); if (f) f.focus({ preventScroll: true }); }, 600);
      }
    });
  }

  function predvyplnit(text) {
    var f = doc.getElementById('poptavka-form');
    if (!f || !text) return;
    var pole = f.querySelector('.pole-rozpis');
    pole.hidden = false;
    pole.querySelector('[data-rozpis-text]').textContent = text;
    f.querySelector('input[name="rozpis"]').value = text;
  }
  if (!rozpis && doc.getElementById('poptavka-form')) {
    try { predvyplnit(sessionStorage.getItem('maimon-rozpis')); } catch (err) { /* nic */ }
  }

  /* ---------- obor z podstránky do rozpisu ---------- */
  doc.querySelectorAll('a[data-obor]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { sessionStorage.setItem('maimon-obor', a.getAttribute('data-obor')); } catch (err) { /* nic */ }
    });
  });

  /* ---------- značka: přepínač loga v ukázkách ---------- */
  var apl = doc.getElementById('aplikace');
  if (apl) {
    var tlacitka = apl.querySelectorAll('[data-varianta]');
    var base = apl.getAttribute('data-base');
    tlacitka.forEach(function (t) {
      t.addEventListener('click', function () {
        var v = t.getAttribute('data-varianta');
        tlacitka.forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
        apl.querySelectorAll('img[data-zn]').forEach(function (img) {
          var typ = img.getAttribute('data-zn');
          img.src = base + 'brand/' + (typ === 'sym' ? 'sym-' + v : v + '-' + typ) + '.svg';
          if (typ !== 'sym') {
            var w = v === 'a' ? 613 : 754, h = v === 'a' ? 342 : 310;
            img.setAttribute('width', w); img.setAttribute('height', h);
          }
        });
      });
    });
  }

  /* ---------- formulář ---------- */
  doc.querySelectorAll('form.formular').forEach(function (f) {
    var stav = f.querySelector('.formular-stav');
    f.addEventListener('submit', function (e) {
      var endpoint = f.getAttribute('data-endpoint');
      var demo = f.getAttribute('data-demo') === '1';
      e.preventDefault();
      if (f.querySelector('.past input').value) return;
      if (demo || !endpoint) {
        stav.textContent = 'Ukázka formuláře: nic se neodesílá. Po spuštění webu přijde poptávka na e-mail agentury.';
        return;
      }
      stav.textContent = 'Odesílám…';
      fetch(endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); f.reset(); stav.textContent = 'Děkujeme, poptávka je odeslaná. Ozveme se s nabídkou.'; })
        .catch(function () { stav.textContent = 'Odeslání se nepodařilo. Napište nám prosím e-mailem.'; });
    });
  });
})();
