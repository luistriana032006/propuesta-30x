'use client'

import { CheckCircle2, Loader2, Lock, Send } from 'lucide-react'
import type { ContentPiece, CustomField, Stage } from '@/lib/content-data'
import { ContentCard } from './content-card'

const STAGE_META: Record<
  Stage,
  { label: string; icon: React.ReactNode; accent: string }
> = {
  creacion: {
    label: 'En creación',
    icon: <Loader2 className="size-3.5 text-muted-foreground" aria-hidden="true" />,
    accent: 'bg-muted-foreground',
  },
  revision: {
    label: 'En revisión',
    icon: <Lock className="size-3.5 text-primary" aria-hidden="true" />,
    accent: 'bg-primary/50',
  },
  aprobado: {
    label: 'Aprobado',
    icon: <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />,
    accent: 'bg-primary',
  },
  publicado: {
    label: 'Publicado',
    icon: <Send className="size-3.5 text-muted-foreground" aria-hidden="true" />,
    accent: 'bg-muted-foreground/50',
  },
}

export function KanbanColumn({
  stage,
  pieces,
  onSelect,
  onTrigger,
  onAddField,
}: {
  stage: Stage
  pieces: ContentPiece[]
  onSelect: (piece: ContentPiece) => void
  onTrigger: (piece: ContentPiece) => void
  onAddField: (pieceId: string, field: Omit<CustomField, 'id'>) => void
}) {
  const meta = STAGE_META[stage]

  return (
    <section
      aria-label={meta.label}
      data-tour={stage === 'revision' ? 'candado' : undefined}
      className="flex w-[300px] shrink-0 flex-col gap-3 md:w-auto md:min-w-0 md:flex-1"
    >
      <header className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5">
        <span className={`size-1.5 rounded-full ${meta.accent}`} aria-hidden="true" />
        {meta.icon}
        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
          {meta.label}
        </h2>
        <span className="ml-auto rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {pieces.length}
        </span>
      </header>

      <div className="flex flex-col gap-3">
        {pieces.map((piece) => (
          <ContentCard
            key={piece.id}
            piece={piece}
            onSelect={onSelect}
            onTrigger={onTrigger}
            onAddField={onAddField}
          />
        ))}
        {pieces.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-6 text-center font-mono text-[11px] text-muted-foreground/60">
            Sin piezas en esta etapa
          </div>
        )}
      </div>
    </section>
  )
}
