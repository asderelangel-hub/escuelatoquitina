// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.TINA_BRANCH || process.env.GITHUB_REF_NAME || "main";
var slugify = (values, fallback) => (values?.title || values?.nombre || fallback).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
var config_default = defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: (process.env.PUBLIC_BASE_PATH || "").replace(/^\/+|\/+$/g, "")
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "noticias",
        label: "Noticias",
        path: "src/content/noticias",
        format: "md",
        ui: {
          filename: { slugify: (v) => slugify(v, "noticia") }
        },
        fields: [
          { type: "string", name: "title", label: "T\xEDtulo", isTitle: true, required: true },
          { type: "string", name: "description", label: "Resumen (bajada / SEO)", required: true, ui: { component: "textarea" } },
          { type: "datetime", name: "pubDate", label: "Fecha", required: true, ui: { dateFormat: "YYYY-MM-DD" } },
          { type: "image", name: "cover", label: "Imagen de portada" },
          {
            type: "string",
            name: "categoria",
            label: "Categor\xEDa",
            options: [
              "Noticias",
              "buenas noticias",
              "Eventos Educativos",
              "Efem\xE9rides",
              "DEPORTE",
              "Interculturalidad",
              "Cultura",
              "Concursos Educativos",
              "Registros Fotogr\xE1ficos",
              "Primer Ciclo",
              "Segundo Ciclo"
            ]
          },
          { type: "boolean", name: "draft", label: "Borrador (no publicar)" },
          { type: "rich-text", name: "body", label: "Contenido", isBody: true }
        ]
      },
      {
        name: "equipo",
        label: "Equipo",
        path: "src/content/equipo",
        format: "md",
        ui: {
          filename: { slugify: (v) => slugify(v, "integrante") }
        },
        fields: [
          { type: "string", name: "nombre", label: "Nombre", isTitle: true, required: true },
          { type: "string", name: "rol", label: "Cargo / Rol", required: true },
          {
            type: "string",
            name: "area",
            label: "\xC1rea",
            required: true,
            options: [
              "Gesti\xF3n",
              "Educaci\xF3n Pre-escolar",
              "Primer Ciclo",
              "Segundo Ciclo",
              "Equipo Multidisciplinario"
            ]
          },
          { type: "string", name: "descripcion", label: "Formaci\xF3n / descripci\xF3n", ui: { component: "textarea" } },
          { type: "image", name: "foto", label: "Foto (opcional)" },
          { type: "number", name: "orden", label: "Orden de aparici\xF3n" }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
