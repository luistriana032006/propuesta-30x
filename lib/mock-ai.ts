import type { Platform, Program } from './content-data'

export const AI_MODEL_LABEL = 'claude-sonnet-4-6'
export const META_API_LABEL = 'Meta Graph API (no conectada)'

const COPY_TEMPLATES: Record<Platform, string[]> = {
  instagram: [
    'Todo lo que necesitas saber sobre {program} en 40 segundos. Hook: no es lo que crees.',
    '{program}: la cohorte que separa a quien ejecuta de quien solo escucha. Cupos limitados.',
    'Así es un día real dentro de {program} — sin filtro, sin guion.',
    '3 cosas que nadie te cuenta antes de entrar a {program}. La #2 cambia todo.',
  ],
  linkedin: [
    'La mayoría entiende {program} mal. Esto es lo que realmente cambia cuando lo vives desde adentro.',
    '{program}: 6 semanas, cero teoría de sobra, resultados medibles desde la primera semana.',
    'Por qué {program} no es un curso más — y qué significa eso para quien lidera equipos hoy.',
    'Lo que aprendimos después de 4 cohortes de {program}, resumido en un post.',
  ],
}

export function generateMockCopy(
  brief: string,
  platform: Platform,
  program: Program,
): string {
  const pool = COPY_TEMPLATES[platform]
  const base = pool[Math.floor(Math.random() * pool.length)].replace(
    '{program}',
    program,
  )
  const trimmedBrief = brief.trim()
  return trimmedBrief ? `${base}\n\nBrief original: "${trimmedBrief}"` : base
}

export function generateMockMetrics() {
  return {
    impressions: Math.floor(4000 + Math.random() * 56000),
    engagement: Number((2 + Math.random() * 9).toFixed(1)),
  }
}
