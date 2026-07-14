'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  BarChart2,
  Bot,
  Check,
  FileText,
  Loader2,
  Lock,
  Pencil,
  Plus,
  UserCheck,
  X,
} from 'lucide-react'
import type { ContentPiece, CustomField } from '@/lib/content-data'
import { PLATFORM_LABELS, SUGGESTED_FIELDS } from '@/lib/content-data'
import { META_API_LABEL } from '@/lib/mock-ai'
import { PlatformIcon } from './platform-icon'

const ASSET_LABELS: Record<ContentPiece['assetType'], string> = {
  imagen: 'IMG',
  video: 'VID',
  copy: 'TXT',
  carrusel: 'CAR',
}

const TRIGGER_LABELS: Record<ContentPiece['stage'], string> = {
  creacion: 'Enviar a revisión',
  revision: 'Requiere aprobación',
  aprobado: 'Publicar ahora',
  publicado: 'Publicado',
}

function formatNumber(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
}

function AddFieldForm({
  existingLabels,
  onAdd,
  onCancel,
}: {
  existingLabels: string[]
  onAdd: (field: Omit<CustomField, 'id'>) => void
  onCancel: () => void
}) {
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')

  const suggestions = SUGGESTED_FIELDS.filter(
    (s) => !existingLabels.includes(s),
  )

  function submit() {
    if (!label.trim() || !value.trim()) return
    onAdd({ label: label.trim(), value: value.trim() })
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-primary/40 bg-secondary/60 p-2.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
          Nuevo campo
        </span>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancelar nuevo campo"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setLabel(s)}
              className={`rounded border px-1.5 py-0.5 font-mono text-[9px] transition-colors ${
                label === s
                  ? 'border-primary text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Nombre del campo"
        aria-label="Nombre del campo"
        className="rounded border border-border bg-background px-2 py-1.5 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (
            e.key === 'Enter' &&
            !e.nativeEvent.isComposing &&
            e.keyCode !== 229
          )
            submit()
        }}
        placeholder="Valor"
        aria-label="Valor del campo"
        className="rounded border border-border bg-background px-2 py-1.5 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
      />
      <button
        type="button"
        onClick={submit}
        disabled={!label.trim() || !value.trim()}
        className="flex items-center justify-center gap-1.5 rounded bg-primary px-2 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Check className="size-3" aria-hidden="true" />
        Guardar campo
      </button>
    </div>
  )
}

export function ContentCard({
  piece,
  onSelect,
  onTrigger,
  onAddField,
  onEditCopy,
}: {
  piece: ContentPiece
  onSelect: (piece: ContentPiece) => void
  onTrigger: (piece: ContentPiece) => void
  onAddField: (pieceId: string, field: Omit<CustomField, 'id'>) => void
  onEditCopy: (pieceId: string, copy: string) => void
}) {
  const [addingField, setAddingField] = useState(false)
  const [editingCopy, setEditingCopy] = useState(false)
  const [copyDraft, setCopyDraft] = useState(piece.copyPreview)
  const [publishing, setPublishing] = useState(false)
  const isLocked = piece.stage === 'revision'
  const isDone = piece.stage === 'publicado'
  const triggerEnabled = piece.stage === 'creacion' || piece.stage === 'aprobado'

  function handleTriggerClick() {
    if (piece.stage === 'aprobado') {
      setPublishing(true)
      setTimeout(
        () => {
          onTrigger(piece)
        },
        1200 + Math.random() * 700,
      )
    } else {
      onTrigger(piece)
    }
  }

  function saveCopy() {
    if (!copyDraft.trim()) return
    onEditCopy(piece.id, copyDraft.trim())
    setEditingCopy(false)
  }

  return (
    <article
      className={`group rounded-lg border bg-card transition-colors hover:border-muted-foreground/40 ${
        isLocked ? 'border-dashed border-border' : 'border-border'
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(piece)}
        className="block w-full text-left"
        aria-label={`Ver historial de ${piece.title}`}
      >
        {piece.thumbnail ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg border-b border-border">
            <Image
              src={piece.thumbnail || '/placeholder.svg'}
              alt={`Preview de ${piece.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className={`object-cover ${isLocked ? 'opacity-60 grayscale-[30%]' : ''}`}
            />
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                <span className="flex items-center gap-1.5 rounded border border-border bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Lock className="size-3 text-primary" aria-hidden="true" />
                  Bloqueado
                </span>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex aspect-[16/9] w-full items-start justify-between gap-3 rounded-t-lg border-b border-border bg-secondary p-4 ${
              isLocked ? 'opacity-70' : ''
            }`}
          >
            <p className="line-clamp-4 font-mono text-xs leading-relaxed text-muted-foreground">
              {piece.copyPreview}
            </p>
            {isLocked ? (
              <Lock className="size-4 shrink-0 text-primary" aria-hidden="true" />
            ) : (
              <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {piece.id} · {ASSET_LABELS[piece.assetType]} · {piece.program}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <PlatformIcon platform={piece.platform} className="size-3" />
              {PLATFORM_LABELS[piece.platform]}
            </span>
          </div>

          <h3 className="text-sm font-bold leading-snug text-foreground text-pretty">
            {piece.title}
          </h3>

          {piece.thumbnail && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {piece.copyPreview}
            </p>
          )}

          <div className="flex flex-col gap-1.5 border-t border-border pt-2.5">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
              <Bot className="size-3" aria-hidden="true" />
              {piece.generatedBy}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
              <UserCheck className="size-3 text-primary" aria-hidden="true" />
              Aprueba: {piece.approver}
            </span>
          </div>

          {isDone && piece.metrics && (
            <div className="flex items-center gap-3 border-t border-border pt-2.5 font-mono text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <BarChart2 className="size-3" aria-hidden="true" />
                {formatNumber(piece.metrics.impressions)} imp
              </span>
              <span>{piece.metrics.engagement}% eng</span>
              {piece.publishedAt && (
                <span className="ml-auto">
                  {new Date(piece.publishedAt).toLocaleDateString('es-MX', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
              )}
            </div>
          )}
        </div>
      </button>

      <div className="flex flex-col gap-1.5 border-t border-border px-3.5 py-2.5">
        {piece.customFields.map((f) => (
          <div
            key={f.id}
            className="flex items-baseline justify-between gap-2 font-mono text-[10px]"
          >
            <span className="shrink-0 uppercase tracking-wider text-muted-foreground/70">
              {f.label}
            </span>
            <span className="truncate text-right text-foreground/90">
              {f.value}
            </span>
          </div>
        ))}

        {addingField ? (
          <div className="mt-1">
            <AddFieldForm
              existingLabels={piece.customFields.map((f) => f.label)}
              onAdd={(field) => {
                onAddField(piece.id, field)
                setAddingField(false)
              }}
              onCancel={() => setAddingField(false)}
            />
          </div>
        ) : (
          <button
            type="button"
            data-tour="add-field"
            onClick={() => setAddingField(true)}
            className="mt-0.5 flex items-center gap-1.5 self-start rounded px-1 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
          >
            <Plus className="size-3" aria-hidden="true" />
            Añadir campo
          </button>
        )}
      </div>

      {piece.stage === 'creacion' && (
        <div className="border-t border-border px-3.5 py-2.5">
          {editingCopy ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={copyDraft}
                onChange={(e) => setCopyDraft(e.target.value)}
                rows={3}
                aria-label="Editar copy generado"
                className="resize-none rounded border border-primary/40 bg-background px-2 py-1.5 font-mono text-[11px] leading-relaxed text-foreground focus:border-primary focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveCopy}
                  disabled={!copyDraft.trim()}
                  className="flex items-center gap-1 rounded bg-primary px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check className="size-3" aria-hidden="true" />
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCopyDraft(piece.copyPreview)
                    setEditingCopy(false)
                  }}
                  className="flex items-center gap-1 rounded border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCopyDraft(piece.copyPreview)
                setEditingCopy(true)
              }}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
            >
              <Pencil className="size-3" aria-hidden="true" />
              Editar copy
            </button>
          )}
        </div>
      )}

      {!isDone && (
        <div className="px-3.5 pb-3.5 pt-1">
          {publishing ? (
            <div className="flex flex-col items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-2.5">
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-primary">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                Publicando…
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                Simulación — {META_API_LABEL}
              </span>
            </div>
          ) : (
          <button
            type="button"
            data-tour={
              piece.stage === 'aprobado' ? 'trigger' : undefined
            }
            disabled={!triggerEnabled}
            onClick={handleTriggerClick}
            className={`flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors ${
              triggerEnabled
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'cursor-not-allowed border border-dashed border-border bg-transparent text-muted-foreground/60'
            }`}
          >
            {triggerEnabled ? (
              <>
                {TRIGGER_LABELS[piece.stage]}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </>
            ) : (
              <>
                <Lock className="size-3.5" aria-hidden="true" />
                {TRIGGER_LABELS[piece.stage]}
              </>
            )}
          </button>
          )}
        </div>
      )}
    </article>
  )
}
