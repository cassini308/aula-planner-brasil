
import React, { useState, useEffect } from 'react';
import FormularioAula from '@/components/FormularioAula';
import ListaAulas from '@/components/ListaAulas';
import { ConfirmacaoExclusao } from '@/components/ConfirmacaoExclusao';
import { Aula, AulaFormData } from '@/types/aula';
import { getAulas, adicionarAula, atualizarAula, excluirAula } from '@/services/aulaService';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Aulas = () => {
  const { toast } = useToast();
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [aulasFiltradas, setAulasFiltradas] = useState<Aula[]>([]);
  const [aulaParaEditar, setAulaParaEditar] = useState<Aula | null>(null);
  const [aulaParaExcluir, setAulaParaExcluir] = useState<Aula | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Carregar aulas do banco de dados ao iniciar
  useEffect(() => {
    carregarAulas();
  }, []);

  // Filtrar aulas quando o termo de pesquisa mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setAulasFiltradas(aulas);
    } else {
      const termoBusca = searchTerm.toLowerCase();
      const filtradas = aulas.filter(
        aula => aula.nome.toLowerCase().includes(termoBusca)
      );
      setAulasFiltradas(filtradas);
    }
  }, [searchTerm, aulas]);

  const carregarAulas = async () => {
    setLoading(true);
    try {
      const aulasCarregadas = await getAulas();
      setAulas(aulasCarregadas);
      setAulasFiltradas(aulasCarregadas);
    } catch (error) {
      console.error("Erro ao carregar aulas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de aulas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async (formData: AulaFormData) => {
    try {
      if (aulaParaEditar) {
        // Editar aula existente
        const aulaAtualizada = await atualizarAula(aulaParaEditar.id, formData);
        if (aulaAtualizada) {
          setAulas(aulas.map(a => a.id === aulaParaEditar.id ? aulaAtualizada : a));
          setAulaParaEditar(null);
          toast({
            title: "Aula atualizada",
            description: `${formData.nome} foi atualizada com sucesso!`,
          });
        }
      } else {
        // Adicionar nova aula
        const novaAula = await adicionarAula(formData);
        if (novaAula) {
          setAulas([...aulas, novaAula]);
          toast({
            title: "Aula adicionada",
            description: `${formData.nome} foi adicionada com sucesso!`,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao salvar aula:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a aula.",
        variant: "destructive"
      });
    }
  };

  const handleEditar = (aula: Aula) => {
    setAulaParaEditar(aula);
    // Rolar para o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExcluir = (id: string) => {
    const aulaParaExcluir = aulas.find(a => a.id === id);
    if (aulaParaExcluir) {
      setAulaParaExcluir(aulaParaExcluir);
    }
  };

  const handleCancelarEdicao = () => {
    setAulaParaEditar(null);
  };

  const confirmarExclusao = async () => {
    if (aulaParaExcluir) {
      try {
        const sucesso = await excluirAula(aulaParaExcluir.id);
        if (sucesso) {
          setAulas(aulas.filter(a => a.id !== aulaParaExcluir.id));
          toast({
            title: "Aula excluída",
            description: `${aulaParaExcluir.nome} foi removida com sucesso!`,
          });
        }
      } catch (error) {
        console.error("Erro ao excluir aula:", error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir a aula.",
          variant: "destructive"
        });
      } finally {
        setAulaParaExcluir(null);
      }
    }
  };

  const cancelarExclusao = () => {
    setAulaParaExcluir(null);
  };

  return (
    <div className="container mx-auto px-4">
      <section className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {aulaParaEditar ? "Editar Aula" : "Cadastro de Aulas"}
          </h2>
          <p className="text-gray-600">
            {aulaParaEditar 
              ? "Atualize os detalhes da aula selecionada." 
              : "Preencha os detalhes para cadastrar uma nova aula."
            }
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <FormularioAula
            onSalvar={handleSalvar}
            aulaParaEditar={aulaParaEditar}
            onCancelar={handleCancelarEdicao}
          />
        </div>
      </section>
      
      <Separator className="my-8" />
      
      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Lista de Aulas</h2>
            <p className="text-gray-600">
              {loading ? "Carregando aulas..." : 
                `${aulasFiltradas.length} ${aulasFiltradas.length === 1 ? 'aula encontrada' : 'aulas encontradas'}`
              }
            </p>
          </div>
          
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar aulas..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <ListaAulas
            aulas={aulasFiltradas}
            onEditar={handleEditar}
            onExcluir={handleExcluir}
          />
        </div>
      </section>
      
      {/* Diálogo de confirmação de exclusão */}
      <ConfirmacaoExclusao
        aberto={!!aulaParaExcluir}
        titulo="Excluir Aula"
        mensagem={`Tem certeza que deseja excluir a aula "${aulaParaExcluir?.nome}"? Esta ação não pode ser desfeita.`}
        onConfirmar={confirmarExclusao}
        onCancelar={cancelarExclusao}
      />
    </div>
  );
};

export default Aulas;
