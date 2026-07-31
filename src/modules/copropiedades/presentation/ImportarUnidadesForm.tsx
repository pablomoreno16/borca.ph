"use client";

import { useState } from "react";
import type { FilaImportada, ResumenImportacion } from "../domain/types";
import { analizarExcelUnidades, confirmarImportacion } from "../application/importarUnidadesDesdeExcel";

interface Props {
  copropiedadId: string;
  copropiedadNombre: string;
  onImportado: () => void;
  onCancelar: () => void;
}

export function ImportarUnidadesForm({ copropiedadId, copropiedadNombre, onImportado, onCancelar }: Props) {
  const [filas, setFilas] = useState<FilaImportada[] | null>(null);
  const [resumen, setResumen] = useState<ResumenImportacion | null>(null);
  const [analizando, setAnalizando] = useState(false);
  const [importando, setImportando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState<string | null>(null);

  async function onSeleccionarArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setNombreArchivo(archivo.name);
    setError(null);
    setFilas(null);
    setResumen(null);
    setAnalizando(true);
    try {
      const resultado = await analizarExcelUnidades(archivo);
      setFilas(resultado.filas);
      setResumen(resultado.resumen);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo leer el archivo.");
    } finally {
      setAnalizando(false);
      e.target.value = "";
    }
  }

  async function onConfirmar() {
    if (!filas) return;
    setError(null);
    setImportando(true);
    try {
      await confirmarImportacion(copropiedadId, filas);
      onImportado();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar la importación.");
    } finally {
      setImportando(false);
    }
  }

  return (
    <div className="card card-border bg-white flex flex-col gap-3.5 max-w-[640px]">
      <div>
        <h3 className="font-bold">Importar unidades para {copropiedadNombre}</h3>
        <p className="text-sm text-text-body">
          El archivo debe tener columnas: Bloque (opcional, se asume &quot;1&quot; si está vacío), Apartamento,
          Nombre del propietario y Coeficiente (en fracción 0-1 o en porcentaje 1-100, se detecta automáticamente).
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <label
          htmlFor="archivo-unidades"
          className={`inline-flex items-center gap-2 rounded-[8px] border border-[#d8dedd] px-3 py-2 text-sm font-semibold text-teal ${
            analizando || importando ? "opacity-60" : "cursor-pointer hover:bg-[#f4f7f6]"
          }`}
        >
          <i className="fa-solid fa-upload"></i> Click aquí para subir archivo
        </label>
        <input
          id="archivo-unidades"
          type="file"
          accept=".xlsx,.xls"
          onChange={onSeleccionarArchivo}
          disabled={analizando || importando}
          className="hidden"
        />
        {nombreArchivo && <span className="text-sm text-text-body">{nombreArchivo}</span>}
      </div>
      {analizando && <p className="text-sm text-text-body">Leyendo archivo...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {resumen && (
        <div className="rounded-[8px] border border-[#e5e9e8] p-3.5 text-sm flex flex-col gap-1.5">
          <p>
            <strong>{resumen.totalFilas}</strong> unidades encontradas · suma de coeficientes:{" "}
            <strong>{resumen.sumaCoeficientes.toFixed(4)}</strong>
          </p>
          {resumen.escalaConvertida && (
            <p className="text-text-body">
              <i className="fa-solid fa-circle-info"></i> Los coeficientes del archivo estaban en escala 1-100 (%) —
              se convirtieron automáticamente a fracción (0-1) antes de guardar.
            </p>
          )}
          {resumen.esValida ? (
            <p className="text-teal font-semibold">
              <i className="fa-solid fa-circle-check"></i> Listo para importar.
            </p>
          ) : (
            <ul className="text-red-600 list-disc pl-5">
              {resumen.errores.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onConfirmar}
          disabled={!resumen?.esValida || importando}
          className="btn-cta bg-gold disabled:opacity-60"
        >
          {importando ? "Importando..." : "Confirmar importación"}
        </button>
        <button type="button" onClick={onCancelar} className="text-sm font-semibold text-text-body hover:underline">
          Cerrar
        </button>
      </div>
    </div>
  );
}
