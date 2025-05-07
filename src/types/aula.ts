
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

// Novos tipos para matrículas e mensalidades
export interface Matricula {
  id: string;
  aluno_id: string;
  aula_id: string;
  data_matricula: Date;
  ativa: boolean;
  aluno?: Aluno;
  aula?: Aula;
}

export interface MatriculaFormData {
  aluno_id: string;
  aula_id: string;
}

export type StatusMensalidade = 'pendente' | 'pago' | 'atrasado' | 'cancelado';

export interface Mensalidade {
  id: string;
  matricula_id: string;
  data_vencimento: Date;
  valor: number;
  status: StatusMensalidade;
  data_pagamento: Date | null;
  data_criacao: Date;
  matricula?: Matricula;
}
