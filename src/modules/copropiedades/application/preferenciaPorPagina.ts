// Preferencia global de "unidades por página" (aplica a todas las
// copropiedades), guardada en localStorage para que se recuerde entre
// visitas. No es un dato del servidor, solo una preferencia de UI del
// navegador — por eso no vive en Supabase.
const CLAVE_STORAGE = "borca:copropiedades:unidadesPorPagina";

export const OPCIONES_POR_PAGINA = [10, 20, 50, 100] as const;
const VALOR_DEFECTO: number = OPCIONES_POR_PAGINA[0];

export function leerPorPaginaGuardada(): number {
  if (typeof window === "undefined") return VALOR_DEFECTO;
  const guardado = Number(window.localStorage.getItem(CLAVE_STORAGE));
  return (OPCIONES_POR_PAGINA as readonly number[]).includes(guardado) ? guardado : VALOR_DEFECTO;
}

export function guardarPorPagina(valor: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CLAVE_STORAGE, String(valor));
}
