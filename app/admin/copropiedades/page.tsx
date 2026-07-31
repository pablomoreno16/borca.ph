"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSesion } from "@/modules/auth/application/useSesion";
import { tieneAlgunRol } from "@/modules/auth/domain/types";
import { useCopropiedades } from "@/modules/copropiedades/application/useCopropiedades";
import { guardarCopropiedad } from "@/modules/copropiedades/application/guardarCopropiedad";
import { CopropiedadTable } from "@/modules/copropiedades/presentation/CopropiedadTable";
import { CopropiedadForm } from "@/modules/copropiedades/presentation/CopropiedadForm";
import { ImportarUnidadesForm } from "@/modules/copropiedades/presentation/ImportarUnidadesForm";
import type { Copropiedad, CopropiedadInput } from "@/modules/copropiedades/domain/types";

export default function AdminCopropiedadesPage() {
  const router = useRouter();
  const { cargando: cargandoSesion, sesion } = useSesion();
  const autorizado = tieneAlgunRol(sesion, ["super_admin"]);

  useEffect(() => {
    if (cargandoSesion) return;
    if (!autorizado) router.replace("/admin");
  }, [cargandoSesion, autorizado, router]);

  const { items, cargando, error, recargar } = useCopropiedades();
  const [editando, setEditando] = useState<Copropiedad | null>(null);
  const [creando, setCreando] = useState(false);
  const [importando, setImportando] = useState<Copropiedad | null>(null);

  if (cargandoSesion || !autorizado) {
    return <p className="text-text-body">Verificando acceso...</p>;
  }

  async function onGuardar(input: CopropiedadInput, id?: string) {
    await guardarCopropiedad(input, id);
    setEditando(null);
    setCreando(false);
    await recargar();
  }

  const mostrandoForm = creando || editando !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-teal">Copropiedades</h1>
        {!mostrandoForm && !importando && (
          <button type="button" onClick={() => setCreando(true)} className="btn-cta bg-gold">
            <i className="fa-solid fa-plus"></i> Nueva copropiedad
          </button>
        )}
      </div>

      {mostrandoForm && (
        <CopropiedadForm
          itemInicial={editando ?? undefined}
          onGuardar={onGuardar}
          onCancelar={() => {
            setEditando(null);
            setCreando(false);
          }}
        />
      )}

      {importando && (
        <ImportarUnidadesForm
          copropiedadId={importando.id}
          copropiedadNombre={importando.nombre}
          onImportado={() => setImportando(null)}
          onCancelar={() => setImportando(null)}
        />
      )}

      {cargando && <p className="text-text-body">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!cargando && !error && !mostrandoForm && !importando && (
        <CopropiedadTable items={items} onEditar={setEditando} onImportar={setImportando} />
      )}
    </div>
  );
}
