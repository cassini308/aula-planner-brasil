
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
