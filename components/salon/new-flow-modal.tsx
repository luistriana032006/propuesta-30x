'use client'

import { useState } from 'react'
import { Loader2, Sparkles, X } from 'lucide-react'
import type { Platform, Program } from '@/lib/content-data'
import { PLATFORM_LABELS, PROGRAMS } from '@/lib/content-data'
import { AI_MODEL_LABEL, generateMockCopy } from '@/lib/mock-ai'

const PLATFORMS: Platform[] = ['instagram', 'linkedin']

export function NewFlowModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (input: {
    brief: string
    platform: Platform
    program: Program
    copy: string
  }) => void
}) {
  const [brief, setBrief] = useState('')
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [program, setProgram] = useState<Program>(PROGRAMS[0])
  const [generating, setGenerating] = useState(false)

  function submit() {
    if (!brief.trim() || generating) return
    setGenerating(true)
    setTimeout(
      () => {
        const copy = generateMockCopy(brief, platform, program)
        onCreate({ brief: brief.trim(), platform, program, copy })
      },
      1200 + Math.random() * 700,
    )
  }

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={generating ? undefined : onClose}
        className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-label="Nuevo flujo de contenido"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-5 shadow-2xl"
      >
        {generating ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <Loader2
              className="size-8 animate-spin text-primary"
              aria-hidden="true"
            />
            <p className="text-sm font-bold text-foreground">
              Generando copy con IA…
            </p>
            <span className="rounded border border-border bg-secondary/60 px-2 py-1 font-mono text-[10px] text-muted-foreground">
              Llamando a Anthropic API — {AI_MODEL_LABEL}
            </span>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-bold text-foreground">
                  Nuevo flujo
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="brief"
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  Brief
                </label>
                <textarea
                  id="brief"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={3}
                  placeholder="Ej: anuncio de la nueva cohorte de Sales, tono directo, con CTA a aplicar"
                  className="resize-none rounded border border-border bg-background px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Plataforma
                </span>
                <div className="flex gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      aria-pressed={platform === p}
                      className={`flex-1 rounded border px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                        platform === p
                          ? 'border-primary text-primary'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {PLATFORM_LABELS[p]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="program"
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  Programa / cohorte
                </label>
                <select
                  id="program"
                  value={program}
                  onChange={(e) => setProgram(e.target.value as Program)}
                  className="rounded border border-border bg-background px-2.5 py-2 font-mono text-[11px] text-foreground focus:border-primary focus:outline-none"
                >
                  {PROGRAMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={!brief.trim()}
                className="mt-1 flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles className="size-3.5" aria-hidden="true" />
                Generar con IA
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
