
// Tipos para o sistema de cadastro de aulas
export type Periodicidade = 'mensal' | 'trimestral' | 'semestral' | 'anual';

export interface Aula {
  id: string;
  nome: string;
  valor: number;
  periodicidade: Periodicidade;
  vezesSemanais: number;
  dataCadastro: Date;
}

export interface AulaFormData {
  nome: string;
  valor: number;
  periodicidade: Periodicidade;
  vezesSemanais: number;
}
