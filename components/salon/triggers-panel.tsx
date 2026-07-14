'use client'

import { Zap } from 'lucide-react'
import type { Trigger } from '@/lib/content-data'

const KIND_LABELS: Record<Trigger['kind'], string> = {
  'platform-variant': 'Multiplataforma',
  'ab-variants': 'A/B testing',
  scheduled: 'Programado',
}

export function TriggersPanel({
  triggers,
  onToggle,
}: {
  triggers: Trigger[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-sm font-bold text-foreground">
          Disparadores automáticos
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          Reglas que generan contenido nuevo automáticamente cuando pasa algo
          en el tablero — así el equipo escala producción sin escalar trabajo
          manual en la misma proporción.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {triggers.map((t) => (
          <div
            key={t.id}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center"
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-md ${
                t.active
                  ? 'bg-primary/15 text-primary'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <Zap className="size-4" aria-hidden="true" />
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  {t.name}
                </span>
                <span className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  {KIND_LABELS[t.kind]}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
                {t.description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {t.runCount} ejecuciones
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={t.active}
                aria-label={`${t.active ? 'Desactivar' : 'Activar'} ${t.name}`}
                onClick={() => onToggle(t.id)}
                className={`relative flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
                  t.active
                    ? 'border-primary/60 bg-primary/25'
                    : 'border-border bg-secondary'
                }`}
              >
                <span
                  className={`size-4 rounded-full transition-transform ${
                    t.active
                      ? 'translate-x-[22px] bg-primary'
                      : 'translate-x-1 bg-muted-foreground'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
