/* Tu Casa Fácil — landing asesoría */
(function () {
  'use strict';

  /* 1. Header con fondo al hacer scroll */
  var hd = document.getElementById('hd');
  if (hd) {
    addEventListener('scroll', function () {
      hd.classList.toggle('scrolled', scrollY > 40);
    }, { passive: true });
  }

  /* 2. Selección de horario */
  var horaInput = document.getElementById('hora');
  document.querySelectorAll('.slot').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.slot').forEach(function (x) { x.classList.remove('sel'); });
      b.classList.add('sel');
      if (horaInput) horaInput.value = b.dataset.hora || b.textContent.trim();
      track('selecciona_horario', { hora: horaInput ? horaInput.value : '' });
    });
  });

  /* 3. UTMs -> campos ocultos (persistidos en sessionStorage) */
  var qs = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
    var v = qs.get(k);
    try {
      if (v) sessionStorage.setItem(k, v);
      else v = sessionStorage.getItem(k);
    } catch (e) {}
    var el = document.getElementById(k);
    if (el) el.value = v || '';
  });
  var pag = document.getElementById('pagina');
  if (pag) pag.value = location.href;

  /* 4. Eventos de tracking (dataLayer / GA4 / Meta Pixel) */
  function track(nombre, datos) {
    datos = datos || {};
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: nombre }, datos));
    if (typeof gtag === 'function') gtag('event', nombre, datos);
  }
  window.tcfTrack = track;

  /* 4a. Clic en CTAs */
  document.querySelectorAll('a[href="#agendar"], .btn, .btn-out, .btn-ghost').forEach(function (a) {
    a.addEventListener('click', function () {
      track('click_cta', { texto: (a.textContent || '').trim().slice(0, 60) });
    });
  });

  /* 4b. Clic en WhatsApp y teléfono */
  document.querySelectorAll('a[href^="https://wa.me"]').forEach(function (a) {
    a.addEventListener('click', function () { track('click_whatsapp', {}); });
  });
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () { track('click_telefono', {}); });
  });

  /* 4c. Scroll depth 25/50/75/100 */
  var hitos = [25, 50, 75, 100], vistos = {};
  addEventListener('scroll', function () {
    var alto = document.body.scrollHeight - innerHeight;
    if (alto <= 0) return;
    var pct = Math.round((scrollY / alto) * 100);
    hitos.forEach(function (h) {
      if (pct >= h && !vistos[h]) { vistos[h] = 1; track('scroll_depth', { porcentaje: h }); }
    });
  }, { passive: true });

  /* 5. Envío del formulario */
  var form = document.getElementById('form-asesoria');
  var msg = document.getElementById('form-msg');
  if (form) {
    form.addEventListener('submit', function (e) {
      var falta = [];
      ['nombre', 'telefono', 'email', 'fecha'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el && !el.value.trim()) falta.push(el);
      });
      if (!horaInput || !horaInput.value) falta.push(horaInput);

      if (falta.length) {
        e.preventDefault();
        if (msg) { msg.textContent = 'Completa los campos obligatorios y elige un horario.'; msg.style.color = '#ff8080'; }
        if (falta[0] && falta[0].focus) falta[0].focus();
        return;
      }

      track('generate_lead', {
        form: 'asesoria_gratuita',
        terreno: (document.getElementById('terreno') || {}).value,
        metraje: (document.getElementById('metraje') || {}).value
      });
      if (typeof fbq === 'function') fbq('track', 'Lead');

      if (msg) { msg.textContent = 'Enviando tu solicitud…'; msg.style.color = ''; }
    });
  }
})();
