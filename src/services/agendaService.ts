
import { AgendamentoFormData, AgendamentoHorario } from "../types/agenda";
import { supabase } from "@/integrations/supabase/client";

// Formatar dia da semana como texto
export const getDiaDaSemanaTexto = (dia: number): string => {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return diasSemana[dia];
};

// Formatar hora como texto (ex: "14:00")
export const formatarHorario = (hora: number): string => {
  return `${hora.toString().padStart(2, '0')}:00`;
};

// Obter todos os agendamentos
export const getAgendamentos = async (): Promise<AgendamentoHorario[]> => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      *,
      aluno:aluno_id(*),
      aula:aula_id(*)
    `);
  
  if (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }
  
  return data.map((agendamento: any) => ({
    ...agendamento,
    dia_semana_texto: getDiaDaSemanaTexto(agendamento.dia_semana),
    hora_texto: formatarHorario(agendamento.hora_inicio)
  }));
};

// Obter agendamentos por aluno
export const getAgendamentosByAlunoId = async (alunoId: string): Promise<AgendamentoHorario[]> => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      *,
      aluno:aluno_id(*),
      aula:aula_id(*)
    `)
    .eq('aluno_id', alunoId);
  
  if (error) {
    console.error("Erro ao buscar agendamentos do aluno:", error);
    return [];
  }
  
  return data.map((agendamento: any) => ({
    ...agendamento,
    dia_semana_texto: getDiaDaSemanaTexto(agendamento.dia_semana),
    hora_texto: formatarHorario(agendamento.hora_inicio)
  }));
};

// Adicionar um novo agendamento
export const adicionarAgendamento = async (agendamentoData: AgendamentoFormData): Promise<AgendamentoHorario | null> => {
  // Verificar se já existe um agendamento para este horário e dia
  const { data: existente } = await supabase
    .from('agendamentos')
    .select('id')
    .eq('dia_semana', agendamentoData.dia_semana)
    .eq('hora_inicio', agendamentoData.hora_inicio)
    .eq('aluno_id', agendamentoData.aluno_id);
  
  if (existente && existente.length > 0) {
    console.error("Já existe um agendamento para este aluno neste horário");
    return null;
  }
  
  const { data, error } = await supabase
    .from('agendamentos')
    .insert(agendamentoData)
    .select(`
      *,
      aluno:aluno_id(*),
      aula:aula_id(*)
    `)
    .single();
  
  if (error) {
    console.error("Erro ao adicionar agendamento:", error);
    return null;
  }
  
  return {
    ...data,
    dia_semana_texto: getDiaDaSemanaTexto(data.dia_semana),
    hora_texto: formatarHorario(data.hora_inicio)
  };
};

// Remover um agendamento
export const removerAgendamento = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('agendamentos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Erro ao remover agendamento:", error);
    return false;
  }
  
  return true;
};
