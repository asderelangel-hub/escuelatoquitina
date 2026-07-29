# astro-base — template base de OneClickLanding

Proyecto Astro base que sirve como punto de partida para cualquier sitio
de cliente del catálogo OneClickLanding (Express, Headless, Headless Plus).

Contiene:
- **Librería de 10 secciones modulares** (`src/components/library/`) —
  reutilizables y configurables por props.
- **Sistema de tokens** (`src/styles/tokens.css`) — colores, tipografías y
  carácter visual del cliente. Tiene 5 presets de partida por industria.
- **BaseLayout con SEO completo** — meta tags, Open Graph, Twitter Card,
  Schema.org JSON-LD, snippet GTM opcional.
- **Hero VACÍO con disciplina** — cada cliente recibe un hero hecho a medida,
  no un template genérico. Ver `src/components/hero/HERO_DISCIPLINE.md`.

---

## Workflow por cliente (Express)

### 1. Inicializar carpeta del cliente

```bash
./scripts/new-client.sh nombre-cliente \
    --product express \
    --industry industrial      # o: gastro | services | retail | salud
```

Esto crea `clients/<nombre>/site/` copiando este template y reemplazando
`tokens.css` con el preset de la industria elegida.

### 2. Llenar el brief

`clients/<nombre>/brief.md` — preguntas básicas: rubro, servicios, fotos,
WhatsApp, etc.

### 3. Personalizar tokens

Abrí `src/styles/tokens.css` y reemplazá los valores del preset por los
REALES del cliente:

- **Colores**: extraídos del logo del cliente (no inventados).
- **Tipografías**: NO Inter, NO Manrope. Buscá pares que respondan al
  rubro y personalidad de la marca. Ej: Tiempos Headline + Söhne para
  servicios premium; Fraunces + Inter para gastro; Recoleta + DM Sans
  para retail.
- **Radius / sombras**: ajustar al carácter (sharp para industrial,
  generoso para gastro/retail).

### 4. Crear el Hero custom

Crear `src/components/hero/Hero.astro` siguiendo `HERO_DISCIPLINE.md`. Los
4 arquetipos son inspiración, NO templates copiables.

### 5. Componer el index.astro

`src/pages/index.astro` viene con TODAS las secciones de la librería como
ejemplo. Por cliente:
- Eliminar las secciones que no aplican.
- Reordenar según lo que tenga más sentido para su rubro.
- Reemplazar el contenido placeholder con datos del brief.

### 6. Subir assets reales

`public/`:
- `og-default.jpg` (1200×630, foto del cliente)
- `favicon.svg`
- `galeria/*.jpg` — fotos del cliente
- `sobre.jpg` — foto del local/equipo

**Nunca usar stock photography como foto principal.**

### 7. Configurar `astro.config.mjs`

Cambiar `site: 'https://example.com'` al dominio real del cliente.

### 8. Configurar form

En el `<ContactBlock />`, pasar `formAction` y `formAccessKey` reales:
- Web3Forms (gratis hasta 250 envíos/mes): https://web3forms.com/
- Formspree alternativa

### 9. Configurar GTM

En `<BaseLayout gtmId="GTM-XXXXXXX" />`, reemplazar con el ID real
generado por `scripts/gtm/setup-container.py`.

### 10. Build y deploy

```bash
npm install
npm run build      # genera dist/
```

Deploy a Cloudflare Pages: conectar el repo del cliente y push.

### Deploy de demo a subruta (prospectos que aún no cotizan)

Este template ya viene listo para subirse a una subruta de `pandorastudio.cl`
sin tocar nada: `astro.config` lee `base`/`site` desde `PUBLIC_BASE_PATH` /
`PUBLIC_SITE_URL`, y `src/lib/base.ts` (`withBase`) prefija las rutas absolutas.
Las páginas en subruta se marcan `noindex` automáticamente.

```bash
cd scripts/deploy-demo
node deploy-demo.mjs deploy <cliente>
# → https://pandorastudio.cl/clientes/<cliente>/
```

**Regla:** al componer páginas, envolver con `withBase("/...")` TODA ruta
absoluta propia (imágenes de `public/`, favicon, og). Externas, anclas y
`tel:`/`mailto:` no se tocan. Cuando el cliente cotiza y tiene dominio propio,
`npm run build` sin env publica a la raíz de su dominio igual que siempre.

---

## Comandos

```bash
npm run dev        # dev server en http://localhost:4321
npm run build      # genera dist/ para deploy
npm run preview    # preview del build localmente
npm run check      # validación de tipos + accesibilidad
```

---

## Lista negra anti-AI (chequeo final antes de entregar)

Antes de entregar al cliente, validar que el sitio NO tiene:

- ❌ Stock photography en el hero o gallery (Unsplash, Pexels, etc.)
- ❌ Tipografía Inter o Manrope como primaria
- ❌ Degradados índigo→violeta o paletas trendy genéricas
- ❌ Headlines tipo "Soluciones profesionales para tu negocio" sin specifics
- ❌ Heroicons monoline genéricos en todas partes
- ❌ Layout split 50/50 centrado sin asimetría
- ❌ CTAs genéricos tipo "Comenzar", "Empezar ahora" sin contexto

Y SÍ debe tener:

- ✅ Fotos reales del cliente (workshop, equipo, productos)
- ✅ Colores extraídos del logo del cliente
- ✅ Números/años/specifics concretos en headlines (ej. "61 años fabricando")
- ✅ Lighthouse mobile ≥ 90 en Performance, SEO, Accessibility
- ✅ Schema.org validado en https://search.google.com/test/rich-results
- ✅ `<html lang="es-CL">` (ya viene por default en BaseLayout)

---

## Estructura del proyecto

```
astro-base/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── README.md                       ← este archivo
├── public/                         ← assets estáticos (fotos, favicon)
└── src/
    ├── styles/
    │   ├── global.css              ← imports + global styles
    │   ├── tokens.css              ← TOKENS DEL CLIENTE (editar)
    │   └── presets/                ← starters por industria
    │       ├── gastro.css
    │       ├── industrial.css
    │       ├── retail.css
    │       ├── salud.css
    │       └── services.css
    ├── layouts/
    │   └── BaseLayout.astro        ← SEO, GTM, Schema.org
    ├── components/
    │   ├── hero/                   ← VACÍO — crear Hero.astro por cliente
    │   │   └── HERO_DISCIPLINE.md
    │   └── library/                ← 10 secciones modulares
    │       ├── ServicesGrid.astro
    │       ├── AboutSplit.astro
    │       ├── Testimonials.astro
    │       ├── Gallery.astro
    │       ├── CTABanner.astro
    │       ├── FAQ.astro
    │       ├── ContactBlock.astro
    │       ├── WorkflowSteps.astro
    │       ├── LocationMap.astro
    │       └── Footer.astro
    └── pages/
        └── index.astro             ← starter, customizar por cliente
```

---

## Para preguntas o cambios al template

El template vive en `templates/astro-base/` del repo de OneClickLanding.
Mejoras al template benefician a todos los clientes FUTUROS (los existentes
quedan congelados a la fecha en que se creó su carpeta).
