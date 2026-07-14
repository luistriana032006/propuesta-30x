'use client'

import { useMemo, useState } from 'react'
import type {
  ContentPiece,
  CustomField,
  Platform,
  Program,
  Stage,
} from '@/lib/content-data'
import { CONTENT_PIECES, STAGES } from '@/lib/content-data'
import { GuidedTour } from '@/components/salon/guided-tour'
import { KanbanColumn } from '@/components/salon/kanban-column'
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
                    metrics: p.metrics ?? { impressions: 0, engagement: 0 },
                  }
                : {}),
            }
          : p,
      ),
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
            />
          ))}
        </div>
      </main>

      {selected && (
        <VersionPanel piece={selected} onClose={() => setSelectedId(null)} />
      )}

      {tourActive && <GuidedTour onFinish={() => setTourActive(false)} />}
    </div>
  )
}
