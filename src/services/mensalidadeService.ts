
import { supabase } from "@/integrations/supabase/client";
import { Mensalidade, StatusMensalidade, Matricula } from "../types/aula";
import { calcularProximoVencimentoAposPagamento } from "./matriculaService";

// Obter todas as mensalidades
export const getMensalidades = async (): Promise<Mensalidade[]> => {
  const { data, error } = await supabase
    .from('mensalidades')
    .select(`
      *,
      matricula:matricula_id(
        *,
        aluno:aluno_id(*),
        aula:aula_id(*)
      )
    `)
    .order('data_vencimento');
  
  if (error) {
    console.error("Erro ao obter mensalidades:", error);
    return [];
  }
  
  return data.map((mensalidade: any) => ({
    ...mensalidade,
    data_vencimento: new Date(mensalidade.data_vencimento),
    data_pagamento: mensalidade.data_pagamento ? new Date(mensalidade.data_pagamento) : null,
    data_criacao: new Date(mensalidade.data_criacao),
    valor: Number(mensalidade.valor),
    matricula: mensalidade.matricula ? {
      ...mensalidade.matricula,
      data_matricula: new Date(mensalidade.matricula.data_matricula),
      aluno: mensalidade.matricula.aluno ? {
        ...mensalidade.matricula.aluno,
        data_nascimento: new Date(mensalidade.matricula.aluno.data_nascimento),
        data_cadastro: new Date(mensalidade.matricula.aluno.data_cadastro)
      } : undefined,
      aula: mensalidade.matricula.aula ? {
        ...mensalidade.matricula.aula,
        data_cadastro: new Date(mensalidade.matricula.aula.data_cadastro),
        valor: Number(mensalidade.matricula.aula.valor)
      } : undefined
    } : undefined
  }));
};

// Obter mensalidades por matrícula
export const getMensalidadesByMatricula = async (matriculaId: string): Promise<Mensalidade[]> => {
  const { data, error } = await supabase
    .from('mensalidades')
    .select('*')
    .eq('matricula_id', matriculaId)
    .order('data_vencimento');
  
  if (error) {
    console.error("Erro ao obter mensalidades por matrícula:", error);
    return [];
  }
  
  return data.map((mensalidade: any) => ({
    ...mensalidade,
    data_vencimento: new Date(mensalidade.data_vencimento),
    data_pagamento: mensalidade.data_pagamento ? new Date(mensalidade.data_pagamento) : null,
    data_criacao: new Date(mensalidade.data_criacao),
    valor: Number(mensalidade.valor)
  }));
};

// Obter mensalidades por aluno
export const getMensalidadesByAluno = async (alunoId: string): Promise<Mensalidade[]> => {
  const { data, error } = await supabase
    .from('matriculas')
    .select('id')
    .eq('aluno_id', alunoId);

  if (error || !data.length) {
    console.error("Erro ao obter matrículas do aluno:", error);
    return [];
  }

  const matriculaIds = data.map(m => m.id);
  
  const { data: mensalidades, error: mensalidadesError } = await supabase
    .from('mensalidades')
    .select(`
      *,
      matricula:matricula_id(
        *,
        aula:aula_id(*)
      )
    `)
    .in('matricula_id', matriculaIds)
    .order('data_vencimento');
  
  if (mensalidadesError) {
    console.error("Erro ao obter mensalidades do aluno:", mensalidadesError);
    return [];
  }
  
  return mensalidades.map((mensalidade: any) => ({
    ...mensalidade,
    data_vencimento: new Date(mensalidade.data_vencimento),
    data_pagamento: mensalidade.data_pagamento ? new Date(mensalidade.data_pagamento) : null,
    data_criacao: new Date(mensalidade.data_criacao),
    valor: Number(mensalidade.valor),
    matricula: mensalidade.matricula ? {
      ...mensalidade.matricula,
      data_matricula: new Date(mensalidade.matricula.data_matricula),
      aula: mensalidade.matricula.aula ? {
        ...mensalidade.matricula.aula,
        data_cadastro: new Date(mensalidade.matricula.aula.data_cadastro),
        valor: Number(mensalidade.matricula.aula.valor)
      } : undefined
    } : undefined
  }));
};

