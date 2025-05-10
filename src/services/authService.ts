
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Login do aluno
export const loginAluno = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);
    toast({
      variant: "destructive",
      title: "Falha no login",
      description: error.message || "Não foi possível fazer login. Verifique suas credenciais."
    });
    return { success: false, error };
  }
};

// Registrar ou vincular um aluno a uma conta de usuário
export const registrarAluno = async (email: string, password: string, alunoId: string) => {
  try {
    // Primeiro, cria o usuário no auth do Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          aluno_id: alunoId
        }
      }
    });
    
    if (authError) throw authError;
    
    // Atualiza o registro do aluno com o email e vincula ao usuário criado
    const { error: updateError } = await supabase
      .from('alunos')
      .update({ email })
      .eq('id', alunoId);
    
    if (updateError) throw updateError;
    
    return { success: true, data: authData };
  } catch (error: any) {
    console.error("Erro ao registrar aluno:", error);
    toast({
      variant: "destructive",
      title: "Falha no registro",
      description: error.message || "Não foi possível criar a conta."
    });
    return { success: false, error };
  }
};

// Alteração de senha do aluno
export const alterarSenhaAluno = async (password: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao alterar senha:", error);
    toast({
      variant: "destructive",
      title: "Falha na alteração de senha",
      description: error.message || "Não foi possível alterar a senha."
    });
    return { success: false, error };
  }
};

// Logout
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao fazer logout:", error);
    toast({
      variant: "destructive",
      title: "Falha ao sair",
      description: error.message || "Não foi possível fazer logout."
    });
    return { success: false, error };
  }
};

// Verificar se o usuário está autenticado e obter os dados do aluno
export const verificarAutenticacao = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      return { autenticado: false };
    }
    
    const alunoId = sessionData.session.user.user_metadata?.aluno_id;
    
    if (!alunoId) {
      return { autenticado: false };
    }
    
    const { data: alunoData, error: alunoError } = await supabase
      .from('alunos')
      .select('*')
      .eq('id', alunoId)
      .single();
    
    if (alunoError) throw alunoError;
    
    return { 
      autenticado: true, 
      aluno: {
        ...alunoData,
        data_nascimento: new Date(alunoData.data_nascimento),
        data_cadastro: new Date(alunoData.data_cadastro)
      }
    };
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return { autenticado: false, error };
  }
};
