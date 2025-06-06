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
  instancia_nome: string;  // Changed from id_instancia to instancia_nome
  bot_ativo: boolean;
  horario_inicio: string | null;
  horario_fim: string | null;
  dias_semana: string[] | null;
  created_at: string;
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

// Função específica para buscar disparos em andamento
export async function fetchDisparosEmAndamento() {
  const { data, error } = await supabase
    .from('contatos_precatorios')
    .select('count')
    .eq('disparo_agendamento', true)
    .is('disparo_realizado', null);

  if (error) {
    console.error('Erro ao buscar disparos em andamento:', error);
    throw error;
  }

  return data?.[0]?.count || 0;
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

// Função para buscar a quantidade de disparos por instância
export async function fetchDisparosPorInstancia() {
  const { data, error } = await supabase
    .from('disparos')
    .select('instancia, count')
    .select()
    .order('instancia');

  if (error) {
    console.error('Erro ao buscar disparos por instância:', error);
    throw error;
  }

  // Agrupar e contar os resultados
  const instanciaCounts: Record<string, number> = {};
  
  // Processar os resultados para contar por instância
  data?.forEach((disparo) => {
    const instancia = disparo.instancia || 'Sem Instância';
    instanciaCounts[instancia] = (instanciaCounts[instancia] || 0) + 1;
  });

  // Transformar em um array no formato que o gráfico espera
  const result: InstanciaCount[] = Object.entries(instanciaCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return result;
}

// Função para buscar todas as instâncias
export async function fetchInstancias() {
  const { data, error } = await supabase
    .from('instancias')
    .select('id, nome, numero');

  if (error) {
    console.error('Erro ao buscar instâncias:', error);
    throw error;
  }

  // Criar o campo formatado com nome e número concatenados
  const formattedData = data?.map(inst => ({
    ...inst,
    formatado: `${inst.nome} - ${inst.numero}`
  })) || [];

  return formattedData;
}

// Função para buscar parâmetros de disparo
export async function fetchParametrosDisparo() {
  const { data, error } = await supabase
    .from('parametros_disparo')
    .select('*');

  if (error) {
    console.error('Erro ao buscar parâmetros de disparo:', error);
    throw error;
  }

  return data || [];
}

// Função para buscar parâmetros de disparo de uma instância específica
export async function fetchParametrosDisparoPorInstancia(instanciaNome: string) {
  const { data, error } = await supabase
    .from('parametros_disparo')
    .select('*')
    .eq('instancia_nome', instanciaNome)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Erro ao buscar parâmetros de disparo:', error);
    throw error;
  }

  return data;
}

// Função para atualizar parâmetros de disparo
export async function updateParametrosDisparo(params: Partial<ParametrosDisparo>) {
  const { data, error } = await supabase
    .from('parametros_disparo')
    .upsert([params])
    .select();

  if (error) {
    console.error('Erro ao atualizar parâmetros de disparo:', error);
    throw error;
  }

  return data?.[0];
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
