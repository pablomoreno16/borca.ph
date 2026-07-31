"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/shared/supabase/client";
import type { Sesion } from "../domain/types";
import { obtenerRolesDeUsuario } from "../infrastructure/authRepository";

interface EstadoSesion {
  cargando: boolean;
  sesion: Sesion | null;
}

export function useSesion(): EstadoSesion {
  const [estado, setEstado] = useState<EstadoSesion>({ cargando: true, sesion: null });

  useEffect(() => {
    let activo = true;

    async function cargar(userId?: string, email?: string | null) {
      if (!userId) {
        if (activo) setEstado({ cargando: false, sesion: null });
        return;
      }
      const roles = await obtenerRolesDeUsuario(userId);
      if (activo) setEstado({ cargando: false, sesion: { userId, email: email ?? null, roles } });
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      cargar(session?.user.id, session?.user.email);
    });

    const { data: subscripcion } = supabase.auth.onAuthStateChange((_event, session) => {
      cargar(session?.user.id, session?.user.email);
    });

    return () => {
      activo = false;
      subscripcion.subscription.unsubscribe();
    };
  }, []);

  return estado;
}
