'use client'

import { useMemo, useState } from 'react'
import type {
  ContentPiece,
  CustomField,
  Platform,
  Program,
  Stage,
} from '@/lib/content-data'
import { APPROVERS, CONTENT_PIECES, STAGES, nextPieceId } from '@/lib/content-data'
import { AI_MODEL_LABEL, generateMockMetrics } from '@/lib/mock-ai'
import { GuidedTour } from '@/components/salon/guided-tour'
import { KanbanColumn } from '@/components/salon/kanban-column'
import { NewFlowModal } from '@/components/salon/new-flow-modal'
import { TopBar } from '@/components/salon/top-bar'
import { VersionPanel } from '@/components/salon/version-panel'
import { WelcomeScreen } from '@/components/salon/welcome-screen'

const NEXT_STAGE: Partial<Record<Stage, Stage>> = {
  creacion: 'revision',
  aprobado: 'publicado',
}

export default function SalonDeContenido() {
  const [screen, setScreen] = useState<'welcome' | 'dashboard'>('welcome')
  const [tourActive, setTourActive] = useState(false)
  const [pieces, setPieces] = useState<ContentPiece[]>(CONTENT_PIECES)
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null)
  const [programFilter, setProgramFilter] = useState<Program | null>(null)
  const [stageFilter, setStageFilter] = useState<Stage | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newFlowOpen, setNewFlowOpen] = useState(false)

  const filtered = useMemo(
    () =>
      pieces.filter(
        (p) =>
          (platformFilter === null || p.platform === platformFilter) &&
          (programFilter === null || p.program === programFilter),
      ),
    [pieces, platformFilter, programFilter],
  )

  const counts = useMemo(() => {
    const c: Record<Stage, number> = {
      creacion: 0,
      revision: 0,
      aprobado: 0,
      publicado: 0,
    }
    for (const p of filtered) c[p.stage]++
    return c
  }, [filtered])

  const visibleStages = stageFilter
    ? STAGES.filter((s) => s.id === stageFilter)
    : STAGES

  const selected = selectedId
    ? (pieces.find((p) => p.id === selectedId) ?? null)
    : null

  function handleTrigger(piece: ContentPiece) {
    const next = NEXT_STAGE[piece.stage]
    if (!next) return
    setPieces((prev) =>
      prev.map((p) =>
        p.id === piece.id
          ? {
              ...p,
              stage: next,
              ...(next === 'publicado'
                ? {
                    publishedAt: new Date().toISOString(),
                    metrics: p.metrics ?? generateMockMetrics(),
                  }
                : {}),
            }
          : p,
      ),
    )
  }

  function handleCreateFlow(input: {
    brief: string
    platform: Platform
    program: Program
    copy: string
  }) {
    const id = nextPieceId(pieces)
    const now = new Date()
    const approver = APPROVERS[Math.floor(Math.random() * APPROVERS.length)]
    const title =
      input.brief.length > 64 ? `${input.brief.slice(0, 61)}...` : input.brief

    const newPiece: ContentPiece = {
      id,
      title,
      stage: 'creacion',
      platform: input.platform,
      assetType: 'copy',
      program: input.program,
      copyPreview: input.copy,
      generatedBy: AI_MODEL_LABEL,
      approver,
      createdAt: now.toISOString(),
      customFields: [
        { id: `f${Date.now()}`, label: 'Brief', value: input.brief },
      ],
      versions: [
        {
          id: 'v1',
          label: 'v1 — generado por IA',
          timestamp: now.toLocaleString('es-MX', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }),
          author: AI_MODEL_LABEL,
          note: 'Copy generado automáticamente a partir del brief. Pendiente de edición y revisión humana.',
        },
      ],
    }

    setPieces((prev) => [newPiece, ...prev])
    setNewFlowOpen(false)
  }

  function handleEditCopy(pieceId: string, copy: string) {
    setPieces((prev) =>
      prev.map((p) => (p.id === pieceId ? { ...p, copyPreview: copy } : p)),
    )
  }

  function handleAddField(pieceId: string, field: Omit<CustomField, 'id'>) {
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId
          ? {
              ...p,
              customFields: [
                ...p.customFields,
                { ...field, id: `f${Date.now()}` },
              ],
            }
          : p,
      ),
    )
  }

  if (screen === 'welcome') {
    return (
      <WelcomeScreen
        onNormal={() => setScreen('dashboard')}
        onTour={() => {
          setScreen('dashboard')
          setTourActive(true)
        }}
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar
        platformFilter={platformFilter}
        programFilter={programFilter}
        stageFilter={stageFilter}
        counts={counts}
        onPlatformFilter={setPlatformFilter}
        onProgramFilter={setProgramFilter}
        onStageFilter={setStageFilter}
        onNewFlow={() => setNewFlowOpen(true)}
      />

      <main className="flex-1 p-4 md:p-6">
        <div
          data-tour="board"
          className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:overflow-visible lg:flex lg:overflow-visible"
        >
          {visibleStages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage.id}
              pieces={filtered.filter((p) => p.stage === stage.id)}
              onSelect={(p) => setSelectedId(p.id)}
              onTrigger={handleTrigger}
              onAddField={handleAddField}
              onEditCopy={handleEditCopy}
            />
          ))}
        </div>
      </main>

      {selected && (
        <VersionPanel piece={selected} onClose={() => setSelectedId(null)} />
      )}

      {newFlowOpen && (
        <NewFlowModal
          onClose={() => setNewFlowOpen(false)}
          onCreate={handleCreateFlow}
        />
      )}

      {tourActive && <GuidedTour onFinish={() => setTourActive(false)} />}
    </div>
  )
}
