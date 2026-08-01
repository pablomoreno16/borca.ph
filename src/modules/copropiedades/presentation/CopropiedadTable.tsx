"use client";

import Link from "next/link";
import type { Copropiedad } from "../domain/types";
import { TIPO_COPROPIEDAD_LABEL } from "../domain/etiquetas";

interface Props {
  items: Copropiedad[];
}

export function CopropiedadTable({ items }: Props) {
  if (items.length === 0) {
    return <p className="text-text-body">Todavía no hay copropiedades registradas.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#e5e9e8] text-text-body">
            <th className="py-2 pr-3">Nombre</th>
            <th className="py-2 pr-3">NIT</th>
            <th className="py-2 pr-3">Ciudad</th>
            <th className="py-2 pr-3">Tipo</th>
            <th className="py-2 pr-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-[#eef2f1]">
              <td className="py-2 pr-3 font-semibold">
                <Link href={`/admin/copropiedades/detalle?id=${item.id}`} className="text-teal hover:underline">
                  {item.nombre}
                </Link>
              </td>
              <td className="py-2 pr-3 text-text-body">{item.nit ?? "—"}</td>
              <td className="py-2 pr-3 text-text-body">{item.ciudad ?? "—"}</td>
              <td className="py-2 pr-3 text-text-body">{TIPO_COPROPIEDAD_LABEL[item.tipo] ?? item.tipo}</td>
              <td className="py-2 pr-3">
                {item.estado === "activa" ? (
                  <span className="text-teal font-semibold">Activa</span>
                ) : (
                  <span className="text-[#999]">Inactiva</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
