"use client";

import { useState, type FormEvent } from "react";
import { buscarPersona } from "../application/buscarPersona";
import { agregarPropietarioNuevo } from "../application/agregarPropietarioNuevo";
import { agregarPropietarioExistente } from "../application/agregarPropietarioExistente";

const TIPOS_DOCUMENTO = ["CC", "CE", "NIT", "Pasaporte", "TI"];

interface Props {
  modo: "nuevo" | "existente";
  unidadId: string;
  totalActualParticipacion: number;
  onAgregado: () => void;
  onCancelar: () => void;
}

export function AgregarPropietarioModal({ modo, unidadId, totalActualParticipacion, onAgregado, onCancelar }: Props) {
  const [tipoDocumento, setTipoDocumento] = useState(TIPOS_DOCUMENTO[0]);
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [personaId, setPersonaId] = useState<string | null>(null);
  const [consultando, setConsultando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // En modo "existente" los campos solo se habilitan tras encontrar a la
  // persona con Consultar; en "nuevo" están habilitados desde el inicio.
  const camposHabilitados = modo === "nuevo" || personaId !== null;
  const porcentajeNumero = Number(porcentaje) || 0;
  const totalConEste = totalActualParticipacion + porcentajeNumero;

  async function onConsultar() {
    if (!numeroDocumento.trim()) return;
    setError(null);
    setConsultando(true);
    try {
      const persona = await buscarPersona(tipoDocumento, numeroDocumento.trim());
      setBuscado(true);
      setPersonaId(persona?.id ?? null);
      setNombre(persona?.nombre ?? "");
      setCorreo(persona?.correo ?? "");
      setTelefono(persona?.telefono ?? "");
    } catch {
      setError("No se pudo consultar el documento.");
    } finally {
      setConsultando(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const datosPersona = {
        tipoDocumento: modo === "existente" ? tipoDocumento : tipoDocumento.trim() ? tipoDocumento : null,
        numeroDocumento: numeroDocumento.trim() ? numeroDocumento.trim() : null,
        nombre,
        correo: correo.trim() ? correo : null,
        telefono: telefono.trim() ? telefono : null,
      };
      if (modo === "nuevo") {
        await agregarPropietarioNuevo(unidadId, datosPersona, porcentajeNumero);
      } else {
        if (!personaId) throw new Error("Consulta un propietario existente antes de guardar.");
        await agregarPropietarioExistente(unidadId, personaId, datosPersona, porcentajeNumero);
      }
      onAgregado();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo agregar el propietario.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card card-border bg-white flex flex-col gap-3.5 max-w-[480px]">
      <h3 className="font-bold">{modo === "nuevo" ? "Nuevo propietario" : "Agregar propietario existente"}</h3>

      {modo === "existente" && (
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-sm font-bold mb-1">Tipo de documento</label>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
            >
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1">Número de documento</label>
            <input
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
            />
          </div>
          <button
            type="button"
            onClick={onConsultar}
            disabled={consultando || !numeroDocumento.trim()}
            className="btn-cta bg-gold disabled:opacity-60"
          >
            {consultando ? "Consultando..." : "Consultar"}
          </button>
        </div>
      )}

      {modo === "existente" && buscado && !personaId && (
        <p className="text-sm text-red-600">No se encontró ningún propietario con ese documento.</p>
      )}

      {modo === "nuevo" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold mb-1">Tipo de documento</label>
            <select
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
            >
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Número de documento</label>
            <input
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px]"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-1">Nombre</label>
        <input
          required
          disabled={!camposHabilitados}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold mb-1">Correo</label>
          <input
            type="email"
            disabled={!camposHabilitados}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Teléfono</label>
          <input
            disabled={!camposHabilitados}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">% de participación</label>
        <input
          required
          type="number"
          step="0.01"
          min="0"
          max="100"
          disabled={!camposHabilitados}
          value={porcentaje}
          onChange={(e) => setPorcentaje(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3 py-2 text-[15px] disabled:bg-[#f4f7f6]"
        />
      </div>
      <p className="text-sm text-text-body">
        % de participación total de la unidad: <strong>{totalConEste.toFixed(2)}%</strong>
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando || !camposHabilitados}
          className="btn-cta bg-gold disabled:opacity-60"
        >
          {guardando ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" onClick={onCancelar} className="text-sm font-semibold text-text-body hover:underline">
          Cancelar
        </button>
      </div>
    </form>
  );
}
