'use client'

import Image from 'next/image'
import { Bot, GitBranch, User, X } from 'lucide-react'
import type { ContentPiece } from '@/lib/content-data'
import { PLATFORM_LABELS } from '@/lib/content-data'
import { PlatformIcon } from './platform-icon'

const AI_AUTHORS = ['flux-pro', 'gpt-4o', 'claude-sonnet', 'descript', 'capcut']

export function VersionPanel({
  piece,
  onClose,
}: {
  piece: ContentPiece
  onClose: () => void
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Cerrar panel"
        onClick={onClose}
        className="fixed inset-0 z-30 bg-background/60 backdrop-blur-[2px]"
      />
      <aside
        role="dialog"
        aria-label={`Historial de versiones de ${piece.title}`}
        className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-border bg-card"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {piece.id} · Historial de versiones
            </span>
            <h2 className="text-base font-bold leading-snug text-foreground text-pretty">
              {piece.title}
            </h2>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <PlatformIcon platform={piece.platform} className="size-3" />
              {PLATFORM_LABELS[piece.platform]} · {piece.program}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        {piece.thumbnail && (
          <div className="relative aspect-[16/9] w-full shrink-0 border-b border-border">
            <Image
              src={piece.thumbnail || '/placeholder.svg'}
              alt={`Versión actual de ${piece.title}`}
              fill
              sizes="448px"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {piece.customFields.length > 0 && (
            <dl className="mb-5 flex flex-col gap-1.5 rounded-md border border-border bg-secondary/40 p-3">
              {piece.customFields.map((f) => (
                <div
                  key={f.id}
                  className="flex items-baseline justify-between gap-3 font-mono text-[10px]"
                >
                  <dt className="shrink-0 uppercase tracking-wider text-muted-foreground/70">
                    {f.label}
                  </dt>
                  <dd className="text-right text-foreground/90">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <GitBranch className="size-3.5 text-primary" aria-hidden="true" />
            {piece.versions.length} versiones registradas
          </div>

          <p className="mb-5 rounded-md border border-dashed border-border bg-secondary/50 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            Los modelos no iteran sobre assets ya generados: cada nueva versión
            se guarda como entrada separada, nunca como edición in-place.
          </p>

          <ol className="relative flex flex-col gap-5 border-l border-border pl-5">
            {[...piece.versions].reverse().map((v, i) => {
              const isAI = AI_AUTHORS.includes(v.author)
              const isLatest = i === 0
              return (
                <li key={v.id} className="relative">
                  <span
                    className={`absolute -left-[26px] top-1 size-2.5 rounded-full border-2 ${
                      isLatest
                        ? 'border-primary bg-primary'
                        : 'border-border bg-card'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          isLatest ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {v.label}
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                      {isAI ? (
                        <Bot className="size-3" aria-hidden="true" />
                      ) : (
                        <User className="size-3 text-primary" aria-hidden="true" />
                      )}
                      {v.author} · {v.timestamp}
                    </span>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {v.note}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </aside>
    </>
  )
}
