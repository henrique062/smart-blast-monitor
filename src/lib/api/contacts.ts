
import { supabase } from '../supabase-client';
import { ContatoPrecatorio, DisparoData, InstanciaCount } from '../types';

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

// Função para buscar os 8 disparos mais recentes - moved from dispatches.ts
export async function fetchRecentDisparos(): Promise<DisparoData[]> {
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

// Função para buscar a quantidade de disparos por instância - moved from dispatches.ts
export async function fetchDisparosPorInstancia(): Promise<InstanciaCount[]> {
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
