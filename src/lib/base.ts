// Prefija rutas absolutas (que empiezan con "/") con el base path del build.
// Lee import.meta.env.BASE_URL, que Astro deriva de la opción `base`.
//
//   - Build local / a la raíz   → BASE_URL = "/"               → withBase("/x") = "/x"   (no afecta dev)
//   - Build de demo en subruta   → BASE_URL = "/clientes/<x>/"  → withBase("/x") = "/clientes/<x>/x"
//
// Las rutas externas (http...), anclas (#...), tel:/mailto: y los strings
// vacíos se devuelven sin tocar.
const BASE = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  if (!path || !path.startsWith("/")) return path;
  return BASE.replace(/\/$/, "") + path;
}
