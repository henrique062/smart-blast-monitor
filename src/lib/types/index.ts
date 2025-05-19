
// Tipos para os contatos
export interface ContatoPrecatorio {
  telefone_principal: string;
  nome_completo: string;
  disparo_realizado: boolean | null;
  disparo_agendamento: boolean | null;
}

// Interface para os dados de disparo
export interface DisparoData {
  id: string;
  nome: string;
  numero_principal: string;
  disparo_principal: boolean;
  created_at: string;
  instancia: string;
}

// Interface para os dados de contagem de instâncias
export interface InstanciaCount {
  name: string;  // Nome da instância
  value: number; // Quantidade de disparos
}

// Template interface
export interface Template {
  id: string;
  titulo: string;
  mensagem: string;
  ativo: boolean;
  deletado: boolean | null;
}

// Interface para instâncias
export interface Instancia {
  id: string;
  nome: string;
  numero: string;
  formatado: string; // Nome - Número
}

// Interface for parâmetros de disparo
export interface ParametrosDisparo {
  id: string;
  instancia_nome: string;
  bot_ativo: boolean;
  horario_inicio: string | null;
  horario_fim: string | null;
  dias_semana: string[] | null;
  created_at: string;
}
