'use client'

import { Hexagon, Plus } from 'lucide-react'
import type { Platform, Program, Stage } from '@/lib/content-data'
import { PLATFORM_LABELS, PROGRAMS, STAGES } from '@/lib/content-data'
import { PlatformIcon } from './platform-icon'

const PLATFORMS: Platform[] = ['instagram', 'linkedin']

export function TopBar({
  platformFilter,
  programFilter,
  stageFilter,
  counts,
  onPlatformFilter,
  onProgramFilter,
  onStageFilter,
}: {
  platformFilter: Platform | null
  programFilter: Program | null
  stageFilter: Stage | null
  counts: Record<Stage, number>
  onPlatformFilter: (p: Platform | null) => void
  onProgramFilter: (p: Program | null) => void
  onStageFilter: (s: Stage | null) => void
}) {
  return (
    <header
      data-tour="filters"
      className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur"
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2.5">
          <Hexagon className="size-5 fill-primary text-primary" aria-hidden="true" />
          <div className="flex flex-col">
            <h1 className="text-sm font-bold leading-none tracking-tight text-foreground">
              Salón de Contenido
            </h1>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              30X · media ops
            </span>
          </div>
        </div>

        <nav aria-label="Filtrar por plataforma" className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPlatformFilter(null)}
            className={`rounded px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
              platformFilter === null
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Todas
          </button>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPlatformFilter(platformFilter === p ? null : p)}
              aria-pressed={platformFilter === p}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                platformFilter === p
                  ? 'bg-secondary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <PlatformIcon platform={p} className="size-3" />
              {PLATFORM_LABELS[p]}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <label
            htmlFor="program-filter"
            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            Programa
          </label>
          <select
            id="program-filter"
            value={programFilter ?? ''}
            onChange={(e) =>
              onProgramFilter(
                e.target.value === '' ? null : (e.target.value as Program),
              )
            }
            className="rounded border border-border bg-secondary px-2 py-1.5 font-mono text-[11px] text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Todos</option>
            {PROGRAMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <nav
          aria-label="Contador por etapa"
          className="flex items-center gap-1 md:ml-auto"
        >
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onStageFilter(stageFilter === s.id ? null : s.id)}
              aria-pressed={stageFilter === s.id}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                stageFilter === s.id
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.label}
              <span
                className={`rounded px-1 py-0.5 text-[10px] leading-none ${
                  s.id === 'aprobado'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {counts[s.id]}
              </span>
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Nuevo flujo
        </button>
      </div>
    </header>
  )
}
