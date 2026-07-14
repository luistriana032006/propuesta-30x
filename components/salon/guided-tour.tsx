'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, X } from 'lucide-react'

type TourStep = {
  target: string
  title: string
  text: string
}

const STEPS: TourStep[] = [
  {
    target: '[data-tour="board"]',
    title: 'El tablero',
    text: 'Cada pieza de contenido vive en una de estas 4 columnas: se crea, se revisa, se aprueba y se publica. Siempre sabes en qué punto está todo.',
  },
  {
    target: '[data-tour="candado"]',
    title: 'El candado',
    text: 'Nada pasa a "Aprobado" sin que una persona del equipo dé el visto bueno. La IA propone, un humano decide.',
  },
  {
    target: '[data-tour="add-field"]',
    title: 'Campos a tu medida',
    text: 'Con "+ Añadir campo" el equipo decide qué datos trackear en cada pieza: programa, mentor, formato, evento… lo que les importe.',
  },
  {
    target: '[data-tour="trigger"]',
    title: 'El disparador',
    text: 'Este botón lanza el siguiente paso del flujo. Solo se enciende cuando la pieza ya fue aprobada — antes, está bloqueado.',
  },
  {
    target: '[data-tour="filters"]',
    title: 'Filtros y nuevos flujos',
    text: 'Filtra por plataforma, programa o etapa para ver solo lo tuyo. Y con "+ Nuevo flujo" arrancas una pieza desde cero.',
  },
]

type Rect = { top: number; left: number; width: number; height: number }

const PAD = 8
const TOOLTIP_W = 340
const TOOLTIP_H = 170

export function GuidedTour({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const [closing, setClosing] = useState(false)

  const measure = useCallback(() => {
    const el = document.querySelector(STEPS[step].target)
    if (!el) {
      setRect(null)
      return
    }
    const r = el.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
  }, [step])

  useEffect(() => {
    if (closing) return
    const el = document.querySelector(STEPS[step].target)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    // measure after scroll settles
    const t1 = setTimeout(measure, 350)
    const t2 = setTimeout(measure, 700)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [step, closing, measure])

  const isLast = step === STEPS.length - 1

  function next() {
    if (isLast) {
      setClosing(true)
    } else {
      setRect(null)
      setStep((s) => s + 1)
    }
  }

  // Closing message (centered)
  if (closing) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        role="dialog"
        aria-label="Tutorial completado"
      >
        <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg border border-primary/40 bg-card p-8 text-center">
          <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-bold text-foreground text-balance">
            Listo. Así fluye el contenido en 30X.
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            La IA acelera, el equipo decide. Explora el tablero por tu cuenta.
          </p>
          <button
            type="button"
            onClick={onFinish}
            className="mt-2 flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Explorar el dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }

  const current = STEPS[step]

  // Tooltip position: below the target if it fits, otherwise above; clamped horizontally
  let tooltipStyle: React.CSSProperties = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
  if (rect) {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const below = rect.top + rect.height + PAD + TOOLTIP_H < vh
    const top = below
      ? rect.top + rect.height + PAD + 12
      : Math.max(12, rect.top - PAD - TOOLTIP_H - 12)
    const left = Math.min(
      Math.max(12, rect.left + rect.width / 2 - TOOLTIP_W / 2),
      vw - TOOLTIP_W - 12,
    )
    tooltipStyle = { top, left, transform: 'none' }
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="Recorrido guiado">
      {/* Spotlight: transparent window + giant shadow that dims everything else */}
      {rect ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-lg border-2 border-primary transition-all duration-500 ease-out"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgba(10, 10, 10, 0.82)',
          }}
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-background/80" />
      )}

      {/* Tooltip */}
      <div
        className="absolute flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-2xl transition-all duration-500 ease-out"
        style={{ ...tooltipStyle, width: TOOLTIP_W, maxWidth: 'calc(100vw - 24px)' }}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
            Paso {step + 1} / {STEPS.length}
          </span>
          <div className="flex items-center gap-1" aria-hidden="true">
            {STEPS.map((s, i) => (
              <span
                key={s.target}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? 'w-4 bg-primary' : 'w-1.5 bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-bold text-foreground">{current.title}</h2>
          <p className="text-[13px] leading-relaxed text-muted-foreground text-pretty">
            {current.text}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={onFinish}
            className="flex items-center gap-1 rounded px-1 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3" aria-hidden="true" />
            Saltar tutorial
          </button>
          <button
            type="button"
            onClick={next}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {isLast ? 'Terminar' : 'Siguiente'}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
