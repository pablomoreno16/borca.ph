"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUnidadesPaginadas } from "../application/useUnidadesPaginadas";
import { useSumaCoeficientes } from "../application/useSumaCoeficientes";
import { TIPO_UNIDAD_LABEL } from "../domain/etiquetas";
import { Modal } from "@/shared/ui/Modal";
import { EditarUnidadesLoteModal } from "./EditarUnidadesLoteModal";

const OPCIONES_POR_PAGINA = [10, 20, 50, 100];

interface Props {
  copropiedadId: string;
}

export function UnidadesTable({ copropiedadId }: Props) {
  const {
    items,
    total,
    pagina,
    totalPaginas,
    porPagina,
    filtro,
    cargando,
    error,
    setPagina,
    cambiarPorPagina,
    cambiarFiltro,
    refrescar,
  } = useUnidadesPaginadas(copropiedadId);
  const sumaCoeficientes = useSumaCoeficientes(copropiedadId);

  // Selección persistente: no depende de pagina/porPagina/filtro, así que
  // se mantiene al cambiar de página y se acumula si se selecciona bajo
  // un filtro distinto (no se limpia al filtrar).
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const [loteAbierto, setLoteAbierto] = useState(false);

  const idsPaginaActual = items.map((u) => u.id);
  const todosSeleccionados = idsPaginaActual.length > 0 && idsPaginaActual.every((id) => seleccionados.has(id));
  const algunoSeleccionado = idsPaginaActual.some((id) => seleccionados.has(id));

  const checkboxHeaderRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (checkboxHeaderRef.current) {
      checkboxHeaderRef.current.indeterminate = algunoSeleccionado && !todosSeleccionados;
    }
  }, [algunoSeleccionado, todosSeleccionados]);

  function alternarTodos() {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (todosSeleccionados) {
        idsPaginaActual.forEach((id) => next.delete(id));
      } else {
        idsPaginaActual.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  function alternarUno(id: string) {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onGuardadoLote() {
    setLoteAbierto(false);
    setSeleccionados(new Set());
    refrescar();
  }

  return (
    <div className="flex flex-col gap-3.5">
      {sumaCoeficientes !== null && (
        <p className="text-sm font-semibold text-text-body">
          Total coeficientes: {(sumaCoeficientes * 100).toFixed(2)}%
        </p>
      )}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <input
          value={filtro}
          onChange={(e) => cambiarFiltro(e.target.value)}
          placeholder="Filtrar por # o propietario"
          className="rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[14px] w-[240px]"
        />
        <div className="flex items-center gap-3 flex-wrap">
          {seleccionados.size > 0 && (
            <>
              <span className="text-sm text-text-body">{seleccionados.size} seleccionada(s)</span>
              <button type="button" onClick={() => setSeleccionados(new Set())} className="text-sm text-text-body hover:underline">
                Limpiar selección
              </button>
              <button type="button" onClick={() => setLoteAbierto(true)} className="btn-cta bg-gold text-sm">
                <i className="fa-solid fa-pen"></i> Editar seleccionadas ({seleccionados.size})
              </button>
            </>
          )}
          <div className="flex items-center gap-2 text-sm text-text-body">
            <label htmlFor="por-pagina">Por página</label>
            <select
              id="por-pagina"
              value={porPagina}
              onChange={(e) => cambiarPorPagina(Number(e.target.value))}
              className="rounded-[8px] border border-[#d8dedd] px-2 py-1.5 text-sm"
            >
              {OPCIONES_POR_PAGINA.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!error && items.length === 0 && !cargando && (
        <p className="text-text-body text-sm">
          {filtro ? "No hay unidades que coincidan con el filtro." : "Todavía no hay unidades registradas."}
        </p>
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#e5e9e8] text-text-body">
                <th className="py-2 pr-3 w-8">
                  <input ref={checkboxHeaderRef} type="checkbox" checked={todosSeleccionados} onChange={alternarTodos} />
                </th>
                <th className="py-2 pr-3">Bloque</th>
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Propietario</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3">Coeficiente</th>
              </tr>
            </thead>
            <tbody>
              {items.map((unidad) => (
                <tr key={unidad.id} className="border-b border-[#eef2f1]">
                  <td className="py-2 pr-3">
                    <input
                      type="checkbox"
                      checked={seleccionados.has(unidad.id)}
                      onChange={() => alternarUno(unidad.id)}
                    />
                  </td>
                  <td className="py-2 pr-3">{unidad.bloque}</td>
                  <td className="py-2 pr-3 font-semibold">
                    <Link href={`/admin/copropiedades/unidad?id=${unidad.id}`} className="text-teal hover:underline">
                      {unidad.identificador}
                    </Link>
                  </td>
                  <td className="py-2 pr-3 text-text-body">{unidad.propietarioNombre ?? "—"}</td>
                  <td className="py-2 pr-3 text-text-body">{TIPO_UNIDAD_LABEL[unidad.tipo] ?? unidad.tipo}</td>
                  <td className="py-2 pr-3 text-text-body">{(unidad.coeficiente * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 0 && (
        <div className="flex items-center justify-between text-sm text-text-body">
          <span>
            {(pagina - 1) * porPagina + 1}–{Math.min(pagina * porPagina, total)} de {total}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={pagina <= 1}
              onClick={() => setPagina(pagina - 1)}
              className="disabled:opacity-30 font-semibold text-teal"
            >
              <i className="fa-solid fa-chevron-left"></i> Anterior
            </button>
            <span>
              Página {pagina} de {totalPaginas}
            </span>
            <button
              type="button"
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina(pagina + 1)}
              className="disabled:opacity-30 font-semibold text-teal"
            >
              Siguiente <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      {loteAbierto && (
        <Modal onClose={() => setLoteAbierto(false)}>
          <EditarUnidadesLoteModal
            unidadIds={Array.from(seleccionados)}
            onGuardado={onGuardadoLote}
            onCancelar={() => setLoteAbierto(false)}
          />
        </Modal>
      )}
    </div>
  );
}
