"use client";

import { useState } from "react";
import { useCarruselItems } from "@/modules/carrusel/application/useCarruselItems";
import { guardarCarruselItem } from "@/modules/carrusel/application/guardarCarruselItem";
import { eliminarItem, actualizarOrden } from "@/modules/carrusel/infrastructure/carruselRepository";
import { CarruselTable } from "@/modules/carrusel/presentation/CarruselTable";
import { CarruselForm } from "@/modules/carrusel/presentation/CarruselForm";
import type { CarruselItem, CarruselItemInput } from "@/modules/carrusel/domain/types";

export default function AdminCarruselPage() {
  const { items, cargando, error, recargar } = useCarruselItems();
  const [editando, setEditando] = useState<CarruselItem | null>(null);
  const [creando, setCreando] = useState(false);

  async function onGuardar(input: CarruselItemInput, id?: string) {
    await guardarCarruselItem(input, id);
    setEditando(null);
    setCreando(false);
    await recargar();
  }

  async function onEliminar(item: CarruselItem) {
    if (!confirm(`¿Eliminar "${item.titulo}"?`)) return;
    await eliminarItem(item.id);
    await recargar();
  }

  async function onMover(item: CarruselItem, direccion: "arriba" | "abajo") {
    const ordenados = [...items].sort((a, b) => a.orden - b.orden);
    const i = ordenados.findIndex((x) => x.id === item.id);
    const j = direccion === "arriba" ? i - 1 : i + 1;
    if (j < 0 || j >= ordenados.length) return;
    const vecino = ordenados[j];
    await Promise.all([actualizarOrden(item.id, vecino.orden), actualizarOrden(vecino.id, item.orden)]);
    await recargar();
  }

  const mostrandoForm = creando || editando !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-teal">Carrusel de novedades</h1>
        {!mostrandoForm && (
          <button type="button" onClick={() => setCreando(true)} className="btn-cta bg-gold">
            <i className="fa-solid fa-plus"></i> Nuevo ítem
          </button>
        )}
      </div>

      {mostrandoForm && (
        <CarruselForm
          itemInicial={editando ?? undefined}
          siguienteOrden={items.length}
          onGuardar={onGuardar}
          onCancelar={() => {
            setEditando(null);
            setCreando(false);
          }}
        />
      )}

      {cargando && <p className="text-text-body">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!cargando && !error && (
        <CarruselTable
          items={[...items].sort((a, b) => a.orden - b.orden)}
          onEditar={(item) => {
            setEditando(item);
            setCreando(false);
          }}
          onEliminar={onEliminar}
          onMover={onMover}
        />
      )}
    </div>
  );
}
