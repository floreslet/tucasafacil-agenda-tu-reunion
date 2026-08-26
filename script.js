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

  /* OJO: el formulario vive en un iframe cross-origin, así que desde aquí
     NO se pueden rellenar sus campos. La atribución la hace el código de
     seguimiento de HubSpot (js.hs-scripts.com), que lee los UTMs de la URL
     de esta página. Guardamos los valores igual por si se necesitan para
     armar links salientes o una futura página de gracias. */
  window.tcfUtms = valores;

  /* ---------- 3. Detectar cuándo HubSpot terminó de renderizar ----------
     IMPORTANTE: el embed nuevo de HubSpot NO inyecta un <form> en el DOM,
     inyecta un <iframe> cross-origin. Por eso buscamos un iframe con altura
     real, y NUNCA tocamos su contenido: si lo borráramos, matamos el
     formulario aunque esté cargando bien. */
  var contenedor = document.querySelector('.formcard');
  var marco = document.querySelector('.hs-form-frame');

  function iframeVivo() {
    var f = marco && marco.querySelector('iframe');
    return !!(f && f.clientHeight > 40);
  }

  if (contenedor && marco) {
    var listo = false;

    function marcarListo() {
      if (listo) return;
      listo = true;
      contenedor.classList.add('hs-ok');
      track('form_visible', { form: 'asesoria_hubspot' });
    }

    /* Revisamos cada 400 ms durante 20 s. El iframe aparece rápido pero
       tarda en reportar su altura al padre. */
    var intentos = 0;
    var reloj = setInterval(function () {
      intentos++;
      if (iframeVivo()) { clearInterval(reloj); marcarListo(); return; }

      if (intentos >= 50) {              /* 20 segundos */
        clearInterval(reloj);
        contenedor.classList.add('hs-ok');
        /* El aviso se AÑADE debajo, no reemplaza el iframe. */
        if (!document.querySelector('.hs-fallback')) {
          var aviso = document.createElement('div');
          aviso.className = 'hs-fallback';
          aviso.innerHTML =
            '<p><strong>¿No ves el formulario?</strong></p>' +
            '<p>Escríbenos y coordinamos tu asesoría igual.</p>' +
            '<a class="btn btn-lg" href="https://wa.me/56930094515?text=Hola%2C%20quiero%20agendar%20mi%20asesor%C3%ADa%20gratuita">Agendar por WhatsApp →</a>' +
            '<a class="hs-fallback-tel" href="tel:+56930094515">o llámanos: +56 9 3009 4515</a>';
          marco.parentNode.insertBefore(aviso, marco.nextSibling);
        }
        track('form_error', { form: 'asesoria_hubspot' });
      }
    }, 400);
  }

  /* ---------- 4. Evento de conversión de HubSpot ---------- */
  addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.type !== 'hsFormCallback') return;

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
