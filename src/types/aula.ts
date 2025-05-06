
// Tipos para o sistema de cadastro de aulas
export type Periodicidade = 'mensal' | 'trimestral' | 'semestral' | 'anual';

export interface Aula {
  id: string;
  nome: string;
  valor: number;
  periodicidade: Periodicidade;
  vezes_semanais: number;
  data_cadastro: Date;
}

export interface AulaFormData {
  nome: string;
  valor: number;
  periodicidade: Periodicidade;
  vezes_semanais: number;
}

// Tipos para o sistema de cadastro de alunos
export interface Aluno {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  cpf: string;
  rg: string | null;
  endereco: string | null;
  data_nascimento: Date;
  responsavel_id: string | null;
  menor_idade: boolean;
  data_cadastro: Date;
}

export interface AlunoFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  rg: string;
  endereco: string;
  data_nascimento: Date;
  menor_idade?: boolean;
}

export interface Responsavel {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  cpf: string;
  rg: string | null;
  endereco: string | null;
  data_nascimento: Date | null;
}

export interface ResponsavelFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  rg: string;
  endereco: string;
  data_nascimento: Date | null;
}
