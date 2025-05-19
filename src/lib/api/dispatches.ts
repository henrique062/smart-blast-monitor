
import { supabase } from '../supabase-client';
import { DisparoData, InstanciaCount } from '../types';

// Função para buscar os 8 disparos mais recentes
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

// Função para buscar a quantidade de disparos por instância
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
