
import { Aluno, Aula } from "./aula";

export interface AgendamentoHorario {
  id: string;
  aluno_id: string;
  aula_id: string;
  dia_semana: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  hora_inicio: number; // Hora do dia (0-23)
  aluno?: Aluno;
  aula?: Aula;
  dia_semana_texto?: string; // Text representation of day
  hora_texto?: string; // Text representation of time
}

export interface AgendamentoFormData {
  aluno_id: string;
  aula_id: string;
  dia_semana: number;
  hora_inicio: number;
}
