"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CarruselItem, TipoCarrusel } from "../domain/types";
import { listarItemsPublicos } from "../infrastructure/carruselRepository";

const AUTOPLAY_MS = 5500;

interface Preset {
  background: string;
  isLight: boolean;
  badgeClass: string;
  badgeIcon: string;
  icon: string;
  iconWrapClass: string;
}

const TIPO_PRESET: Record<TipoCarrusel, Preset> = {
  promocion: {
    background: "linear-gradient(135deg,var(--color-teal) 0%,var(--color-teal-dark) 100%)",
    isLight: false,
    badgeClass: "promo-badge-gold",
    badgeIcon: "fa-solid fa-tag",
    icon: "fa-solid fa-hand-holding-dollar",
    iconWrapClass: "promo-icon-onDark",
  },
  evento: {
    background: "var(--color-card-blue)",
    isLight: true,
    badgeClass: "promo-badge-teal",
    badgeIcon: "fa-solid fa-calendar-days",
    icon: "fa-solid fa-people-arrows",
    iconWrapClass: "promo-icon-onLight",
  },
  anuncio: {
    background: "var(--color-card-beige)",
    isLight: true,
    badgeClass: "promo-badge-gold",
    badgeIcon: "fa-solid fa-bullhorn",
    icon: "fa-solid fa-bullhorn",
    iconWrapClass: "promo-icon-onLight",
  },
};

const TIPO_LABEL: Record<TipoCarrusel, string> = {
  promocion: "Promoción",
  evento: "Evento",
  anuncio: "Anuncio",
};

function formatearVigencia(fechaFin: string | null): string | null {
  if (!fechaFin) return null;
  const fecha = new Date(`${fechaFin}T00:00:00`);
  const formato = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long" }).format(fecha);
  return `Válido hasta el ${formato}`;
}

// El destino del CTA puede ser una ruta interna ("/contacto") o una URL
// externa (con o sin protocolo, ej. "www.google.com" o "https://...").
function normalizarCtaHref(href: string): string {
  if (href.startsWith("/") || href.startsWith("#")) return href;
  if (/^https?:\/\//i.test(href)) return href;
  return `https://${href}`;
}

export function PromoCarousel() {
  const [slides, setSlides] = useState<CarruselItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragState = useRef({ dragging: false, startX: 0, currentX: 0 });

  useEffect(() => {
    let activo = true;
    listarItemsPublicos()
      .then((items) => {
        if (activo) setSlides(items);
      })
      .catch(() => {
        if (activo) setSlides([]);
      });
    return () => {
      activo = false;
    };
  }, []);

  const total = slides?.length ?? 0;

  const goTo = useCallback(
    (i: number) => {
      if (total === 0) return;
      setIndex(((i % total) + total) % total);
    },
    [total]
  );

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
    if (isPaused || total <= 1) return;
    startProgress();
    autoplayTimer.current = setInterval(() => {
      setIndex((i) => (i + 1) % total);
      startProgress();
    }, AUTOPLAY_MS);
  }, [isPaused, total, startProgress, stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, total]);

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
    if (!dragState.current.dragging || !trackRef.current || total === 0) return;
    dragState.current.dragging = false;
    trackRef.current.style.transition = "";
    const delta = dragState.current.currentX - dragState.current.startX;
    const threshold = trackRef.current.clientWidth * 0.15;
    let targetIndex = index;
    if (delta > threshold) targetIndex = index - 1;
    else if (delta < -threshold) targetIndex = index + 1;
    const normalized = ((targetIndex % total) + total) % total;
    // Siempre re-aplica el transform, incluso si el índice no cambió (React
    // no re-renderiza en un setState con el mismo valor).
    trackRef.current.style.transform = `translateX(-${normalized * 100}%)`;
    goTo(targetIndex);
    startAutoplay();
  };

  // Todavía cargando, o no hay ítems activos/vigentes: no se muestra nada
  // (ni siquiera la sección contenedora).
  if (slides === null || slides.length === 0) return null;

  return (
    <section className="promo-section bg-gray" id="carrusel">
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
            {slides.map((slide, i) => {
              const preset = TIPO_PRESET[slide.tipo];
              return (
                <div
                  key={slide.id}
                  className={`promo-slide${preset.isLight ? " is-light" : ""}`}
                  style={{ background: preset.background }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} de ${slides.length}`}
                >
                  <div className="promo-content">
                    <span className={`promo-badge ${preset.badgeClass}`}>
                      <i className={preset.badgeIcon}></i> {TIPO_LABEL[slide.tipo]}
                    </span>
                    <h3>{slide.titulo}</h3>
                    {slide.descripcion && <p>{slide.descripcion}</p>}
                    {formatearVigencia(slide.fechaFin) && (
                      <div className="promo-meta">
                        <i className="fa-regular fa-calendar"></i> {formatearVigencia(slide.fechaFin)}
                      </div>
                    )}
                    {slide.ctaLabel && slide.ctaHref && (
                      <a
                        href={normalizarCtaHref(slide.ctaHref)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-cta"
                      >
                        {slide.ctaLabel}
                      </a>
                    )}
                  </div>
                  <div className="promo-visual">
                    <div className={`promo-icon-wrap ${preset.iconWrapClass}`}>
                      <i className={preset.icon}></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="promo-progress">
            <div className="promo-progress-bar" id="promoProgressBar" ref={progressBarRef}></div>
          </div>
        </div>

        {total > 1 && (
          <>
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
          </>
        )}
      </div>

      {total > 1 && (
        <div className="promo-dots" id="promoDots" role="tablist" aria-label="Seleccionar novedad">
          {slides.map((slide, i) => (
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
      )}
    </section>
  );
}
