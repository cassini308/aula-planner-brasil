
import React, { useEffect, useState } from 'react';
import FormularioAula from '@/components/FormularioAula';
import ListaAulas from '@/components/ListaAulas';
import ConfirmacaoExclusao from '@/components/ConfirmacaoExclusao';
import { Aula, AulaFormData } from '@/types/aula';
import { 
  getAulas, 
  adicionarAula, 
  atualizarAula, 
  excluirAula 
} from '@/services/aulaService';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Book, CreditCard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from 'react-router-dom';
import Alunos from './Alunos';
import Mensalidades from './Mensalidades';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [aulaParaEditar, setAulaParaEditar] = useState<Aula | null>(null);
  const [aulaParaExcluir, setAulaParaExcluir] = useState<Aula | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('aulas');

  // Carregar aulas do banco de dados ao iniciar
  useEffect(() => {
    carregarAulas();
  }, []);

  const carregarAulas = async () => {
    setLoading(true);
    try {
      const aulasCarregadas = await getAulas();
      setAulas(aulasCarregadas);
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

  const handleCancelarEdicao = () => {
    setAulaParaEditar(null);
  };

  const handleExcluir = (id: string) => {
    const aulaParaExcluir = aulas.find(a => a.id === id);
    if (aulaParaExcluir) {
      setAulaParaExcluir(aulaParaExcluir);
    }
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
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível excluir a aula.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erro ao excluir aula:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir a aula.",
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-aula-blue text-white py-6 shadow-md">
        <div className="container mx-auto px-4 flex items-center space-x-3">
          <Book size={32} />
          <h1 className="text-3xl font-bold">Aula Planner Brasil</h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="aulas" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="aulas">Aulas</TabsTrigger>
              <TabsTrigger value="alunos">Alunos</TabsTrigger>
              <TabsTrigger value="mensalidades" className="flex items-center gap-2">
                <CreditCard size={16} />
                <span>Mensalidades</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="aulas">
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
                    onCancelarEdicao={handleCancelarEdicao}
                  />
                </div>
              </section>
              
              <Separator className="my-8" />
              
              <section>
                <div className="bg-white rounded-lg shadow-md">
                  <ListaAulas 
                    aulas={aulas}
                    onEditar={handleEditar}
                    onExcluir={handleExcluir}
                  />
                </div>
              </section>
              
              {/* Diálogo de confirmação de exclusão */}
              <ConfirmacaoExclusao
                aberto={!!aulaParaExcluir}
                aulaName={aulaParaExcluir?.nome || ''}
                onConfirmar={confirmarExclusao}
                onCancelar={cancelarExclusao}
              />
            </TabsContent>

            <TabsContent value="alunos">
              <Alunos />
            </TabsContent>
            
            <TabsContent value="mensalidades">
              <Mensalidades />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="mt-12 py-6 bg-gray-100 text-center text-gray-600">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Aula Planner Brasil - Sistema de Cadastro de Aulas e Alunos</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
