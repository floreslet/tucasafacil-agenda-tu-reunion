# Landing — Asesoría gratuita | Tu Casa Fácil

Landing estática (HTML + CSS + JS) lista para publicar en GitHub Pages.

## Estructura

```
tucasafacil-landing/
├── index.html      ← estructura y copy
├── styles.css      ← todos los estilos
├── script.js       ← header, horarios, UTMs, tracking, validación
├── robots.txt
├── sitemap.xml
├── .nojekyll       ← evita que GitHub procese el sitio con Jekyll
└── img/
    ├── logo-tucasafacil.svg
    ├── hero-casa-sip.jpg
    ├── equipo-tucasafacil.jpg
    ├── modelo-llanquihue-90.jpg
    ├── modelo-alta-cumbre-106.jpg
    ├── modelo-mirador-116.jpg
    ├── modelo-mirador-130.jpg
    └── servicios-tucasafacil.jpg
```

## Antes de publicar — 3 reemplazos obligatorios

1. **Dominio.** Busca `TU-DOMINIO.cl` en `index.html`, `robots.txt` y `sitemap.xml` y reemplázalo por la URL real
   (ej: `tucasafacil.github.io/asesoria` o `asesoria.tucasafacil.cl`).
2. **Formulario (HubSpot).** Ya está integrado el embed del portal `9292440`,
   formulario `4eb0c684-b6db-4364-9b80-54d88f810deb`. No hay que tocar nada en el código.
   Lo que **sí** hay que hacer en HubSpot:
   - **Style tab del formulario:** poner fondo de campo `#1A1A1A`, borde `#333333`, radio `12px`,
     texto `#FFFFFF`, botón `#54B10F` con texto blanco y radio `999px`. El CSS de la landing ya
     fuerza estos valores, pero si HubSpot cambia su markup, lo configurado en el editor es lo que manda.
   - **Campos ocultos:** crear `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` y `utm_term`.
     El `script.js` los rellena solo con lo que venga en la URL.
   - **Workflow:** asignar owner y crear tarea de seguimiento al envío.

3. **Tracking.** En el `<head>` de `index.html` están comentados GTM y Meta Pixel.
   Reemplaza `GTM-XXXXXXX` y `TU_PIXEL_ID`, y quita los `<!-- -->`.

## Eventos de tracking ya implementados

Se disparan al `dataLayer` (y a `gtag` si existe):

| Evento | Cuándo |
|---|---|
| `click_cta` | clic en cualquier botón principal |
| `scroll_depth` | 25 / 50 / 75 / 100 % |
| `click_whatsapp` | clic en el link de WhatsApp |
| `click_telefono` | clic en el teléfono |
| `form_visible` | el formulario de HubSpot terminó de renderizar |
| `generate_lead` | envío confirmado por HubSpot (+ `fbq('track','Lead')`) |
| `form_error` | el embed no cargó en 12 s y se mostró la salida por WhatsApp |

Los parámetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid` y
`fbclid` se capturan de la URL, se guardan en `sessionStorage` y se inyectan en los campos ocultos
del formulario de HubSpot que tengan esos nombres. Además está el código de seguimiento del portal
(`js.hs-scripts.com/9292440.js`), que registra origen original y último origen del contacto.

`generate_lead` se dispara con el evento `hsFormCallback / onFormSubmitted` que emite HubSpot, no
con el clic en el botón. Es decir, solo cuenta envíos que HubSpot confirmó.

## Publicar en GitHub Pages

Ver el paso a paso en la conversación o en `PUBLICAR.md`.

## Pendientes recomendados (CRO)

- Página de gracias (`gracias.html`) para medir la conversión con una URL propia
  (en `script.js` está la línea comentada para redirigir).
- Reemplazar el formulario por un **HubSpot Meetings link** si quieren que el prospecto
  elija hora contra disponibilidad real del asesor, en vez de declarar una preferencia.
- Convertir las imágenes a WebP para bajar el peso (~740 KB actuales).
- Botón flotante de WhatsApp en mobile.
- FAQ con objeciones (precio, plazos, terreno, financiamiento).
