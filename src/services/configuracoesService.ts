
import { supabase } from "@/integrations/supabase/client";

export interface ConfiguracoesSite {
  id?: string;
  nomeEscola: string;
  logoUrl?: string;
}

const TABELA = 'configuracoes_site';

// Buscar as configurações do site
export const getConfiguracoesSite = async (): Promise<ConfiguracoesSite | null> => {
  try {
    // Buscar a primeira configuração (deve haver apenas uma)
    const { data, error } = await supabase
      .from(TABELA)
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data as ConfiguracoesSite;
  } catch (error) {
    console.error("Erro ao buscar configurações do site:", error);
    return null;
  }
};

// Salvar ou atualizar as configurações do site
export const salvarConfiguracoesSite = async (configuracoes: ConfiguracoesSite): Promise<boolean> => {
  try {
    // Verificar se já existem configurações
    const configExistente = await getConfiguracoesSite();

    if (configExistente?.id) {
      // Atualizar configurações existentes
      const { error } = await supabase
        .from(TABELA)
        .update({
          nomeEscola: configuracoes.nomeEscola,
          logoUrl: configuracoes.logoUrl || null
        })
        .eq('id', configExistente.id);

      if (error) throw error;
    } else {
      // Criar novas configurações
      const { error } = await supabase
        .from(TABELA)
        .insert({
          nomeEscola: configuracoes.nomeEscola,
          logoUrl: configuracoes.logoUrl || null
        });

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error("Erro ao salvar configurações do site:", error);
    throw error;
  }
};

// Upload de logo
export const uploadLogo = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;
    
    // Upload do arquivo
    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Obter a URL pública do arquivo
    const { data } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error("Erro ao fazer upload da logo:", error);
    return null;
  }
};
