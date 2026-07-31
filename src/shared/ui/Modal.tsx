"use client";

import { useEffect } from "react";

interface Props {
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ onClose, children }: Props) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-5" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[640px] max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
