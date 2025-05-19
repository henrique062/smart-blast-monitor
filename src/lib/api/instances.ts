import { supabase } from '../supabase-client';
import { Instancia, ParametrosDisparo } from '../types';

// Explicitly export types for use by other files
export type { Instancia, ParametrosDisparo };

// Função para buscar todas as instâncias
export async function fetchInstancias(): Promise<Instancia[]> {
  try {
    console.log('Iniciando busca de instâncias...');
    
    const { data, error } = await supabase
      .from('instancias')
      .select('id, nome, numero');

    if (error) {
      console.error('Erro ao buscar instâncias:', error);
      throw error;
    }

    // Verificar se os dados estão corretos
    console.log('Resposta da API de instâncias:', data);
    
    // Criar o campo formatado com nome e número concatenados
    const formattedData = data?.map(inst => ({
      ...inst,
      formatado: `${inst.nome} - ${inst.numero}`
    })) || [];

    console.log('Instâncias formatadas:', formattedData);
    return formattedData;
  } catch (error) {
    console.error('Exception ao buscar instâncias:', error);
    throw error; // Re-throw para permitir tratamento de erro no hook
  }
}

// Função para buscar parâmetros de disparo
export async function fetchParametrosDisparo(): Promise<ParametrosDisparo[]> {
  try {
    const { data, error } = await supabase
      .from('parametros_disparo')
      .select('*');

    if (error) {
      console.error('Erro ao buscar parâmetros de disparo:', error);
      throw error;
    }

    console.log('Parâmetros de disparo carregados:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Exception ao buscar parâmetros de disparo:', error);
    return [];
  }
}

// Função para buscar parâmetros de disparo de uma instância específica
export async function fetchParametrosDisparoPorInstancia(instanciaNome: string): Promise<ParametrosDisparo | null> {
  const { data, error } = await supabase
    .from('parametros_disparo')
    .select('*')
    .eq('instancia_nome', instanciaNome)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Erro ao buscar parâmetros de disparo:', error);
    throw error;
  }

  return data || null;
}

// Função para atualizar parâmetros de disparo
export async function updateParametrosDisparo(params: Partial<ParametrosDisparo>): Promise<ParametrosDisparo | null> {
  const { data, error } = await supabase
    .from('parametros_disparo')
    .upsert([params])
    .select();

  if (error) {
    console.error('Erro ao atualizar parâmetros de disparo:', error);
    throw error;
  }

  return data?.[0] || null;
}
