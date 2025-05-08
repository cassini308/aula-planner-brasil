
import React, { useEffect, useState } from 'react';
import FormularioAluno from '@/components/FormularioAluno';
import ListaAlunos from '@/components/ListaAlunos';
import MatriculasAluno from '@/components/MatriculasAluno';
import ConfirmacaoExclusaoAluno from '@/components/ConfirmacaoExclusaoAluno';
import { Aluno, AlunoFormData, ResponsavelFormData } from '@/types/aula';
import { 
  getAlunos, 
  adicionarAluno, 
  atualizarAluno, 
  excluirAluno,
  getResponsavel 
} from '@/services/alunoService';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Alunos = () => {
  const { toast } = useToast();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunosFiltrados, setAlunosFiltrados] = useState<Aluno[]>([]);
  const [alunoParaEditar, setAlunoParaEditar] = useState<any | null>(null);
  const [alunoParaExcluir, setAlunoParaExcluir] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [matriculasAtualizadas, setMatriculasAtualizadas] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Carregar alunos do banco de dados ao iniciar
  useEffect(() => {
    carregarAlunos();
  }, []);

  // Filtrar alunos quando o termo de pesquisa mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setAlunosFiltrados(alunos);
    } else {
      const termoBusca = searchTerm.toLowerCase();
      const filtrados = alunos.filter(
        aluno => 
          aluno.nome.toLowerCase().includes(termoBusca) || 
          (aluno.email && aluno.email.toLowerCase().includes(termoBusca)) ||
          (aluno.cpf && aluno.cpf.includes(termoBusca))
      );
      setAlunosFiltrados(filtrados);
    }
  }, [searchTerm, alunos]);

  const carregarAlunos = async () => {
    setLoading(true);
    try {
      const alunosCarregados = await getAlunos();
      setAlunos(alunosCarregados);
      setAlunosFiltrados(alunosCarregados);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de alunos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async (formData: AlunoFormData, responsavelData?: ResponsavelFormData) => {
    try {
      if (alunoParaEditar) {
        // Editar aluno existente
        const alunoAtualizado = await atualizarAluno(alunoParaEditar.id, formData, responsavelData);
        if (alunoAtualizado) {
          setAlunos(alunos.map(a => a.id === alunoParaEditar.id ? alunoAtualizado : a));
          setAlunoParaEditar(null);
          toast({
            title: "Aluno atualizado",
            description: `${formData.nome} foi atualizado com sucesso!`,
          });
        }
      } else {
        // Adicionar novo aluno
        const novoAluno = await adicionarAluno(formData, responsavelData);
        if (novoAluno) {
          setAlunos([...alunos, novoAluno]);
          toast({
            title: "Aluno adicionado",
            description: `${formData.nome} foi adicionado com sucesso!`,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o aluno.",
        variant: "destructive"
      });
    }
  };

  const handleEditar = async (aluno: Aluno) => {
    try {
      // Se for menor de idade, busca os dados do responsável
      let responsavel = null;
      if (aluno.responsavel_id) {
        responsavel = await getResponsavel(aluno.responsavel_id);
      }

      setAlunoParaEditar({
        ...aluno,
        responsavel
      });
      
      // Rolar para o formulário
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Erro ao preparar edição:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados para edição.",
        variant: "destructive"
      });
    }
  };

  const handleCancelarEdicao = () => {
    setAlunoParaEditar(null);
  };

  const handleExcluir = (id: string) => {
    const alunoParaExcluir = alunos.find(a => a.id === id);
    if (alunoParaExcluir) {
      setAlunoParaExcluir(alunoParaExcluir);
    }
  };

  const confirmarExclusao = async () => {
    if (alunoParaExcluir) {
      try {
        const sucesso = await excluirAluno(alunoParaExcluir.id);
        
        if (sucesso) {
          setAlunos(alunos.filter(a => a.id !== alunoParaExcluir.id));
          toast({
            title: "Aluno excluído",
            description: `${alunoParaExcluir.nome} foi removido com sucesso!`,
          });
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível excluir o aluno.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erro ao excluir aluno:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o aluno.",
          variant: "destructive"
        });
      } finally {
        setAlunoParaExcluir(null);
      }
    }
  };

  const cancelarExclusao = () => {
    setAlunoParaExcluir(null);
  };

  const handleMatriculaAtualizada = () => {
    setMatriculasAtualizadas(!matriculasAtualizadas);
  };

  return (
    <div className="container mx-auto px-4">
      <section className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {alunoParaEditar ? "Editar Aluno" : "Cadastro de Alunos"}
          </h2>
          <p className="text-gray-600">
            {alunoParaEditar 
              ? "Atualize os detalhes do aluno selecionado." 
              : "Preencha os detalhes para cadastrar um novo aluno."
            }
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <FormularioAluno 
            onSalvar={handleSalvar}
            alunoParaEditar={alunoParaEditar}
            onCancelarEdicao={handleCancelarEdicao}
          />
        </div>

        {alunoParaEditar && (
          <MatriculasAluno 
            aluno={alunoParaEditar}
            onUpdate={handleMatriculaAtualizada}
          />
        )}
      </section>
      
      <Separator className="my-8" />
      
      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Lista de Alunos</h2>
            <p className="text-gray-600">
              {loading ? "Carregando alunos..." : 
                `${alunosFiltrados.length} ${alunosFiltrados.length === 1 ? 'aluno encontrado' : 'alunos encontrados'}`
              }
            </p>
          </div>
          
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar alunos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <ListaAlunos 
            alunos={alunosFiltrados}
            onEditar={handleEditar}
            onExcluir={handleExcluir}
            onMatricular={handleMatriculaAtualizada}
          />
        </div>
      </section>
      
      {/* Diálogo de confirmação de exclusão */}
      <ConfirmacaoExclusaoAluno
        aberto={!!alunoParaExcluir}
        alunoName={alunoParaExcluir?.nome || ''}
        onConfirmar={confirmarExclusao}
        onCancelar={cancelarExclusao}
      />
    </div>
  );
};

export default Alunos;
