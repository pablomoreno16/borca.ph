"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const AUTOPLAY_MS = 5500;

const SLIDES = [
  {
    id: 1,
    background: "linear-gradient(135deg,var(--color-teal) 0%,var(--color-teal-dark) 100%)",
    isLight: false,
    badgeClass: "promo-badge-gold",
    badgeIcon: "fa-solid fa-tag",
    badgeLabel: "Promoción",
    title: "Diagnóstico gratuito para tu copropiedad",
    description:
      "Agenda tu diagnóstico sin costo antes de fin de mes y descubre oportunidades de ahorro y mejora para tu PH.",
    metaIcon: "fa-regular fa-calendar",
    meta: "Cupos limitados · Válido hasta el 31 de julio",
    ctaHref: "/contacto",
    ctaIcon: "fa-solid fa-magnifying-glass-chart",
    ctaLabel: "Solicitar diagnóstico",
    iconWrapClass: "promo-icon-onDark",
    icon: "fa-solid fa-clipboard-check",
  },
  {
    id: 2,
    background: "var(--color-card-blue)",
    isLight: true,
    badgeClass: "promo-badge-teal",
    badgeIcon: "fa-solid fa-calendar-days",
    badgeLabel: "Evento",
    title: "Webinar: convivencia sin conflictos",
    description:
      "Únete a nuestro conversatorio virtual con herramientas prácticas para fortalecer la sana convivencia en tu conjunto.",
    metaIcon: "fa-regular fa-clock",
    meta: "Jueves 30 de julio · 6:00 p.m. · Virtual",
    ctaHref: "/contacto",
    ctaIcon: "fa-solid fa-video",
    ctaLabel: "Reservar mi cupo",
    iconWrapClass: "promo-icon-onLight",
    icon: "fa-solid fa-people-arrows",
  },
  {
    id: 3,
    background: "var(--color-card-beige)",
    isLight: true,
    badgeClass: "promo-badge-gold",
    badgeIcon: "fa-solid fa-percent",
    badgeLabel: "Oferta",
    title: "Primer mes de administración gratis",
    description:
      "Cambia de administrador este mes y estrena tu gestión con BORCA sin costo durante el primer mes.",
    metaIcon: "fa-regular fa-circle-check",
    meta: "Aplica para nuevas copropiedades",
    ctaHref: "/servicios",
    ctaIcon: "fa-solid fa-house-circle-check",
    ctaLabel: "Conocer la oferta",
    iconWrapClass: "promo-icon-onLight",
    icon: "fa-solid fa-hand-holding-dollar",
  },
  {
    id: 4,
    background: "linear-gradient(135deg,var(--color-teal-dark) 0%,#082e2d 100%)",
    isLight: false,
    badgeClass: "promo-badge-white",
    badgeIcon: "fa-solid fa-calendar-days",
    badgeLabel: "Evento",
    title: "Jornada de asambleas virtuales",
    description:
      "Te acompañamos en la organización y realización de tu asamblea, 100% virtual y conforme a la Ley 675.",
    metaIcon: "fa-regular fa-calendar",
    meta: "Agenda disponible · Agosto 2026",
    ctaHref: "/contacto",
    ctaIcon: "fa-solid fa-gavel",
    ctaLabel: "Agendar asamblea",
    iconWrapClass: "promo-icon-onDark",
    icon: "fa-solid fa-users-rectangle",
  },
  {
    id: 5,
    background: "var(--color-card-lila)",
    isLight: true,
    badgeClass: "promo-badge-gold",
    badgeIcon: "fa-solid fa-tag",
    badgeLabel: "Promoción",
    title: "Recomienda y gana",
    description:
      "Refiere a otra copropiedad y ambas reciben un descuento especial en su próxima renovación de contrato.",
    metaIcon: "fa-solid fa-infinity",
    meta: "Sin límite de referidos",
    ctaHref: "/contacto",
    ctaIcon: "fa-solid fa-gift",
    ctaLabel: "Quiero referir",
    iconWrapClass: "promo-icon-onLight",
    icon: "fa-solid fa-share-nodes",
  },
];

