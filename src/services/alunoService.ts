
import { Aluno, AlunoFormData, Responsavel, ResponsavelFormData } from "../types/aula";
import { supabase } from "@/integrations/supabase/client";

// Obter todos os alunos
export const getAlunos = async (): Promise<Aluno[]> => {
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .order('nome');
  
  if (error) {
    console.error("Erro ao obter alunos:", error);
    return [];
  }
  
  return data.map((aluno: any) => ({
    ...aluno,
    data_nascimento: new Date(aluno.data_nascimento),
    data_cadastro: new Date(aluno.data_cadastro)
  }));
};

// Obter aluno por ID
export const getAlunoById = async (id: string): Promise<Aluno | null> => {
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Erro ao obter aluno:", error);
    return null;
  }
  
  return {
    ...data,
    data_nascimento: new Date(data.data_nascimento),
    data_cadastro: new Date(data.data_cadastro)
  };
};

// Adicionar um novo aluno
export const adicionarAluno = async (
  alunoData: AlunoFormData, 
  responsavelData?: ResponsavelFormData
): Promise<Aluno | null> => {
  // Se for menor de idade, primeiro cadastra o responsável
  let responsavelId = null;
  
  if (alunoData.menor_idade && responsavelData) {
    console.log("Cadastrando responsável:", responsavelData);
    const { data: respData, error: respError } = await supabase
      .from('responsaveis')
      .insert({
        nome: responsavelData.nome,
        email: responsavelData.email || null,
        telefone: responsavelData.telefone || null,
        cpf: responsavelData.cpf,
        rg: responsavelData.rg || null,
        endereco: responsavelData.endereco || null,
        data_nascimento: responsavelData.data_nascimento 
          ? responsavelData.data_nascimento.toISOString().split('T')[0] 
          : null
      })
      .select()
      .single();
    
    if (respError) {
      console.error("Erro ao adicionar responsável:", respError);
      return null;
    }
    
    responsavelId = respData.id;
    console.log("Responsável cadastrado com ID:", responsavelId);
  }
  
  // Agora cadastra o aluno
  const { data, error } = await supabase
    .from('alunos')
    .insert({
      nome: alunoData.nome,
      email: alunoData.email || null,
      telefone: alunoData.telefone || null,
      cpf: alunoData.cpf,
      rg: alunoData.rg || null,
      endereco: alunoData.endereco || null,
      data_nascimento: alunoData.data_nascimento.toISOString().split('T')[0],
      responsavel_id: responsavelId,
      menor_idade: !!alunoData.menor_idade
    })
    .select()
    .single();
  
  if (error) {
    console.error("Erro ao adicionar aluno:", error);
    return null;
  }
  
  return {
    ...data,
    data_nascimento: new Date(data.data_nascimento),
    data_cadastro: new Date(data.data_cadastro)
  };
};

