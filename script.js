/* ============================================================
   Tu Casa Fácil — landing asesoría
   Header, UTMs, tracking y enganche con el formulario de HubSpot
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Tracking: un solo punto de salida ---------- */
  function track(nombre, datos) {
    datos = datos || {};
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: nombre }, datos));
    if (typeof gtag === 'function') gtag('event', nombre, datos);
  }
  window.tcfTrack = track;

  /* ---------- 1. Header con fondo al hacer scroll ---------- */
  var hd = document.getElementById('hd');
  if (hd) {
    addEventListener('scroll', function () {
      hd.classList.toggle('scrolled', scrollY > 40);
    }, { passive: true });
  }

  /* ---------- 2. UTMs: capturar y persistir en la sesión ---------- */
  var UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
  var qs = new URLSearchParams(location.search);
  var valores = {};
  UTMS.forEach(function (k) {
    var v = qs.get(k);
    try {
      if (v) sessionStorage.setItem(k, v);
      else v = sessionStorage.getItem(k);
    } catch (e) {}
    if (v) valores[k] = v;
  });

  /* Rellena los campos ocultos del form de HubSpot que tengan estos nombres.
     Para que funcione, crea los campos ocultos utm_source, utm_medium,
     utm_campaign, utm_content y utm_term dentro del formulario en HubSpot. */
  function rellenarUtms(raiz) {
    Object.keys(valores).forEach(function (k) {
      var campo = raiz.querySelector('input[name="' + k + '"]');
      if (campo && !campo.value) {
        campo.value = valores[k];
        campo.dispatchEvent(new Event('input', { bubbles: true }));
        campo.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  /* ---------- 3. Detectar cuándo HubSpot terminó de renderizar ---------- */
  var contenedor = document.querySelector('.formcard');
  var marco = document.querySelector('.hs-form-frame');

  if (contenedor && marco) {
    var listo = false;
    var observer = new MutationObserver(function () {
      if (listo) return;
      if (marco.querySelector('form')) {
        listo = true;
        contenedor.classList.add('hs-ok');
        rellenarUtms(marco);
        track('form_visible', { form: 'asesoria_hubspot' });
        observer.disconnect();
      }
    });
    observer.observe(marco, { childList: true, subtree: true });

    /* Red de seguridad: si a los 12 s no cargó, mostramos una salida alternativa
       para no perder el lead por un bloqueador o una caída del script. */
    setTimeout(function () {
      if (listo) return;
      observer.disconnect();
      contenedor.classList.add('hs-ok');
      marco.innerHTML =
        '<div class="hs-fallback">' +
        '<p><strong>No pudimos cargar el formulario.</strong></p>' +
        '<p>Escríbenos directamente y coordinamos tu asesoría igual.</p>' +
        '<a class="btn btn-lg" href="https://wa.me/56930094515?text=Hola%2C%20quiero%20agendar%20mi%20asesor%C3%ADa%20gratuita">Agendar por WhatsApp →</a>' +
        '<a class="hs-fallback-tel" href="tel:+56930094515">o llámanos: +56 9 3009 4515</a>' +
        '</div>';
      track('form_error', { form: 'asesoria_hubspot' });
    }, 12000);
  }

  /* ---------- 4. Evento de conversión de HubSpot ---------- */
  addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.type !== 'hsFormCallback') return;

    if (d.eventName === 'onFormReady' && marco) {
      rellenarUtms(marco);
    }

    if (d.eventName === 'onFormSubmitted') {
      track('generate_lead', { form: 'asesoria_hubspot', form_id: d.id || '' });
      if (typeof fbq === 'function') fbq('track', 'Lead');
      /* Si creas gracias.html, descomenta para medir la conversión con URL propia:
         setTimeout(function(){ location.href = 'gracias.html'; }, 800); */
    }
  });

  /* ---------- 5. Eventos de micro-conversión ---------- */
  document.querySelectorAll('a[href="#agendar"], .btn, .btn-out, .btn-ghost').forEach(function (a) {
    a.addEventListener('click', function () {
      track('click_cta', { texto: (a.textContent || '').trim().slice(0, 60) });
    });
  });

  document.querySelectorAll('a[href^="https://wa.me"]').forEach(function (a) {
    a.addEventListener('click', function () { track('click_whatsapp', {}); });
  });

  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () { track('click_telefono', {}); });
  });

  var hitos = [25, 50, 75, 100], vistos = {};
  addEventListener('scroll', function () {
    var alto = document.body.scrollHeight - innerHeight;
    if (alto <= 0) return;
    var pct = Math.round((scrollY / alto) * 100);
    hitos.forEach(function (h) {
      if (pct >= h && !vistos[h]) { vistos[h] = 1; track('scroll_depth', { porcentaje: h }); }
    });
  }, { passive: true });
})();
