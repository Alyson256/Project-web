export interface ProductItem {
  id: number;
  title: string;
  technique: string;
  description: string;
  image: string;
  isAvailable: boolean;
  stock: number;
  price: number;
  artist: string;
  artistPhoto?: string;
  ownerUid?: string;
  ownerEmail?: string;
  status?: 'publicado' | 'em_revisao' | 'rascunho' | 'ajuste_solicitado';
  adjustmentFeedback?: string;
  contactsCount?: number;
  isTraining?: boolean;
  sellerWhatsapp?: string;
  sellerAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserItem {
  id: number;
  uid?: string;
  name: string;
  email?: string;
  role: string;
  cooperativeStatus?: 'ativo' | 'em_aprovacao' | 'treinamento' | null;
  stepText?: string;
  trainingTarget?: 'produtor' | 'colaborador' | 'gestor';
  completedStepsCount?: number;
  totalStepsCount?: number;
  completedAt?: string;
  lastActivityDate?: string;
  practicedItems?: string[];
}

export interface AnnouncementItem {
  id: number;
  title: string;
  category: 'Mudança' | 'Publicação' | 'Aviso';
  date: string;
  summary: string;
  content: string;
  author: string;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  description?: string;
}


