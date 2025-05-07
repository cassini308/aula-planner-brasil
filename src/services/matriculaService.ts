
import { supabase } from "@/integrations/supabase/client";
import { Aula, Aluno, Matricula, MatriculaFormData, Mensalidade, StatusMensalidade } from "../types/aula";
import { formatarData } from "./alunoService";
import { addMonths, addDays, addYears } from 'date-fns';

// Obter todas as matrículas
export const getMatriculas = async (): Promise<Matricula[]> => {
  const { data, error } = await supabase
    .from('matriculas')
    .select(`
      *,
      aluno:aluno_id(*),
      aula:aula_id(*)
    `)
    .order('data_matricula', { ascending: false });
  
  if (error) {
    console.error("Erro ao obter matrículas:", error);
    return [];
  }
  
  return data.map((matricula: any) => ({
    ...matricula,
    data_matricula: new Date(matricula.data_matricula),
    aluno: matricula.aluno ? {
      ...matricula.aluno,
      data_nascimento: new Date(matricula.aluno.data_nascimento),
      data_cadastro: new Date(matricula.aluno.data_cadastro)
    } : undefined,
    aula: matricula.aula ? {
      ...matricula.aula,
      data_cadastro: new Date(matricula.aula.data_cadastro),
      valor: Number(matricula.aula.valor)
    } : undefined
  }));
};

// Obter matrículas de um aluno
export const getMatriculasByAlunoId = async (alunoId: string): Promise<Matricula[]> => {
  const { data, error } = await supabase
    .from('matriculas')
    .select(`
      *,
      aula:aula_id(*)
    `)
    .eq('aluno_id', alunoId)
    .order('data_matricula', { ascending: false });
  
  if (error) {
    console.error("Erro ao obter matrículas do aluno:", error);
    return [];
  }
  
  return data.map((matricula: any) => ({
    ...matricula,
    data_matricula: new Date(matricula.data_matricula),
    aula: matricula.aula ? {
      ...matricula.aula,
      data_cadastro: new Date(matricula.aula.data_cadastro),
      valor: Number(matricula.aula.valor)
    } : undefined
  }));
};

// Verificar se o aluno já está matriculado em uma aula
export const verificarMatriculaExistente = async (alunoId: string, aulaId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('matriculas')
    .select('id')
    .eq('aluno_id', alunoId)
    .eq('aula_id', aulaId)
    .eq('ativa', true)
    .maybeSingle();

  if (error) {
    console.error("Erro ao verificar matrícula:", error);
    return false;
  }

  return !!data;
};

// Calcular a próxima data de vencimento com base na periodicidade
export const calcularProximoVencimento = (periodicidade: string, dataBase?: Date): Date => {
  const hoje = dataBase || new Date();
  const proximaData = new Date(hoje);
  
  // Defina o vencimento para o dia 10 do próximo mês
  proximaData.setDate(10);
  proximaData.setMonth(proximaData.getMonth() + 1);
  
  return proximaData;
};

// Calcular a próxima data de vencimento após um pagamento
export const calcularProximoVencimentoAposPagamento = (
  periodicidade: string, 
  dataVencimentoAtual: Date
): Date => {
  const novaData = new Date(dataVencimentoAtual);
  
  switch (periodicidade) {
    case 'mensal':
      return addMonths(novaData, 1);
    case 'trimestral':
      return addMonths(novaData, 3);
    case 'semestral':
      return addMonths(novaData, 6);
    case 'anual':
      return addYears(novaData, 1);
    default:
      return addMonths(novaData, 1); // Padrão para mensal
  }
};

// Adicionar uma nova matrícula
export const adicionarMatricula = async (matriculaData: MatriculaFormData): Promise<Matricula | null> => {
  // Verificar se o aluno já está matriculado nesta aula
  const jaMatriculado = await verificarMatriculaExistente(
    matriculaData.aluno_id,
    matriculaData.aula_id
  );

  if (jaMatriculado) {
    console.error("Aluno já matriculado nesta aula.");
    return null;
  }

  // Buscar informações da aula para usar o valor e periodicidade
  const { data: aulaData, error: aulaError } = await supabase
    .from('aulas')
    .select('*')
    .eq('id', matriculaData.aula_id)
    .single();

  if (aulaError || !aulaData) {
    console.error("Erro ao obter dados da aula:", aulaError);
    return null;
  }

  // Criar a transação para garantir que tanto a matrícula quanto a mensalidade sejam criadas
  // Como o Supabase não suporta transações com o SDK, vamos fazer operações sequenciais
  
  // 1. Criar a matrícula
  const { data: matriculaInserida, error: matriculaError } = await supabase
    .from('matriculas')
    .insert({
      aluno_id: matriculaData.aluno_id,
      aula_id: matriculaData.aula_id,
    })
    .select()
    .single();

  if (matriculaError || !matriculaInserida) {
    console.error("Erro ao adicionar matrícula:", matriculaError);
    return null;
  }

  // 2. Criar a primeira mensalidade
  const dataVencimento = calcularProximoVencimento(aulaData.periodicidade);
  
  const { error: mensalidadeError } = await supabase
    .from('mensalidades')
    .insert({
      matricula_id: matriculaInserida.id,
      data_vencimento: dataVencimento.toISOString().split('T')[0],
      valor: aulaData.valor,
      status: 'pendente'
    });

  if (mensalidadeError) {
    console.error("Erro ao criar mensalidade:", mensalidadeError);
    // Idealmente, deveríamos reverter a matrícula, mas sem transações no SDK, fica mais complexo
    // No mundo real, isso deveria ser feito com uma function no banco de dados
  }

  return {
    ...matriculaInserida,
    data_matricula: new Date(matriculaInserida.data_matricula)
  };
};

// Cancelar uma matrícula
export const cancelarMatricula = async (matriculaId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('matriculas')
    .update({ ativa: false })
    .eq('id', matriculaId);

  if (error) {
    console.error("Erro ao cancelar matrícula:", error);
    return false;
  }

  return true;
};
