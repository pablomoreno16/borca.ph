"use client";

import { usePropietariosUnidad } from "../application/usePropietariosUnidad";

interface Props {
  unidadId: string;
}

export function PropietariosTable({ unidadId }: Props) {
  const { propietarios, cargando } = usePropietariosUnidad(unidadId);

  if (cargando) return <p className="text-text-body text-sm">Cargando...</p>;

  if (propietarios.length === 0) {
    return <p className="text-text-body text-sm">Esta unidad todavía no tiene propietarios registrados.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#e5e9e8] text-text-body">
            <th className="py-2 pr-3">Propietario</th>
            <th className="py-2 pr-3">% Participación</th>
            <th className="py-2 pr-3">Desde</th>
            <th className="py-2 pr-3">Hasta</th>
          </tr>
        </thead>
        <tbody>
          {propietarios.map((propietario) => (
            <tr key={propietario.id} className="border-b border-[#eef2f1]">
              <td className="py-2 pr-3 font-semibold">{propietario.nombre}</td>
              <td className="py-2 pr-3 text-text-body">
                {propietario.porcentajeParticipacion !== null
                  ? `${propietario.porcentajeParticipacion.toFixed(2)}%`
                  : "—"}
              </td>
              <td className="py-2 pr-3 text-text-body">{propietario.fechaInicio}</td>
              <td className="py-2 pr-3 text-text-body">{propietario.fechaFin ?? "Actual"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
