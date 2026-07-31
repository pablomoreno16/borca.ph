"use client";

import { LoginForm } from "@/modules/auth/presentation/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 py-16">
      <h1 className="font-serif text-[28px] font-bold text-teal mb-6">Acceso administrativo</h1>
      <LoginForm />
    </div>
  );
}
