
import { supabase } from "@/integrations/supabase/client";
import { format, addHours } from "date-fns";
import { AgendamentoHorario } from "@/types/agenda";

// Função para formatar a hora a partir do valor numérico (1 = 7:00, 2 = 8:00, etc)
export const formatarHora = (horaIndice: number): string => {
  // Assumindo que horaIndice 1 = 7:00, 2 = 8:00, etc.
  const hora = 6 + horaIndice;
  return `${hora}:00`;
};

// Alias para compatibilidade com componentes existentes
export const formatarHorario = formatarHora;

// Função para converter o dia da semana de número para texto
export const formatarDiaSemana = (diaSemana: number): string => {
  const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return diasDaSemana[diaSemana];
};

// Alias para compatibilidade com componentes existentes
export const getDiaDaSemanaTexto = formatarDiaSemana;

// Função para buscar agendamentos por ID de aluno
export const getAgendamentosByAlunoId = async (alunoId: string): Promise<AgendamentoHorario[]> => {
  try {
    // Buscar os agendamentos do aluno
    const { data: agendamentos, error } = await supabase
      .from('agendamentos')
      .select(`
        id,
        dia_semana,
        hora_inicio,
        aluno_id,
        aula_id,
        aula:aulas(id, nome, valor, periodicidade, vezes_semanais),
        aluno:alunos(*)
      `)
      .eq('aluno_id', alunoId);

    if (error) throw error;

    // Formatar os dados para exibição
    return agendamentos.map((agendamento: any) => ({
      id: agendamento.id,
      dia_semana: agendamento.dia_semana,
      hora_inicio: agendamento.hora_inicio,
      dia_semana_texto: formatarDiaSemana(agendamento.dia_semana),
      hora_texto: formatarHora(agendamento.hora_inicio),
      aluno: agendamento.aluno,
      aluno_id: agendamento.aluno_id,
      aula_id: agendamento.aula_id,
      aula: {
        ...agendamento.aula,
        // Garantir que a periodicidade seja do tipo correto
        periodicidade: agendamento.aula.periodicidade
      }
    }));
  } catch (error) {
    console.error("Erro ao buscar agendamentos do aluno:", error);
    throw error;
  }
};

// Função para verificar se existe algum agendamento no mesmo horário
export const verificarHorarioDisponivel = async (diaSemana: number, horaInicio: number): Promise<boolean> => {
  try {
    const { data: agendamentos, error } = await supabase
      .from('agendamentos')
      .select()
      .eq('dia_semana', diaSemana)
      .eq('hora_inicio', horaInicio);

    if (error) throw error;

    // Se houver agendamentos, o horário não está disponível
    return agendamentos.length === 0;
  } catch (error) {
    console.error("Erro ao verificar disponibilidade de horário:", error);
    throw error;
  }
};

// Função para criar um novo agendamento
export const criarAgendamento = async (agendamento: {
  aluno_id: string;
  aula_id: string;
  dia_semana: number;
  hora_inicio: number;
}): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('agendamentos')
      .insert(agendamento);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    throw error;
  }
};

// Função para excluir um agendamento
export const excluirAgendamento = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    throw error;
  }
};

// Alias para compatibilidade com componentes existentes
export const removerAgendamento = excluirAgendamento;

// Função para buscar todos os agendamentos com informações de alunos e aulas
export const getAllAgendamentos = async (): Promise<AgendamentoHorario[]> => {
  try {
    const { data: agendamentos, error } = await supabase
      .from('agendamentos')
      .select(`
        id,
        dia_semana,
        hora_inicio,
        aluno_id,
        aula_id,
        aula:aulas(id, nome, valor, periodicidade, vezes_semanais),
        aluno:alunos(*)
      `);

    if (error) throw error;

    // Formatar os dados para exibição
    return agendamentos.map((agendamento: any) => ({
      id: agendamento.id,
      dia_semana: agendamento.dia_semana,
      hora_inicio: agendamento.hora_inicio,
      dia_semana_texto: formatarDiaSemana(agendamento.dia_semana),
      hora_texto: formatarHora(agendamento.hora_inicio),
      aluno: agendamento.aluno,
      aluno_id: agendamento.aluno_id,
      aula_id: agendamento.aula_id,
      aula: {
        ...agendamento.aula,
        // Garantir que a periodicidade seja do tipo correto
        periodicidade: agendamento.aula.periodicidade
      }
    }));
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    throw error;
  }
};

// Função para buscar agendamentos por dia da semana
export const getAgendamentosByDiaSemana = async (diaSemana: number): Promise<AgendamentoHorario[]> => {
  try {
    const { data: agendamentos, error } = await supabase
      .from('agendamentos')
      .select(`
        id,
        dia_semana,
        hora_inicio,
        aluno_id,
        aula_id,
        aula:aulas(id, nome, valor, periodicidade, vezes_semanais),
        aluno:alunos(*)
      `)
      .eq('dia_semana', diaSemana)
      .order('hora_inicio');

    if (error) throw error;

    // Formatar os dados para exibição
    return agendamentos.map((agendamento: any) => ({
      id: agendamento.id,
      dia_semana: agendamento.dia_semana,
      hora_inicio: agendamento.hora_inicio,
      dia_semana_texto: formatarDiaSemana(agendamento.dia_semana),
      hora_texto: formatarHora(agendamento.hora_inicio),
      aluno: agendamento.aluno,
      aluno_id: agendamento.aluno_id,
      aula_id: agendamento.aula_id,
      aula: {
        ...agendamento.aula,
        // Garantir que a periodicidade seja do tipo correto
        periodicidade: agendamento.aula.periodicidade
      }
    }));
  } catch (error) {
    console.error("Erro ao buscar agendamentos por dia da semana:", error);
    throw error;
  }
};

// Alias para compatibilidade com componentes existentes
export const getAgendamentos = getAllAgendamentos;
