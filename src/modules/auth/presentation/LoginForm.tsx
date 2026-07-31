"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { iniciarSesion } from "../infrastructure/authRepository";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await iniciarSesion(email, password);
      router.replace("/admin");
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
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-[8px] border border-[#d8dedd] px-3.5 py-2.5 text-[15px] focus:outline-none focus:border-teal"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={cargando} className="btn-cta bg-gold justify-center disabled:opacity-60">
        {cargando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
