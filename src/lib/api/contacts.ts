
import { supabase } from '../supabase-client';
import { ContatoPrecatorio } from '../types';

// Função para buscar todos os contatos
export async function fetchContatos(): Promise<ContatoPrecatorio[]> {
  try {
    const { data, error } = await supabase
      .from('contatos_precatorios')
      .select('telefone_principal, nome_completo, disparo_realizado, disparo_agendamento');

    if (error) {
      console.error('Erro ao buscar contatos:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Exception ao buscar contatos:', error);
    return [];
  }
}

// Função específica para buscar disparos em andamento
export async function fetchDisparosEmAndamento(): Promise<number> {
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
export async function searchContatos(searchTerm: string): Promise<ContatoPrecatorio[]> {
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
