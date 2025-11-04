export enum LeadStatus {
  Novo = 'Novo',
  Contato = 'Em Contato',
  Qualificado = 'Qualificado',
  Convertido = 'Convertido',
  Perdido = 'Perdido',
}

export interface Lead {
  id: string;
  origem: 'WhatsApp' | 'Site' | 'Indicação';
  nome: string;
  telefone: string;
  email: string;
  empresa?: string;
  created_at: string;
  status: LeadStatus;
}

export interface Cliente {
  id: string;
  lead_id?: string;
  nome: string;
  doc: string;
  endereco: string;
  contato: { nome: string; email: string; telefone: string };
  tags: string[];
}

export interface Tecnico {
  id: string;
  nome: string;
  funcao: 'Refrigeração' | 'Climatização' | 'Elétrica';
  capacidade_dia: number;
  avatar_url: string;
}

export enum AgendamentoStatus {
  Agendado = 'Agendado',
  EmAndamento = 'Em Andamento',
  Concluido = 'Concluído',
  Cancelado = 'Cancelado',
}

export interface Agendamento {
  id: string;
  cliente: Cliente;
  servico: string;
  janela_inicio: string;
  janela_fim: string;
  tecnico: Tecnico;
  status: AgendamentoStatus;
}
