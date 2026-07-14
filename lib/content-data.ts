export type Stage = 'creacion' | 'revision' | 'aprobado' | 'publicado'
export type Platform = 'instagram' | 'linkedin'
export type AssetType = 'imagen' | 'video' | 'copy' | 'carrusel'
export type Program = 'Sales' | 'Growth' | 'AI' | 'VC' | 'Inmersión'

export interface Version {
  id: string
  label: string
  timestamp: string
  author: string
  note: string
}

export interface CustomField {
  id: string
  label: string
  value: string
}

export interface ContentPiece {
  id: string
  title: string
  stage: Stage
  platform: Platform
  assetType: AssetType
  program: Program
  thumbnail?: string
  copyPreview: string
  generatedBy: string
  approver: string
  createdAt: string
  publishedAt?: string
  metrics?: {
    impressions: number
    engagement: number
  }
  customFields: CustomField[]
  versions: Version[]
}

export const STAGES: { id: Stage; label: string }[] = [
  { id: 'creacion', label: 'En creación' },
  { id: 'revision', label: 'En revisión' },
  { id: 'aprobado', label: 'Aprobado' },
  { id: 'publicado', label: 'Publicado' },
]

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
}

export const PROGRAMS: Program[] = ['Sales', 'Growth', 'AI', 'VC', 'Inmersión']

export const APPROVERS = ['Valentina M.', 'Ricardo T.'] as const

export function nextPieceId(pieces: ContentPiece[]): string {
  const max = pieces.reduce((m, p) => {
    const n = Number(p.id.replace('PZ-', ''))
    return Number.isFinite(n) ? Math.max(m, n) : m
  }, 0)
  return `PZ-${String(max + 1).padStart(4, '0')}`
}

export const SUGGESTED_FIELDS = [
  'Mentor / founder',
  'Tipo de formato',
  'Evento asociado',
  'CTA usado',
  'Cohorte',
] as const

