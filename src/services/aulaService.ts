
import { Aula, AulaFormData } from "../types/aula";

// Chave para armazenar aulas no localStorage
const AULAS_STORAGE_KEY = "aulas_cadastradas";

// Obter todas as aulas
export const getAulas = (): Aula[] => {
  const aulasString = localStorage.getItem(AULAS_STORAGE_KEY);
  if (!aulasString) return [];
  
  try {
    const aulas = JSON.parse(aulasString);
    // Convertendo strings de data em objetos Date
    return aulas.map((aula: any) => ({
      ...aula,
      dataCadastro: new Date(aula.dataCadastro)
    }));
  } catch (error) {
    console.error("Erro ao obter aulas:", error);
    return [];
  }
};

// Adicionar uma nova aula
export const adicionarAula = (aulaData: AulaFormData): Aula => {
  const aulas = getAulas();
  
  const novaAula: Aula = {
    ...aulaData,
    id: crypto.randomUUID(),
    dataCadastro: new Date()
  };
  
  const novaLista = [...aulas, novaAula];
  localStorage.setItem(AULAS_STORAGE_KEY, JSON.stringify(novaLista));
  
  return novaAula;
};

// Atualizar uma aula existente
export const atualizarAula = (id: string, aulaData: AulaFormData): Aula | null => {
  const aulas = getAulas();
  const aulaIndex = aulas.findIndex(a => a.id === id);
  
  if (aulaIndex === -1) return null;
  
  const aulaAtualizada: Aula = {
    ...aulas[aulaIndex],
    ...aulaData
  };
  
  aulas[aulaIndex] = aulaAtualizada;
  localStorage.setItem(AULAS_STORAGE_KEY, JSON.stringify(aulas));
  
  return aulaAtualizada;
};

// Excluir uma aula
export const excluirAula = (id: string): boolean => {
  const aulas = getAulas();
  const novaLista = aulas.filter(a => a.id !== id);
  
  if (novaLista.length === aulas.length) return false;
  
  localStorage.setItem(AULAS_STORAGE_KEY, JSON.stringify(novaLista));
  return true;
};

// Formatar valor monetário
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};
