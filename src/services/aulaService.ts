import { Aula, AulaFormData } from "../types/aula";
import { supabase } from "@/integrations/supabase/client";

// Obter todas as aulas
export const getAulas = async (): Promise<Aula[]> => {
  const { data, error } = await supabase
    .from('aulas')
    .select('*')
    .order('nome');
  
  if (error) {
    console.error("Erro ao obter aulas:", error);
    return [];
  }
  
  // Converter strings de data em objetos Date
  return data.map((aula: any) => ({
    ...aula,
    data_cadastro: new Date(aula.data_cadastro),
    valor: Number(aula.valor) // Garantir que valor seja um número
  }));
};

// Adicionar uma nova aula
export const adicionarAula = async (aulaData: AulaFormData): Promise<Aula | null> => {
  const { data, error } = await supabase
    .from('aulas')
    .insert({
      nome: aulaData.nome,
      valor: aulaData.valor,
      periodicidade: aulaData.periodicidade,
      vezes_semanais: aulaData.vezes_semanais
    })
    .select()
    .single();
  
  if (error) {
    console.error("Erro ao adicionar aula:", error);
    return null;
  }
  
  return {
    ...data,
    data_cadastro: new Date(data.data_cadastro),
    valor: Number(data.valor)
  } as Aula;
};

// Atualizar uma aula existente
export const atualizarAula = async (id: string, aulaData: AulaFormData): Promise<Aula | null> => {
  const { data, error } = await supabase
    .from('aulas')
    .update({
      nome: aulaData.nome,
      valor: aulaData.valor,
      periodicidade: aulaData.periodicidade,
      vezes_semanais: aulaData.vezes_semanais
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Erro ao atualizar aula:", error);
    return null;
  }
  
  return {
    ...data,
    data_cadastro: new Date(data.data_cadastro),
    valor: Number(data.valor)
  } as Aula;
};

// Excluir uma aula
export const excluirAula = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('aulas')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Erro ao excluir aula:", error);
    return false;
  }
  
  return true;
};

// Formatar valor monetário
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};
