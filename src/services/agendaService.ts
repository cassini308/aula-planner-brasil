
import { supabase } from "@/integrations/supabase/client";
import { Aluno, Aula } from "@/types/aula";
import { AgendamentoHorario, AgendamentoFormData } from "@/types/agenda";

const diaSemanaTexto = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];

const formatarHora = (hora: number): string => {
  return `${hora}:00`;
};

// Obter todos os agendamentos
export const getAgendamentos = async (): Promise<AgendamentoHorario[]> => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      *,
      aluno:aluno_id (*),
      aula:aula_id (*)
    `);
  
  if (error) {
    console.error("Erro ao obter agendamentos:", error);
    return [];
  }
  
  return data.map((agendamento: any) => ({
    ...agendamento,
    aluno: agendamento.aluno ? {
      ...agendamento.aluno,
      data_nascimento: new Date(agendamento.aluno.data_nascimento),
      data_cadastro: new Date(agendamento.aluno.data_cadastro)
    } : undefined,
    dia_semana_texto: diaSemanaTexto[agendamento.dia_semana],
    hora_texto: formatarHora(agendamento.hora_inicio)
  }));
};

// Obter agendamentos por dia da semana
export const getAgendamentosPorDiaSemana = async (diaSemana: number): Promise<AgendamentoHorario[]> => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      *,
      aluno:aluno_id (*),
      aula:aula_id (*)
    `)
    .eq('dia_semana', diaSemana);
  
  if (error) {
    console.error(`Erro ao obter agendamentos para o dia ${diaSemana}:`, error);
    return [];
  }
  
  return data.map((agendamento: any) => ({
    ...agendamento,
    aluno: agendamento.aluno ? {
      ...agendamento.aluno,
      data_nascimento: new Date(agendamento.aluno.data_nascimento),
      data_cadastro: new Date(agendamento.aluno.data_cadastro)
    } : undefined,
    dia_semana_texto: diaSemanaTexto[agendamento.dia_semana],
    hora_texto: formatarHora(agendamento.hora_inicio)
  }));
};

// Obter agendamentos por aluno
export const getAgendamentosByAlunoId = async (alunoId: string): Promise<AgendamentoHorario[]> => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      *,
      aluno:aluno_id (*),
      aula:aula_id (*)
    `)
    .eq('aluno_id', alunoId);
  
  if (error) {
    console.error(`Erro ao obter agendamentos para o aluno ${alunoId}:`, error);
    return [];
  }
  
  return data.map((agendamento: any) => ({
    ...agendamento,
    aluno: agendamento.aluno ? {
      ...agendamento.aluno,
      data_nascimento: new Date(agendamento.aluno.data_nascimento),
      data_cadastro: new Date(agendamento.aluno.data_cadastro)
    } : undefined,
    dia_semana_texto: diaSemanaTexto[agendamento.dia_semana],
    hora_texto: formatarHora(agendamento.hora_inicio)
  }));
};

// Adicionar um agendamento
export const adicionarAgendamento = async (agendamento: AgendamentoFormData): Promise<AgendamentoHorario | null> => {
  const { data, error } = await supabase
    .from('agendamentos')
    .insert(agendamento)
    .select(`
      *,
      aluno:aluno_id (*),
      aula:aula_id (*)
    `)
    .single();
  
  if (error) {
    console.error("Erro ao adicionar agendamento:", error);
    return null;
  }
  
  return {
    ...data,
    dia_semana_texto: diaSemanaTexto[data.dia_semana],
    hora_texto: formatarHora(data.hora_inicio),
    aluno: data.aluno ? {
      ...data.aluno,
      data_nascimento: new Date(data.aluno.data_nascimento),
      data_cadastro: new Date(data.aluno.data_cadastro)
    } : undefined
  };
};

// Excluir um agendamento
export const excluirAgendamento = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('agendamentos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Erro ao excluir agendamento:", error);
    return false;
  }
  
  return true;
};
