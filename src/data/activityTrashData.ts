export interface AuditHistoryEntry {
  id: string;
  sentence: string;
  person: string;
  type: 'texto' | 'foto' | 'video' | 'promocao';
  date: string;
  dateFilter: 'hoje' | 'semana' | 'antigo';
  beforeContent?: string;
  afterContent?: string;
}

export interface TrashItem {
  id: string;
  title: string;
  type: 'foto' | 'video';
  url: string;
  removedDate: string;
  deletedTimestamp?: number;
  daysRemaining?: number;
  removedBy: string;
  originalData?: any;
}

export function calculateDaysRemaining(deletedTimestamp?: number): number {
  if (!deletedTimestamp) return 30;
  const elapsedDays = Math.floor((Date.now() - deletedTimestamp) / (1000 * 60 * 60 * 24));
  return Math.max(0, 30 - elapsedDays);
}

export const INITIAL_TRASH: TrashItem[] = [
  {
    id: 't1',
    title: 'Foto antiga da fachada do ateliê',
    type: 'foto',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
    removedDate: '29/10/2026 às 14:30',
    deletedTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    daysRemaining: 28,
    removedBy: 'Ana Gestora',
  },
  {
    id: 't2',
    title: 'Vídeo institucional da Associação Julieta Barros',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    removedDate: '27/10/2026 às 11:15',
    deletedTimestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    daysRemaining: 26,
    removedBy: 'Ana Gestora',
  },
];
