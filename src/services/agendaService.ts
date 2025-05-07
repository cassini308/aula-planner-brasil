
import { supabase } from "@/integrations/supabase/client";
import { AgendamentoHorario, AgendamentoHorarioFormData } from "../types/agenda";

// Obter todos os agendamentos
export const getAgendamentos = async (): Promise<AgendamentoHorario[]> => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      *,
      aluno:aluno_id(*),
      aula:aula_id(*)
    `)
    .order('dia_semana')
    .order('hora_inicio');
  
  if (error) {
    console.error("Erro ao obter agendamentos:", error);
    throw error;
  }
  
  return data.map((agendamento: any) => ({
    ...agendamento,
    aluno: agendamento.aluno ? {
      ...agendamento.aluno,
      data_nascimento: new Date(agendamento.aluno.data_nascimento),
      data_cadastro: new Date(agendamento.aluno.data_cadastro)
    } : undefined,
    aula: agendamento.aula ? {
      ...agendamento.aula,
      data_cadastro: new Date(agendamento.aula.data_cadastro),
      valor: Number(agendamento.aula.valor)
    } : undefined
  }));
};

// Adicionar um novo agendamento
export const adicionarAgendamento = async (dados: AgendamentoHorarioFormData): Promise<AgendamentoHorario> => {
  console.log("Adicionando agendamento:", dados);
  
  // Verificar se já existe agendamento para este horário
  const { data: agendamentoExistente, error: erroVerificacao } = await supabase
    .from('agendamentos')
    .select('id')
    .eq('dia_semana', dados.dia_semana)
    .eq('hora_inicio', dados.hora_inicio)
    .eq('aluno_id', dados.aluno_id)
    .maybeSingle();
  
  if (erroVerificacao) {
    console.error("Erro ao verificar agendamento existente:", erroVerificacao);
    throw erroVerificacao;
  }
  
  if (agendamentoExistente) {
    throw new Error("Já existe um agendamento para este aluno neste horário");
  }
  
  const { data, error } = await supabase
    .from('agendamentos')
    .insert([{
      aluno_id: dados.aluno_id,
      aula_id: dados.aula_id,
      dia_semana: dados.dia_semana,
      hora_inicio: dados.hora_inicio
    }])
    .select()
    .single();
  
  if (error) {
    console.error("Erro ao adicionar agendamento:", error);
    throw error;
  }
  
  return data;
};

// Remover um agendamento
export const removerAgendamento = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('agendamentos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Erro ao remover agendamento:", error);
    throw error;
  }
};

// Função auxiliar para formatar o horário
export const formatarHorario = (hora: number): string => {
  return `${hora}:00`;
};

// Função para obter o texto do dia da semana
export const getDiaDaSemanaTexto = (dia: number): string => {
  const diasDaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado"
  ];
  
  return diasDaSemana[dia];
};