export const CONTENT_PIECES: ContentPiece[] = [
  {
    id: 'PZ-0151',
    title: 'Talking head Dylan Rosemberg — hook Growth',
    stage: 'creacion',
    platform: 'instagram',
    assetType: 'video',
    program: 'Growth',
    thumbnail: '/assets/mentor-talking-head.png',
    copyPreview:
      'Dylan explica en 40 segundos por qué el growth loops le gana al funnel tradicional. Hook: "Tu funnel está muerto".',
    generatedBy: 'gpt-4o + descript',
    approver: 'Valentina M.',
    createdAt: '2026-07-14T09:12:00',
    customFields: [
      { id: 'f1', label: 'Mentor / founder', value: 'Dylan Rosemberg' },
      { id: 'f2', label: 'Tipo de formato', value: 'Talking head' },
      { id: 'f3', label: 'CTA usado', value: 'Link en bio → cohorte Growth' },
    ],
    versions: [
      {
        id: 'v1',
        label: 'v1 — corte inicial',
        timestamp: '2026-07-14 09:12',
        author: 'descript',
        note: 'Corte de 40s desde la masterclass de Dylan. Subtítulos autogenerados.',
      },
      {
        id: 'v2',
        label: 'v2 — nuevo hook',
        timestamp: '2026-07-14 10:05',
        author: 'gpt-4o',
        note: 'El hook original era débil; se regeneró el copy de apertura completo.',
      },
    ],
  },
  {
    id: 'PZ-0152',
    title: 'Carrusel — 5 aprendizajes Inmersión CDMX',
    stage: 'creacion',
    platform: 'linkedin',
    assetType: 'carrusel',
    program: 'Inmersión',
    thumbnail: '/assets/inmersion-cdmx.png',
    copyPreview:
      '5 cosas que 40 ejecutivos se llevaron de la Inmersión CDMX. La #4 nadie la esperaba.',
    generatedBy: 'claude-sonnet + flux-pro',
    approver: 'Ricardo T.',
    createdAt: '2026-07-14T10:03:00',
    customFields: [
      { id: 'f1', label: 'Evento asociado', value: 'Inmersión CDMX · 12 jul' },
      { id: 'f2', label: 'Tipo de formato', value: 'Recap' },
    ],
    versions: [
      {
        id: 'v1',
        label: 'v1 — estructura + portada',
        timestamp: '2026-07-14 10:03',
        author: 'flux-pro',
        note: 'Portada con foto del rooftop. Faltan slides 3-5 por redactar.',
      },
    ],
  },
  {
    id: 'PZ-0148',
    title: 'Testimonio Lucas Rojas — Inmersión CDMX',
    stage: 'revision',
    platform: 'instagram',
    assetType: 'video',
    program: 'Inmersión',
    thumbnail: '/assets/testimonio-lucas.png',
    copyPreview:
      '"Llegué buscando frameworks y me llevé una red de 40 operadores que hoy son mi board informal." — Lucas Rojas, CRO.',
    generatedBy: 'descript + gpt-4o',
    approver: 'Valentina M.',
    createdAt: '2026-07-13T16:40:00',
    customFields: [
      { id: 'f1', label: 'Mentor / founder', value: 'Lucas Rojas (alumno)' },
      { id: 'f2', label: 'Tipo de formato', value: 'Testimonio' },
      { id: 'f3', label: 'Evento asociado', value: 'Inmersión CDMX · 12 jul' },
      { id: 'f4', label: 'CTA usado', value: 'Aplica a la próxima inmersión' },
    ],
    versions: [
      {
        id: 'v1',
        label: 'v1 — corte de 60s',
        timestamp: '2026-07-13 16:40',
        author: 'descript',
        note: 'Corte desde la entrevista completa de 8 minutos.',
      },
      {
        id: 'v2',
        label: 'v2 — recorte a 35s',
        timestamp: '2026-07-13 17:15',
        author: 'descript',
        note: 'Se recortó al soundbite más fuerte. No se editó v1: nuevo render.',
      },
      {
        id: 'v3',
        label: 'v3 — copy del caption',
        timestamp: '2026-07-14 08:30',
        author: 'gpt-4o',
        note: 'Caption con quote textual. Pendiente visto bueno de Valentina.',
      },
    ],
  },
  {
    id: 'PZ-0149',
    title: 'Post LinkedIn — por qué cohortes y no cursos',
    stage: 'revision',
    platform: 'linkedin',
    assetType: 'copy',
    program: 'Sales',
    copyPreview:
      'Los cursos grabados tienen 3% de finalización. Nuestras cohortes, 91%. Esto es lo que cambia cuando aprendes con tu par ejecutivo.',
    generatedBy: 'claude-sonnet',
    approver: 'Ricardo T.',
    createdAt: '2026-07-13T11:20:00',
    customFields: [
      { id: 'f1', label: 'Cohorte', value: 'Sales Leaders · ago 2026' },
      { id: 'f2', label: 'CTA usado', value: 'Agenda una llamada' },
    ],
    versions: [
      {
        id: 'v1',
        label: 'v1 — borrador largo',
        timestamp: '2026-07-13 11:20',
        author: 'claude-sonnet',
        note: '8 párrafos, demasiado institucional. Marcado para reescritura.',
      },
      {
        id: 'v2',
        label: 'v2 — reescritura con datos',
        timestamp: '2026-07-13 14:02',
        author: 'claude-sonnet',
        note: 'Abre con el dato de finalización. En espera de aprobación.',
      },
    ],
  },
  {
    id: 'PZ-0145',
    title: 'Anuncio cohorte AI Builders — ago 2026',
    stage: 'aprobado',
    platform: 'instagram',
    assetType: 'imagen',
    program: 'AI',
    thumbnail: '/assets/cohorte-ai.png',
    copyPreview:
      'AI Builders, cohorte agosto: 6 semanas construyendo con IA junto a operadores que ya lo hacen en producción. 25 cupos.',
    generatedBy: 'flux-pro + gpt-4o',
    approver: 'Valentina M.',
    createdAt: '2026-07-12T09:55:00',
    customFields: [
      { id: 'f1', label: 'Cohorte', value: 'AI Builders · ago 2026' },
      { id: 'f2', label: 'Tipo de formato', value: 'Anuncio de cohorte' },
      { id: 'f3', label: 'CTA usado', value: 'Aplica ahora · 25 cupos' },
    ],
    versions: [
      {
        id: 'v1',
        label: 'v1 — key visual',
        timestamp: '2026-07-12 09:55',
        author: 'flux-pro',
        note: 'Gráfica con acento lima sobre negro, sin texto embebido.',
      },
      {
        id: 'v2',
        label: 'v2 — aprobado por Valentina M.',
        timestamp: '2026-07-13 10:18',
        author: 'Valentina M.',
        note: 'Visto bueno humano. Listo para programar publicación.',
      },
    ],
  },
  {
    id: 'PZ-0146',
    title: 'Clip Andrés Bilbao — errores de fundraising',
    stage: 'aprobado',
    platform: 'linkedin',
    assetType: 'video',
    program: 'VC',
    thumbnail: '/assets/workshop-sales.png',
    copyPreview:
      'Andrés Bilbao: "El error #1 al levantar capital en LatAm no es la valuación, es a quién le pides". Clip de la sesión de VC.',
    generatedBy: 'descript + gpt-4o',
    approver: 'Ricardo T.',
    createdAt: '2026-07-12T15:30:00',
    customFields: [
      { id: 'f1', label: 'Mentor / founder', value: 'Andrés Bilbao' },
      { id: 'f2', label: 'Tipo de formato', value: 'Talking head' },
      { id: 'f3', label: 'Cohorte', value: 'Venture Capital · jul 2026' },
    ],
    versions: [
      {
        id: 'v1',
        label: 'v1 — tres cortes candidatos',
        timestamp: '2026-07-12 15:30',
        author: 'descript',
        note: 'Se generaron 3 clips; se eligió el del minuto 24 de la sesión.',
      },
      {
        id: 'v2',
        label: 'v2 — aprobado por Ricardo T.',
        timestamp: '2026-07-13 09:05',
        author: 'Ricardo T.',
        note: 'Aprobado sin cambios. Andrés confirmó uso de su imagen.',
      },
    ],
  },
  {
    id: 'PZ-0141',
    title: 'Recap Inmersión Ejecutiva Bogotá — 19 ago',
    stage: 'publicado',
    platform: 'instagram',
    assetType: 'video',
    program: 'Inmersión',
    thumbnail: '/assets/recap-bogota.png',
    copyPreview:
      '36 horas, 45 ejecutivos, 6 mentores. Así se vivió la Inmersión Ejecutiva Bogotá. La próxima es en Caracas.',
    generatedBy: 'gpt-4o + capcut',
    approver: 'Valentina M.',
    createdAt: '2026-07-08T08:00:00',
    publishedAt: '2026-07-10T18:00:00',
    metrics: { impressions: 38400, engagement: 8.2 },
    customFields: [
      { id: 'f1', label: 'Evento asociado', value: 'Inmersión Bogotá · 19 ago' },
      { id: 'f2', label: 'Tipo de formato', value: 'Recap' },
      { id: 'f3', label: 'CTA usado', value: 'Próxima parada: Caracas' },
    ],
    versions: [
      {
        id: 'v1',
        label: 'v1 — recap de 45s',
        timestamp: '2026-07-08 08:00',
        author: 'capcut',
        note: 'Montaje con material del equipo de video en sitio.',
      },
      {
        id: 'v2',
        label: 'v2 — aprobado y publicado',
        timestamp: '2026-07-10 18:00',
        author: 'Valentina M.',
        note: 'Publicado a las 18:00. Etiquetados los 6 mentores.',
      },
    ],
  },
  {
    id: 'PZ-0139',
    title: 'Caso alumno — de gerente a VP en 8 meses',
    stage: 'publicado',
    platform: 'linkedin',
    assetType: 'copy',
    program: 'Growth',
    copyPreview:
      'Hace 8 meses era gerente de marketing. Hoy es VP de Growth en una scaleup regional. Esta es la historia de una alumna de la cohorte 4.',
    generatedBy: 'claude-sonnet',
    approver: 'Ricardo T.',
    createdAt: '2026-07-06T09:15:00',
    publishedAt: '2026-07-09T09:00:00',
    metrics: { impressions: 21600, engagement: 6.1 },
    customFields: [
      { id: 'f1', label: 'Cohorte', value: 'Growth · cohorte 4' },
      { id: 'f2', label: 'Tipo de formato', value: 'Testimonio' },
    ],
    versions: [
      {
        id: 'v1',
        label: 'v1 — borrador',
        timestamp: '2026-07-06 09:15',
        author: 'claude-sonnet',
        note: 'Estructura antes → proceso → después, con permiso de la alumna.',
      },
      {
        id: 'v2',
        label: 'v2 — aprobado y publicado',
        timestamp: '2026-07-09 09:00',
        author: 'Ricardo T.',
        note: 'Publicado martes 9:00, mejor franja para LinkedIn.',
      },
    ],
  },
  {
    id: 'PZ-0137',
    title: 'Anuncio Inmersión Caracas — save the date',
    stage: 'publicado',
    platform: 'instagram',
    assetType: 'imagen',
    program: 'Inmersión',
    thumbnail: '/assets/inmersion-cdmx.png',
    copyPreview:
      'Caracas: 26 de septiembre. La Inmersión Ejecutiva llega a Venezuela por primera vez. Lista de espera abierta.',
    generatedBy: 'flux-pro + gpt-4o',
    approver: 'Valentina M.',
    createdAt: '2026-07-05T12:00:00',
    publishedAt: '2026-07-07T12:30:00',
    metrics: { impressions: 52700, engagement: 9.4 },
    customFields: [
      { id: 'f1', label: 'Evento asociado', value: 'Inmersión Caracas · 26 sep' },
      { id: 'f2', label: 'Tipo de formato', value: 'Anuncio de evento' },
      { id: 'f3', label: 'CTA usado', value: 'Únete a la lista de espera' },
    ],
    versions: [
      {
        id: 'v1',
        label: 'v1 — key visual',
        timestamp: '2026-07-05 12:00',
        author: 'flux-pro',
        note: 'Visual nocturno de evento premium. Tipografía la pone diseño.',
      },
      {
        id: 'v2',
        label: 'v2 — corrección de fecha',
        timestamp: '2026-07-06 10:44',
        author: 'Valentina M.',
        note: 'Fecha corregida a 26 sep tras confirmar el venue.',
      },
      {
        id: 'v3',
        label: 'v3 — publicado',
        timestamp: '2026-07-07 12:30',
        author: 'Valentina M.',
        note: 'Publicado. Mejor alcance del mes hasta ahora.',
      },
    ],
  },
]