// Atualizar um aluno existente
export const atualizarAluno = async (
  id: string, 
  alunoData: AlunoFormData, 
  responsavelData?: ResponsavelFormData
): Promise<Aluno | null> => {
  const aluno = await getAlunoById(id);
  if (!aluno) return null;
  
  // Se for menor de idade, atualiza ou cria o responsável
  let responsavelId = aluno.responsavel_id;
  
  if (alunoData.menor_idade && responsavelData) {
    console.log("Processando responsável para atualização:", responsavelData);
    
    if (aluno.responsavel_id) {
      // Atualiza o responsável existente
      console.log("Atualizando responsável existente:", aluno.responsavel_id);
      const { error: respError } = await supabase
        .from('responsaveis')
        .update({
          nome: responsavelData.nome,
          email: responsavelData.email || null,
          telefone: responsavelData.telefone || null,
          cpf: responsavelData.cpf,
          rg: responsavelData.rg || null,
          endereco: responsavelData.endereco || null,
          data_nascimento: responsavelData.data_nascimento 
            ? responsavelData.data_nascimento.toISOString().split('T')[0] 
            : null
        })
        .eq('id', aluno.responsavel_id);
        
      if (respError) {
        console.error("Erro ao atualizar responsável:", respError);
      }
    } else {
      // Cria um novo responsável
      console.log("Criando novo responsável");
      const { data: respData, error: respError } = await supabase
        .from('responsaveis')
        .insert({
          nome: responsavelData.nome,
          email: responsavelData.email || null,
          telefone: responsavelData.telefone || null,
          cpf: responsavelData.cpf,
          rg: responsavelData.rg || null,
          endereco: responsavelData.endereco || null,
          data_nascimento: responsavelData.data_nascimento 
            ? responsavelData.data_nascimento.toISOString().split('T')[0] 
            : null
        })
        .select()
        .single();
        
      if (respError) {
        console.error("Erro ao criar novo responsável:", respError);
      } else if (respData) {
        responsavelId = respData.id;
        console.log("Novo responsável criado com ID:", responsavelId);
      }
    }
  } else if (!alunoData.menor_idade) {
    // Se não é mais menor de idade, remove a associação com o responsável
    responsavelId = null;
  }
  
  // Atualiza o aluno
  const { data, error } = await supabase
    .from('alunos')
    .update({
      nome: alunoData.nome,
      email: alunoData.email || null,
      telefone: alunoData.telefone || null,
      cpf: alunoData.cpf,
      rg: alunoData.rg || null,
      endereco: alunoData.endereco || null,
      data_nascimento: alunoData.data_nascimento.toISOString().split('T')[0],
      responsavel_id: responsavelId,
      menor_idade: !!alunoData.menor_idade
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Erro ao atualizar aluno:", error);
    return null;
  }
  
  return {
    ...data,
    data_nascimento: new Date(data.data_nascimento),
    data_cadastro: new Date(data.data_cadastro)
  };
};

// Excluir um aluno
export const excluirAluno = async (id: string): Promise<boolean> => {
  const aluno = await getAlunoById(id);
  if (!aluno) return false;
  
  const { error } = await supabase
    .from('alunos')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Erro ao excluir aluno:", error);
    return false;
  }
  
  // Se tinha responsável e não há mais alunos vinculados a ele, exclui o responsável
  if (aluno.responsavel_id) {
    const { count } = await supabase
      .from('alunos')
      .select('id', { count: 'exact' })
      .eq('responsavel_id', aluno.responsavel_id);
    
    if (count === 0) {
      await supabase
        .from('responsaveis')
        .delete()
        .eq('id', aluno.responsavel_id);
    }
  }
  
  return true;
};

// Obter o responsável de um aluno
export const getResponsavel = async (responsavelId: string): Promise<Responsavel | null> => {
  if (!responsavelId) return null;
  
  const { data, error } = await supabase
    .from('responsaveis')
    .select('*')
    .eq('id', responsavelId)
    .single();
  
  if (error) {
    console.error("Erro ao obter responsável:", error);
    return null;
  }
  
  return {
    ...data,
    data_nascimento: data.data_nascimento ? new Date(data.data_nascimento) : null
  };
};

// Verificar se CPF já existe
export const verificarCpfExistente = async (cpf: string, excluirId?: string): Promise<boolean> => {
  let query = supabase
    .from('alunos')
    .select('id')
    .eq('cpf', cpf);
  
  if (excluirId) {
    query = query.neq('id', excluirId);
  }
  
  const { data } = await query;
  return data && data.length > 0;
};

// Formatar CPF
export const formatarCpf = (cpf: string): string => {
  const cpfLimpo = cpf.replace(/\D/g, '');
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Formatar telefone
export const formatarTelefone = (telefone: string): string => {
  const telefoneLimpo = telefone.replace(/\D/g, '');
  if (telefoneLimpo.length === 11) {
    return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return telefoneLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

// Formatar data
export const formatarData = (data: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(data);
};

// Formatar moeda (nova função)
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(valor);
};
