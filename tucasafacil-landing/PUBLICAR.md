# Cómo publicar esta landing en GitHub Pages

Dos caminos. Elige uno.

---

## Camino A — Sin instalar nada (web, ~10 minutos)

### 1. Crea la cuenta y el repositorio
1. Entra a <https://github.com> y crea cuenta (o inicia sesión).
2. Arriba a la derecha: **+** → **New repository**.
3. Completa:
   - **Repository name:** `landing-asesoria` (sin espacios ni mayúsculas).
   - **Public** ← obligatorio para que Pages funcione gratis.
   - **NO** marques "Add a README file".
4. **Create repository**.

### 2. Sube los archivos
1. En la pantalla que aparece, haz clic en **uploading an existing file**.
2. Descomprime el ZIP en tu computador.
3. Arrastra a la ventana del navegador: `index.html`, `styles.css`, `script.js`,
   `robots.txt`, `sitemap.xml`, `README.md`, `PUBLICAR.md` **y la carpeta `img` completa**.
   > Importante: sube los archivos sueltos, **no** la carpeta `tucasafacil-landing` entera.
   > `index.html` tiene que quedar en la raíz del repositorio.
4. Abajo, en **Commit changes**, escribe `Landing asesoría v1` → **Commit changes**.

> El archivo `.nojekyll` puede no subirse al arrastrar (los archivos que empiezan con punto
> a veces quedan ocultos). Si no aparece, créalo desde **Add file → Create new file**,
> nómbralo `.nojekyll`, déjalo vacío y confirma.

### 3. Activa GitHub Pages
1. En el repositorio: pestaña **Settings**.
2. Menú lateral izquierdo: **Pages**.
3. En **Source** elige **Deploy from a branch**.
4. En **Branch** selecciona `main` y carpeta `/ (root)` → **Save**.
5. Espera 1–3 minutos y recarga. Aparecerá:
   `Your site is live at https://TU-USUARIO.github.io/landing-asesoria/`

### 4. Verifica
- Abre la URL en el celular y en el computador.
- Revisa que se vean las 8 imágenes, que el header cambie al hacer scroll y que
  los bloques horarios se seleccionen.
- Si las imágenes no cargan: revisa que la carpeta se llame exactamente `img` (minúscula).
  GitHub Pages distingue mayúsculas y minúsculas; tu computador no.

---

## Camino B — Con Git desde tu computador

```bash
cd ruta/a/tucasafacil-landing

git init
git add .
git commit -m "Landing asesoría v1"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/landing-asesoria.git
git push -u origin main
```

Luego haz el **paso 3** del Camino A (Settings → Pages).

Para actualizar después de cualquier cambio:

```bash
git add .
git commit -m "Ajuste copy hero"
git push
```

Los cambios quedan en vivo en ~1 minuto.

---

## Conectar un dominio propio (opcional pero recomendado)

Publicar en `tu-usuario.github.io` sirve para probar. Para campañas de Google/Meta Ads
conviene un subdominio de tu dominio real: mejor Quality Score, cookies del mismo dominio
y remarketing consistente.

1. **En tu proveedor de dominio** (donde compraste `tucasafacil.cl`), crea un registro DNS:

   | Tipo | Nombre | Valor |
   |---|---|---|
   | CNAME | `asesoria` | `TU-USUARIO.github.io` |

2. **En GitHub**: Settings → Pages → **Custom domain** → escribe `asesoria.tucasafacil.cl` → **Save**.
3. Espera a que aparezca el check verde y marca **Enforce HTTPS**.
4. Reemplaza `TU-DOMINIO.cl` por `asesoria.tucasafacil.cl` en `index.html`,
   `robots.txt` y `sitemap.xml`, y vuelve a subir.

La propagación DNS puede tardar entre 10 minutos y 24 horas.

---

## Checklist antes de mandar tráfico pagado

- [ ] Formulario conectado a HubSpot (o Formspree) y **probado con un envío real**
- [ ] El lead llega al CRM con owner asignado
- [ ] GTM instalado y `generate_lead` disparando (verificar en Preview de GTM)
- [ ] Conversión de Google Ads y evento `Lead` de Meta configurados sobre ese evento
- [ ] Dominio con HTTPS activo
- [ ] `TU-DOMINIO.cl` reemplazado en los 3 archivos
- [ ] Probado en celular real, no solo en el simulador del navegador
- [ ] PageSpeed Insights sobre la URL final (objetivo: >85 en mobile)
- [ ] UTMs armadas para cada campaña / conjunto / anuncio
