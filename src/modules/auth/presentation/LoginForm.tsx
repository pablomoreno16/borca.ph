"use client";

import { useState, type FormEvent } from "react";
import { iniciarSesion } from "../infrastructure/authRepository";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await iniciarSesion(email, password);
      // El redirect según el rol del usuario lo maneja la página que usa
      // este formulario (observa el cambio de sesión), no este componente.
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[380px] flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="block text-sm font-bold mb-1.5">
          Correo
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3.5 py-2.5 text-[15px] focus:outline-none focus:border-teal"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-bold mb-1.5">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={mostrarPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[8px] border border-[#d8dedd] pl-3.5 pr-10 py-2.5 text-[15px] focus:outline-none focus:border-teal"
          />
          <button
            type="button"
            aria-label={mostrarPassword ? "Ocultar contraseña" : "Mantén presionado para ver la contraseña"}
            tabIndex={-1}
            className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-[#999] hover:text-teal"
            onMouseDown={() => setMostrarPassword(true)}
            onMouseUp={() => setMostrarPassword(false)}
            onMouseLeave={() => setMostrarPassword(false)}
            onTouchStart={() => setMostrarPassword(true)}
            onTouchEnd={() => setMostrarPassword(false)}
            onTouchCancel={() => setMostrarPassword(false)}
          >
            <i className={`fa-solid ${mostrarPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={cargando} className="btn-cta bg-gold justify-center disabled:opacity-60">
        {cargando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
