"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSesion } from "@/modules/auth/application/useSesion";
import { tieneAlgunRol } from "@/modules/auth/domain/types";
import { obtenerCopropiedad } from "@/modules/copropiedades/infrastructure/copropiedadRepository";
import { guardarCopropiedad } from "@/modules/copropiedades/application/guardarCopropiedad";
import { exportarUnidadesExcel } from "@/modules/copropiedades/application/exportarUnidadesExcel";
import { CopropiedadForm } from "@/modules/copropiedades/presentation/CopropiedadForm";
import { ImportarUnidadesForm } from "@/modules/copropiedades/presentation/ImportarUnidadesForm";
import { UnidadesTable } from "@/modules/copropiedades/presentation/UnidadesTable";
import { Modal } from "@/shared/ui/Modal";
import type { Copropiedad, CopropiedadInput } from "@/modules/copropiedades/domain/types";

// Ruta estática con el id como query param (no un segmento dinámico [id]):
// output: 'export' exige generateStaticParams() para segmentos dinámicos,
// que enumera rutas conocidas en build time — pero los ids de copropiedad
// se crean en runtime en Supabase, así que no hay forma de enumerarlos.
export default function AdminCopropiedadDetallePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const { cargando: cargandoSesion, sesion } = useSesion();
  const autorizado = tieneAlgunRol(sesion, ["super_admin"]);

  useEffect(() => {
    if (cargandoSesion) return;
    if (!autorizado) router.replace("/admin/carrusel");
  }, [cargandoSesion, autorizado, router]);

  const [copropiedad, setCopropiedad] = useState<Copropiedad | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importando, setImportando] = useState(false);
  const [exportando, setExportando] = useState(false);
  // Cambiar la key fuerza a UnidadesTable a remontarse y volver a
  // consultar — su propio hook solo refetch cuando cambian pagina/
  // porPagina/filtro, no cuando otro componente (el importador) crea
  // unidades nuevas.
  const [refrescarUnidades, setRefrescarUnidades] = useState(0);

  useEffect(() => {
    if (!autorizado || !id) return;
    let activo = true;
    obtenerCopropiedad(id)
      .then((c) => {
        if (activo) setCopropiedad(c);
      })
      .catch(() => {
        if (activo) setError("No se pudo cargar la copropiedad.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [id, autorizado]);

  async function onGuardar(input: CopropiedadInput, itemId?: string) {
    const actualizado = await guardarCopropiedad(input, itemId);
    setCopropiedad(actualizado);
  }

  async function onExportar() {
    if (!copropiedad) return;
    setExportando(true);
    try {
      const blob = await exportarUnidadesExcel(copropiedad.id);
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `unidades_${copropiedad.nombre.trim().replace(/\s+/g, "_")}.xlsx`;
      enlace.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("No se pudo generar el archivo de exportación.");
    } finally {
      setExportando(false);
    }
  }

  if (cargandoSesion || !autorizado) {
    return <p className="text-text-body">Verificando acceso...</p>;
  }

  if (!id) {
    return <p className="text-red-600">Falta el identificador de la copropiedad.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <Link href="/admin/copropiedades" className="text-sm text-teal font-semibold hover:underline w-fit">
        <i className="fa-solid fa-arrow-left"></i> Volver a copropiedades
      </Link>

      {cargando && <p className="text-text-body">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {copropiedad && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="font-serif text-2xl font-bold text-teal">{copropiedad.nombre}</h1>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onExportar}
                disabled={exportando}
                className="text-sm font-semibold text-teal hover:underline disabled:opacity-60"
              >
                <i className="fa-solid fa-file-arrow-down"></i> {exportando ? "Exportando..." : "Exportar"}
              </button>
              <button type="button" onClick={() => setImportando((v) => !v)} className="btn-cta bg-gold">
                <i className="fa-solid fa-file-excel"></i> Importar unidades
              </button>
            </div>
          </div>

          <CopropiedadForm
            itemInicial={copropiedad}
            onGuardar={onGuardar}
            onCancelar={() => router.push("/admin/copropiedades")}
          />

          {importando && (
            <Modal onClose={() => setImportando(false)}>
              <ImportarUnidadesForm
                copropiedadId={copropiedad.id}
                copropiedadNombre={copropiedad.nombre}
                onImportado={() => {
                  setImportando(false);
                  setRefrescarUnidades((n) => n + 1);
                }}
                onCancelar={() => setImportando(false)}
              />
            </Modal>
          )}

          <div>
            <h2 className="font-serif text-xl font-bold text-teal mb-3.5">Unidades privadas</h2>
            <UnidadesTable key={refrescarUnidades} copropiedadId={copropiedad.id} />
          </div>
        </>
      )}
    </div>
  );
}
