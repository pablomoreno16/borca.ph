import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Copia .env.local.example a .env.local."
  );
}

// Sitio exportado estáticamente (sin servidor): toda la sesión vive en el
// navegador, persistida por el propio cliente de Supabase (localStorage).
export const supabase = createClient<Database>(url, anonKey);
