
import { supabase } from "@/integrations/supabase/client";
import { Aluno } from "@/types/aula";

export interface Aviso {
  id: string;
  titulo: string;
  conteudo: string;
  data_criacao: Date;
  publicado: boolean;
  para_todos: boolean;
  alunos_ids?: string[];
}

export interface AvisoFormData {
  titulo: string;
  conteudo: string;
  para_todos: boolean;
  alunos_ids?: string[];
}

// Obter todos os avisos
export const getAvisos = async (): Promise<Aviso[]> => {
  const { data, error } = await supabase
    .from('avisos')
    .select('*')
    .order('data_criacao', { ascending: false });
  
  if (error) {
    console.error("Erro ao obter avisos:", error);
    return [];
  }
  
  return data.map((aviso: any) => ({
    ...aviso,
    data_criacao: new Date(aviso.data_criacao)
  }));
};

// Obter aviso por ID
export const getAvisoById = async (id: string): Promise<Aviso | null> => {
  // Get the main aviso data
  const { data: avisoData, error: avisoError } = await supabase
    .from('avisos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (avisoError) {
    console.error("Erro ao obter aviso:", avisoError);
    return null;
  }
  
  // Get the related alunos IDs
  const { data: alunosData, error: alunosError } = await supabase
    .from('avisos_alunos')
    .select('aluno_id')
    .eq('aviso_id', id);
  
  if (alunosError) {
    console.error("Erro ao obter relações aluno-aviso:", alunosError);
  }
  
  // Process the student IDs
  const alunosIds = alunosData ? alunosData.map((rel: any) => rel.aluno_id) : [];
  
  return {
    ...avisoData,
    data_criacao: new Date(avisoData.data_criacao),
    alunos_ids: alunosIds
  };
};

// Obter avisos para um aluno específico
export const getAvisosByAlunoId = async (alunoId: string): Promise<Aviso[]> => {
  // Buscar avisos para todos os alunos
  const { data: avisosTodos, error: errorTodos } = await supabase
    .from('avisos')
    .select('*')
    .eq('publicado', true)
    .eq('para_todos', true)
    .order('data_criacao', { ascending: false });
  
  if (errorTodos) {
    console.error("Erro ao obter avisos para todos:", errorTodos);
    return [];
  }

  // Buscar avisos específicos para este aluno através da tabela de relacionamento
  const { data: avisosRelacionamentos, error: errorRelacionamentos } = await supabase
    .from('avisos_alunos')
    .select('aviso_id')
    .eq('aluno_id', alunoId);
  
  if (errorRelacionamentos) {
    console.error("Erro ao obter relações aluno-aviso:", errorRelacionamentos);
    return [];
  }
  
  // Se houver avisos específicos, buscar seus detalhes
  let avisosEspecificos: any[] = [];
  if (avisosRelacionamentos && avisosRelacionamentos.length > 0) {
    const avisosIds = avisosRelacionamentos.map(rel => rel.aviso_id);
    
    const { data: avisosData, error: avisosError } = await supabase
      .from('avisos')
      .select('*')
      .in('id', avisosIds)
      .eq('publicado', true);
      
    if (avisosError) {
      console.error("Erro ao obter avisos específicos:", avisosError);
    } else {
      avisosEspecificos = avisosData || [];
    }
  }
  
  // Combinar os dois conjuntos de avisos
  const todosAvisos = [
    ...avisosTodos.map((aviso: any) => ({
      ...aviso,
      data_criacao: new Date(aviso.data_criacao)
    })),
    ...avisosEspecificos.map((aviso: any) => ({
      ...aviso,
      data_criacao: new Date(aviso.data_criacao)
    }))
  ];
  
  // Remover duplicatas se houver
  const avisoIds = new Set();
  const avisosUnicos = todosAvisos.filter(aviso => {
    const duplicado = avisoIds.has(aviso.id);
    avisoIds.add(aviso.id);
    return !duplicado;
  });
    
  // Ordenar por data de criação (mais recentes primeiro)
  return avisosUnicos.sort((a, b) => b.data_criacao.getTime() - a.data_criacao.getTime());
};

// Adicionar um novo aviso
export const adicionarAviso = async (avisoData: AvisoFormData): Promise<Aviso | null> => {
  // Primeiro, inserir o aviso principal
  const { data, error } = await supabase
    .from('avisos')
    .insert({
      titulo: avisoData.titulo,
      conteudo: avisoData.conteudo,
      para_todos: avisoData.para_todos,
      publicado: true // Por padrão, já publicamos o aviso
    })
    .select()
    .single();
  
  if (error) {
    console.error("Erro ao adicionar aviso:", error);
    return null;
  }
  
  // Se não for para todos e tiver alunos específicos, criar as relações
  if (!avisoData.para_todos && avisoData.alunos_ids && avisoData.alunos_ids.length > 0) {
    const relacoesAlunosAvisos = avisoData.alunos_ids.map(alunoId => ({
      aviso_id: data.id,
      aluno_id: alunoId
    }));
    
    const { error: relError } = await supabase
      .from('avisos_alunos')
      .insert(relacoesAlunosAvisos);
    
    if (relError) {
      console.error("Erro ao adicionar relações de alunos-avisos:", relError);
    }
  }
  
  return {
    ...data,
    data_criacao: new Date(data.data_criacao),
    alunos_ids: avisoData.alunos_ids || []
  };
};

// Atualizar um aviso existente
export const atualizarAviso = async (id: string, avisoData: AvisoFormData): Promise<Aviso | null> => {
  // Primeiro, atualizar o aviso principal
  const { data, error } = await supabase
    .from('avisos')
    .update({
      titulo: avisoData.titulo,
      conteudo: avisoData.conteudo,
      para_todos: avisoData.para_todos
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Erro ao atualizar aviso:", error);
    return null;
  }
  
  // Remover relações existentes
  const { error: delError } = await supabase
    .from('avisos_alunos')
    .delete()
    .eq('aviso_id', id);
  
  if (delError) {
    console.error("Erro ao remover relações de alunos-avisos:", delError);
  }
  
  // Se não for para todos e tiver alunos específicos, criar novas relações
  if (!avisoData.para_todos && avisoData.alunos_ids && avisoData.alunos_ids.length > 0) {
    const relacoesAlunosAvisos = avisoData.alunos_ids.map(alunoId => ({
      aviso_id: id,
      aluno_id: alunoId
    }));
    
    const { error: relError } = await supabase
      .from('avisos_alunos')
      .insert(relacoesAlunosAvisos);
    
    if (relError) {
      console.error("Erro ao adicionar relações de alunos-avisos:", relError);
    }
  }
  
  return {
    ...data,
    data_criacao: new Date(data.data_criacao),
    alunos_ids: avisoData.alunos_ids || []
  };
};

// Publicar/despublicar um aviso
export const alternarPublicacaoAviso = async (id: string, publicado: boolean): Promise<boolean> => {
  const { error } = await supabase
    .from('avisos')
    .update({ publicado })
    .eq('id', id);
  
  if (error) {
    console.error("Erro ao alterar status de publicação:", error);
    return false;
  }
  
  return true;
};

// Excluir um aviso
export const excluirAviso = async (id: string): Promise<boolean> => {
  // Primeiro, remover relações com alunos
  const { error: relError } = await supabase
    .from('avisos_alunos')
    .delete()
    .eq('aviso_id', id);
  
  if (relError) {
    console.error("Erro ao remover relações de alunos-avisos:", relError);
  }
  
  // Depois, remover o aviso
  const { error } = await supabase
    .from('avisos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Erro ao excluir aviso:", error);
    return false;
  }
  
  return true;
};