// Registrar pagamento de uma mensalidade
export const registrarPagamento = async (mensalidadeId: string): Promise<Mensalidade | null> => {
  // Obter dados da mensalidade atual
  const { data: mensalidadeAtual, error: getMensalidadeError } = await supabase
    .from('mensalidades')
    .select(`
      *,
      matricula:matricula_id(
        *,
        aula:aula_id(periodicidade, valor)
      )
    `)
    .eq('id', mensalidadeId)
    .single();
  
  if (getMensalidadeError || !mensalidadeAtual) {
    console.error("Erro ao obter mensalidade:", getMensalidadeError);
    return null;
  }

  // Verificar se a matrícula está ativa
  const { data: matricula, error: getMatriculaError } = await supabase
    .from('matriculas')
    .select('ativa')
    .eq('id', mensalidadeAtual.matricula_id)
    .single();

  if (getMatriculaError || !matricula || !matricula.ativa) {
    console.error("Matrícula inativa ou erro ao verificar:", getMatriculaError);
    return null;
  }

  // Atualizar a mensalidade para paga
  const { data: mensalidadeAtualizada, error: updateError } = await supabase
    .from('mensalidades')
    .update({
      status: 'pago' as StatusMensalidade,
      data_pagamento: new Date().toISOString()
    })
    .eq('id', mensalidadeId)
    .select()
    .single();

  if (updateError) {
    console.error("Erro ao atualizar mensalidade:", updateError);
    return null;
  }

  // Calcular data da próxima mensalidade
  const proximoVencimento = calcularProximoVencimentoAposPagamento(
    mensalidadeAtual.matricula.aula.periodicidade,
    new Date(mensalidadeAtual.data_vencimento)
  );

  // Criar a próxima mensalidade
  await supabase
    .from('mensalidades')
    .insert({
      matricula_id: mensalidadeAtual.matricula_id,
      data_vencimento: proximoVencimento.toISOString().split('T')[0],
      valor: mensalidadeAtual.matricula.aula.valor,
      status: 'pendente'
    });

  return mensalidadeAtualizada ? {
    ...mensalidadeAtualizada,
    data_vencimento: new Date(mensalidadeAtualizada.data_vencimento),
    data_pagamento: mensalidadeAtualizada.data_pagamento ? new Date(mensalidadeAtualizada.data_pagamento) : null,
    data_criacao: new Date(mensalidadeAtualizada.data_criacao),
    valor: Number(mensalidadeAtualizada.valor),
    status: mensalidadeAtualizada.status as StatusMensalidade
  } : null;
};

// Atualizar status de uma mensalidade
export const atualizarStatusMensalidade = async (
  mensalidadeId: string, 
  novoStatus: StatusMensalidade
): Promise<Mensalidade | null> => {
  const atualizacao: any = {
    status: novoStatus
  };

  // Se estiver marcando como pago, registre a data de pagamento
  if (novoStatus === 'pago') {
    atualizacao.data_pagamento = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('mensalidades')
    .update(atualizacao)
    .eq('id', mensalidadeId)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar status da mensalidade:", error);
    return null;
  }

  return data ? {
    ...data,
    data_vencimento: new Date(data.data_vencimento),
    data_pagamento: data.data_pagamento ? new Date(data.data_pagamento) : null,
    data_criacao: new Date(data.data_criacao),
    valor: Number(data.valor),
    status: data.status as StatusMensalidade
  } : null;
};

// Formatação e utilidades
export const formatarStatusMensalidade = (status: StatusMensalidade): string => {
  const formatacao: Record<StatusMensalidade, string> = {
    'pendente': 'Pendente',
    'pago': 'Pago',
    'atrasado': 'Atrasado',
    'cancelado': 'Cancelado'
  };
  
  return formatacao[status] || status;
};

export const getStatusMensalidadeClass = (status: StatusMensalidade): string => {
  const classes: Record<StatusMensalidade, string> = {
    'pendente': 'text-yellow-600 bg-yellow-100',
    'pago': 'text-green-600 bg-green-100',
    'atrasado': 'text-red-600 bg-red-100',
    'cancelado': 'text-gray-600 bg-gray-100'
  };
  
  return classes[status] || '';
};
