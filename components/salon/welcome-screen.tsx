'use client'

import { ArrowRight, Hexagon, Sparkles } from 'lucide-react'

export function WelcomeScreen({
  onNormal,
  onTour,
}: {
  onNormal: () => void
  onTour: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Hexagon className="size-10 fill-primary text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Salón de Contenido
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            30X · media ops
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
            Un solo lugar para crear, revisar, aprobar y publicar el contenido
            de 30X — con humanos siempre al mando.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={onTour}
            className="group flex w-full items-center justify-between gap-3 rounded-lg bg-primary px-5 py-4 text-left transition-transform hover:scale-[1.02]"
          >
            <span className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2 text-sm font-bold text-primary-foreground">
                <Sparkles className="size-4" aria-hidden="true" />
                Pincha acá si eres de 30X
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary-foreground/70">
                Recorrido guiado · 6 pasos · 1 min
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-primary-foreground transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={onNormal}
            className="group flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card px-5 py-4 text-left transition-colors hover:border-muted-foreground/40"
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-foreground">
                Ver demo normal
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Entrar directo al dashboard
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
