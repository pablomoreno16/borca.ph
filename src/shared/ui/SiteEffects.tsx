"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const FADE_IN_SELECTOR = ".card,.check-item,.timeline-item,.blog-card,.stat-box,.team-card,.anim";
const RIPPLE_SELECTOR = ".btn-cta, .btn-submit";

/**
 * Efectos globales compartidos por todas las páginas (equivalentes a los que
 * antes vivían en script.js): fade-in de tarjetas al entrar en el viewport,
 * y el efecto ripple al hacer clic en los botones principales.
 */
export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(FADE_IN_SELECTOR);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    targets.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition = `opacity .45s ease ${i * 50}ms, transform .45s ease ${i * 50}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(RIPPLE_SELECTOR);
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const span = document.createElement("span");
      span.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,0.25);transform:scale(0);animation:ripple .5s linear;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;pointer-events:none;`;
      btn.style.position = "relative";
      btn.style.overflow = "hidden";
      btn.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
