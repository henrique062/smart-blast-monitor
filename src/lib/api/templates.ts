
import { supabase } from '../supabase-client';
import { Template } from '../types';

// Re-export the Template type
export type { Template };

// Função para buscar templates ativos
export async function fetchTemplates(): Promise<Template[]> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .or('deletado.is.null,deletado.eq.false');

    if (error) {
      console.error('Erro ao buscar templates:', error);
      throw error;
    }

    console.log('Templates carregados:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Exception ao buscar templates:', error);
    return [];
  }
}

// Função para atualizar o status de um template
export async function updateTemplateStatus(id: string, ativo: boolean): Promise<boolean> {
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
export async function deleteTemplate(id: string): Promise<boolean> {
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
export async function createTemplate(template: Omit<Template, 'id' | 'deletado'>): Promise<Template | null> {
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
