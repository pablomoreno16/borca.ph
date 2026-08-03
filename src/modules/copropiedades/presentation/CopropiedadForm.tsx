"use client";

import { Fragment, useState, type FormEvent } from "react";
import type { Copropiedad, CopropiedadInput, EstadoCopropiedad, TipoCopropiedad, TipoCuenta } from "../domain/types";

interface Props {
  itemInicial?: Copropiedad;
  onGuardar: (input: CopropiedadInput, id?: string) => Promise<void>;
  onCancelar: () => void;
}

export function CopropiedadForm({ itemInicial, onGuardar, onCancelar }: Props) {
  // Al crear (sin itemInicial) el form siempre está editable. Al editar una
  // copropiedad existente arranca de solo lectura, con un botón "Editar"
  // que la habilita — Guardar y Cancelar la vuelven a dejar de solo lectura.
  const editandoExistente = !!itemInicial;
  const [modoEdicion, setModoEdicion] = useState(!editandoExistente);

  const [nombre, setNombre] = useState(itemInicial?.nombre ?? "");
  const [tipo, setTipo] = useState<TipoCopropiedad>(itemInicial?.tipo ?? "residencial");
  const [nit, setNit] = useState(itemInicial?.nit ?? "");
  const [estado, setEstado] = useState<EstadoCopropiedad>(itemInicial?.estado ?? "activa");
  const [direccion, setDireccion] = useState(itemInicial?.direccion ?? "");
  const [ciudad, setCiudad] = useState(itemInicial?.ciudad ?? "");
  const [telefono, setTelefono] = useState(itemInicial?.telefono ?? "");
  const [correo, setCorreo] = useState(itemInicial?.correo ?? "");
  const [banco, setBanco] = useState(itemInicial?.banco ?? "");
  const [tipoCuenta, setTipoCuenta] = useState<TipoCuenta | "">(itemInicial?.tipoCuenta ?? "");
  const [numeroCuenta, setNumeroCuenta] = useState(itemInicial?.numeroCuenta ?? "");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  function resetCampos() {
    if (!itemInicial) return;
    setNombre(itemInicial.nombre);
    setTipo(itemInicial.tipo);
    setNit(itemInicial.nit ?? "");
    setEstado(itemInicial.estado);
    setDireccion(itemInicial.direccion ?? "");
    setCiudad(itemInicial.ciudad ?? "");
    setTelefono(itemInicial.telefono ?? "");
    setCorreo(itemInicial.correo ?? "");
    setBanco(itemInicial.banco ?? "");
    setTipoCuenta(itemInicial.tipoCuenta ?? "");
    setNumeroCuenta(itemInicial.numeroCuenta ?? "");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await onGuardar(
        {
          nombre,
          tipo,
          nit: nit.trim() ? nit : null,
          estado,
          direccion: direccion.trim() ? direccion : null,
          ciudad: ciudad.trim() ? ciudad : null,
          telefono: telefono.trim() ? telefono : null,
          correo: correo.trim() ? correo : null,
          banco: banco.trim() ? banco : null,
          tipoCuenta: tipoCuenta || null,
          numeroCuenta: numeroCuenta.trim() ? numeroCuenta : null,
        },
        itemInicial?.id
      );
      if (editandoExistente) setModoEdicion(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la copropiedad.");
    } finally {
      setGuardando(false);
    }
  }

  function onCancelarClick() {
    if (editandoExistente) {
      resetCampos();
      setError(null);
      setModoEdicion(false);
    } else {
      onCancelar();
    }
  }

  const soloLectura = !modoEdicion;

  return (
    <form onSubmit={onSubmit} className="card card-border bg-white flex flex-col gap-6 max-w-[620px]">
      <div className="flex flex-col gap-3.5">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.5px] text-teal">Información personal</h3>
        <div>
          <label className="block text-sm font-bold mb-1">Nombre</label>
          <input
            required
            disabled={soloLectura}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Tipo</label>
          <select
            disabled={soloLectura}
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoCopropiedad)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          >
            <option value="residencial">Residencial</option>
            <option value="comercial">Comercial</option>
            <option value="mixta">Mixta</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold mb-1">NIT</label>
            <input
              disabled={soloLectura}
              value={nit}
              onChange={(e) => setNit(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                disabled={soloLectura}
                checked={estado === "activa"}
                onChange={(e) => setEstado(e.target.checked ? "activa" : "inactiva")}
              />
              Activa
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Dirección</label>
          <input
            disabled={soloLectura}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold mb-1">Ciudad</label>
            <input
              disabled={soloLectura}
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Teléfono</label>
            <input
              disabled={soloLectura}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Correo</label>
          <input
            type="email"
            disabled={soloLectura}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3.5 pt-4 border-t border-[#eef2f1]">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.5px] text-teal">Información bancaria</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold mb-1">Banco</label>
            <input
              disabled={soloLectura}
              value={banco}
              onChange={(e) => setBanco(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Tipo de cuenta</label>
            <select
              disabled={soloLectura}
              value={tipoCuenta}
              onChange={(e) => setTipoCuenta(e.target.value as TipoCuenta | "")}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
            >
              <option value="">Sin definir</option>
              <option value="ahorros">Ahorros</option>
              <option value="corriente">Corriente</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Número de cuenta</label>
          <input
            disabled={soloLectura}
            value={numeroCuenta}
            onChange={(e) => setNumeroCuenta(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        {modoEdicion ? (
          // key distinta a la del botón "Editar" a propósito: sin esto,
          // React reutiliza el mismo <button> del DOM y solo le cambia el
          // atributo type de "button" a "submit" — como el cambio ocurre
          // durante el mismo click, el navegador termina disparando el
          // submit del form sobre ese botón reciclado.
          <Fragment key="editando">
            <button type="submit" disabled={guardando} className="btn-cta bg-gold disabled:opacity-60">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={onCancelarClick}
              className="text-sm font-semibold text-text-body hover:underline"
            >
              Cancelar
            </button>
          </Fragment>
        ) : (
          <button key="viendo" type="button" onClick={() => setModoEdicion(true)} className="btn-cta bg-gold">
            <i className="fa-solid fa-pen"></i> Editar
          </button>
        )}
      </div>
    </form>
  );
}
