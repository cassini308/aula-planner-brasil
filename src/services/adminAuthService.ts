
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

// Login do administrador (usando o mesmo sistema de autenticação do Supabase)
export const loginAdmin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Verificar se o usuário é um administrador
    const isAdmin = data.user.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      throw new Error("Acesso negado. Esta conta não possui privilégios de administrador.");
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Erro ao fazer login como admin:", error);
    toast({
      variant: "destructive",
      title: "Falha no login",
      description: error.message || "Não foi possível fazer login. Verifique suas credenciais."
    });
    return { success: false, error };
  }
};

// Registrar um administrador (função que seria usada somente uma vez ou por um super admin)
export const registrarAdmin = async (email: string, password: string) => {
  try {
    // Criar o usuário no auth do Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin'
        }
      }
    });
    
    if (authError) throw authError;
    
    return { success: true, data: authData };
  } catch (error: any) {
    console.error("Erro ao registrar admin:", error);
    toast({
      variant: "destructive",
      title: "Falha no registro",
      description: error.message || "Não foi possível criar a conta de administrador."
    });
    return { success: false, error };
  }
};

// Verificar se o usuário atual é um administrador
export const verificarAdminAutenticado = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      return { autenticado: false };
    }
    
    // Verificar nas metadata do usuário se ele tem a role 'admin'
    const isAdmin = sessionData.session.user.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      return { autenticado: false };
    }
    
    return { 
      autenticado: true, 
      admin: {
        id: sessionData.session.user.id,
        email: sessionData.session.user.email,
        role: 'admin'
      }
    };
  } catch (error) {
    console.error("Erro ao verificar autenticação de admin:", error);
    return { autenticado: false, error };
  }
};

// Usar a mesma função logout para ambos os tipos de usuário
export { logout } from "./authService";
