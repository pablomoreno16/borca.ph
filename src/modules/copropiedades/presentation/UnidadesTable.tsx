"use client";

import { useUnidadesPaginadas } from "../application/useUnidadesPaginadas";

const OPCIONES_POR_PAGINA = [10, 20, 50, 100];

const TIPO_LABEL: Record<string, string> = {
  apartamento: "Apartamento",
  parqueadero: "Parqueadero",
  deposito: "Depósito",
  local: "Local",
  oficina: "Oficina",
};

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
  } = useUnidadesPaginadas(copropiedadId);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <input
          value={filtro}
          onChange={(e) => cambiarFiltro(e.target.value)}
          placeholder="Filtrar por # de apartamento"
          className="rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[14px] w-[240px]"
        />
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
                <th className="py-2 pr-3">Bloque</th>
                <th className="py-2 pr-3">Apartamento</th>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3">Coeficiente</th>
              </tr>
            </thead>
            <tbody>
              {items.map((unidad) => (
                <tr key={unidad.id} className="border-b border-[#eef2f1]">
                  <td className="py-2 pr-3">{unidad.bloque}</td>
                  <td className="py-2 pr-3 font-semibold">{unidad.identificador}</td>
                  <td className="py-2 pr-3 text-text-body">{TIPO_LABEL[unidad.tipo] ?? unidad.tipo}</td>
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
    </div>
  );
}
