
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
}

// Função para buscar todos os contatos
export async function fetchContatos() {
  const { data, error } = await supabase
    .from('contatos_precatorios')
    .select('telefone_principal, nome_completo, disparo_realizado');

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
    .select('telefone_principal, nome_completo, disparo_realizado')
    .or(`nome_completo.ilike.%${searchTerm}%,telefone_principal.ilike.%${searchTerm}%`);

  if (error) {
    console.error('Erro ao buscar contatos:', error);
    throw error;
  }

  return data || [];
}
