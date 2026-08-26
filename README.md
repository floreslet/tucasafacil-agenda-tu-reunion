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
2. **Formulario.** En `index.html`, el `action` del formulario dice `https://formspree.io/f/TU_ID_FORMULARIO`.
   GitHub Pages es hosting estático: **no procesa formularios**. Opciones:
   - **HubSpot** (recomendado, ya lo usan): reemplaza el `<form>` por el embed de HubSpot Forms.
   - **Formspree / Basin / Web3Forms**: crea el formulario, copia el endpoint y pégalo en `action`.
3. **Tracking.** En el `<head>` de `index.html` están comentados GTM y Meta Pixel.
   Reemplaza `GTM-XXXXXXX` y `TU_PIXEL_ID`, y quita los `<!-- -->`.

## Eventos de tracking ya implementados

Se disparan al `dataLayer` (y a `gtag` si existe):

| Evento | Cuándo |
|---|---|
| `click_cta` | clic en cualquier botón principal |
| `selecciona_horario` | elige un bloque horario |
| `scroll_depth` | 25 / 50 / 75 / 100 % |
| `click_whatsapp` | clic en el link de WhatsApp |
| `click_telefono` | clic en el teléfono |
| `generate_lead` | envío válido del formulario (+ `fbq('track','Lead')`) |

Los parámetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
se capturan de la URL, se guardan en `sessionStorage` y viajan en campos ocultos del formulario.

## Publicar en GitHub Pages

Ver el paso a paso en la conversación o en `PUBLICAR.md`.

## Pendientes recomendados (CRO)

- Página de gracias (`gracias.html`) para medir la conversión con una URL propia.
- Convertir las imágenes a WebP para bajar el peso (~740 KB actuales).
- Botón flotante de WhatsApp en mobile.
- FAQ con objeciones (precio, plazos, terreno, financiamiento).
