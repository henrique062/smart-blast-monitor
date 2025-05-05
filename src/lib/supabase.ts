import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://gyheyxmcrbxsexobnipy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5aGV5eG1jcmJ4c2V4b2JuaXB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjQ1ODA1MSwiZXhwIjoyMDYyMDM0MDUxfQ.pxmGVv0Oz85M2i-Y_5PmGN9Tc-aNd-7Mh3LqDoZYnL8';

export const supabase = createClient(supabaseUrl, supabaseKey);

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

// Template interface
export interface Template {
  id: string;
  titulo: string;
  mensagem: string;
  ativo: boolean;
  deletado: boolean | null;
}

// Função para buscar todos os contatos
export async function fetchContatos() {
  const { data, error } = await supabase
    .from('contatos_precatorios')
    .select('telefone_principal, nome_completo, disparo_realizado, disparo_agendamento');

  if (error) {
    console.error('Erro ao buscar contatos:', error);
    throw error;
  }

  return data || [];
}

// Função para buscar contatos com filtro de texto
export async function searchContatos(searchTerm: string) {
  const { data, error } = await supabase
    .from('contatos_precatorios')
    .select('telefone_principal, nome_completo, disparo_realizado, disparo_agendamento')
    .or(`nome_completo.ilike.%${searchTerm}%,telefone_principal.ilike.%${searchTerm}%`);

  if (error) {
    console.error('Erro ao buscar contatos:', error);
    throw error;
  }

  return data || [];
}

// Função para buscar os 8 disparos mais recentes
export async function fetchRecentDisparos() {
  const { data, error } = await supabase
    .from('disparos')
    .select('id, nome, numero_principal, disparo_principal, created_at, instancia')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Erro ao buscar disparos recentes:', error);
    throw error;
  }

  return data || [];
}

// Função para buscar templates ativos
export async function fetchTemplates() {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .or('deletado.is.null,deletado.eq.false');

  if (error) {
    console.error('Erro ao buscar templates:', error);
    throw error;
  }

  return data || [];
}

// Função para atualizar o status de um template
export async function updateTemplateStatus(id: string, ativo: boolean) {
  const { error } = await supabase
    .from('templates')
    .update({ ativo })
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar status do template:', error);
    throw error;
  }

  return true;
}

// Função para excluir um template
export async function deleteTemplate(id: string) {
  const { error } = await supabase
    .from('templates')
    .update({ deletado: true })
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir template:', error);
    throw error;
  }

  return true;
}

// Função para criar um novo template
export async function createTemplate(template: Omit<Template, 'id' | 'deletado'>) {
  const { data, error } = await supabase
    .from('templates')
    .insert([{ ...template, deletado: false }])
    .select();

  if (error) {
    console.error('Erro ao criar template:', error);
    throw error;
  }

  return data ? data[0] : null;
}
