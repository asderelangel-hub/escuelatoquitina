import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Noticias / blog de vida escolar — autogestionado por TinaCMS.
const noticias = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/noticias" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    cover: z.string().optional(),
    categoria: z.string().default("Noticias"),
    draft: z.boolean().default(false),
  }),
});

// Equipo docente / directivo / multidisciplinario — autogestionado por TinaCMS.
const equipo = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/equipo" }),
  schema: z.object({
    nombre: z.string(),
    rol: z.string(),
    area: z.enum([
      "Gestión",
      "Educación Pre-escolar",
      "Primer Ciclo",
      "Segundo Ciclo",
      "Equipo Multidisciplinario",
    ]),
    descripcion: z.string().default(""),
    foto: z.string().optional(),
    orden: z.number().default(99),
  }),
});

export const collections = { noticias, equipo };