export function PromoCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragState = useRef({ dragging: false, startX: 0, currentX: 0 });

  const goTo = useCallback((i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const startProgress = useCallback(() => {
    const bar = progressBarRef.current;
    if (!bar) return;
    bar.style.transition = "none";
    bar.style.width = "0%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = `width ${AUTOPLAY_MS}ms linear`;
        bar.style.width = "100%";
      });
    });
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
    if (progressBarRef.current) progressBarRef.current.style.transition = "none";
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (isPaused) return;
    startProgress();
    autoplayTimer.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
      startProgress();
    }, AUTOPLAY_MS);
  }, [isPaused, startProgress, stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transition = "";
      trackRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  const userInteract = (action: () => void) => {
    action();
    startAutoplay();
  };

  const dragStart = (x: number) => {
    dragState.current = { dragging: true, startX: x, currentX: x };
    stopAutoplay();
    if (trackRef.current) trackRef.current.style.transition = "none";
  };

  const dragMove = (x: number) => {
    if (!dragState.current.dragging || !trackRef.current) return;
    dragState.current.currentX = x;
    const delta = dragState.current.currentX - dragState.current.startX;
    const pct = (delta / trackRef.current.clientWidth) * 100;
    trackRef.current.style.transform = `translateX(calc(-${index * 100}% + ${pct}%))`;
  };

  const dragEnd = () => {
    if (!dragState.current.dragging || !trackRef.current) return;
    dragState.current.dragging = false;
    trackRef.current.style.transition = "";
    const delta = dragState.current.currentX - dragState.current.startX;
    const threshold = trackRef.current.clientWidth * 0.15;
    let targetIndex = index;
    if (delta > threshold) targetIndex = index - 1;
    else if (delta < -threshold) targetIndex = index + 1;
    const normalized = ((targetIndex % SLIDES.length) + SLIDES.length) % SLIDES.length;
    // Siempre re-aplica el transform, incluso si el índice no cambió (React
    // no re-renderiza en un setState con el mismo valor).
    trackRef.current.style.transform = `translateX(-${normalized * 100}%)`;
    goTo(targetIndex);
    startAutoplay();
  };

  return (
    <>
    <div
      className="promo-carousel"
      id="promoCarousel"
      role="region"
      aria-label="Carrusel de novedades, promociones y anuncios"
      aria-roledescription="carousel"
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") userInteract(() => goTo(index + 1));
        if (e.key === "ArrowLeft") userInteract(() => goTo(index - 1));
      }}
    >
      <div className="promo-viewport">
        <div
          className="promo-track"
          id="promoTrack"
          ref={trackRef}
          onTouchStart={(e) => dragStart(e.touches[0].clientX)}
          onTouchMove={(e) => dragMove(e.touches[0].clientX)}
          onTouchEnd={dragEnd}
          onMouseDown={(e) => {
            e.preventDefault();
            dragStart(e.clientX);
          }}
          onMouseMove={(e) => dragMove(e.clientX)}
          onMouseUp={dragEnd}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`promo-slide${slide.isLight ? " is-light" : ""}`}
              style={{ background: slide.background }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${SLIDES.length}`}
            >
              <div className="promo-content">
                <span className={`promo-badge ${slide.badgeClass}`}>
                  <i className={slide.badgeIcon}></i> {slide.badgeLabel}
                </span>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
                <div className="promo-meta">
                  <i className={slide.metaIcon}></i> {slide.meta}
                </div>
                <Link href={slide.ctaHref} className="btn-cta">
                  <i className={slide.ctaIcon}></i> {slide.ctaLabel}
                </Link>
              </div>
              <div className="promo-visual">
                <div className={`promo-icon-wrap ${slide.iconWrapClass}`}>
                  <i className={slide.icon}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="promo-progress">
          <div className="promo-progress-bar" id="promoProgressBar" ref={progressBarRef}></div>
        </div>
      </div>

      <button
        className="promo-arrow promo-prev"
        aria-label="Novedad anterior"
        type="button"
        onClick={() => userInteract(() => goTo(index - 1))}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button
        className="promo-arrow promo-next"
        aria-label="Siguiente novedad"
        type="button"
        onClick={() => userInteract(() => goTo(index + 1))}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>

    </div>

    <div className="promo-dots" id="promoDots" role="tablist" aria-label="Seleccionar novedad">
      {SLIDES.map((slide, i) => (
        <button
          key={slide.id}
          className={`promo-dot${i === index ? " active" : ""}`}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Ir a novedad ${i + 1}`}
          onClick={() => userInteract(() => goTo(i))}
        ></button>
      ))}
    </div>
    </>
  );
}
