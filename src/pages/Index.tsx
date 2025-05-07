
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ListaAlunos from "@/components/ListaAlunos";
import ListaAulas from "@/components/ListaAulas";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarCheck, List, Calendar, UserPlus, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { getAlunos } from "@/services/alunoService";
import { getAulas } from "@/services/aulaService";
import { Aluno } from "@/types/aula";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const { toast } = useToast();
  const [alunos, setAlunos] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega dados ao iniciar a página
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const [dadosAlunos, dadosAulas] = await Promise.all([
          getAlunos(),
          getAulas()
        ]);
        setAlunos(dadosAlunos);
        setAulas(dadosAulas);
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados. Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [toast]);

  // Funções placeholder que redirecionam para as páginas específicas
  const handleEditarAluno = (aluno) => {
    window.location.href = "/alunos"; // Redireciona para a página de alunos
  };

  const handleExcluirAluno = (id) => {
    toast({
      title: "Funcionalidade indisponível",
      description: "Acesse a página de alunos para gerenciar os registros.",
    });
  };

  const handleEditarAula = (aula) => {
    toast({
      title: "Funcionalidade indisponível",
      description: "Acesse a página de aulas para gerenciar os registros.",
    });
  };

  const handleExcluirAula = (id) => {
    toast({
      title: "Funcionalidade indisponível",
      description: "Acesse a página de aulas para gerenciar os registros.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Sistema de Gestão de Aulas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/alunos">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Cadastro de Alunos
              </CardTitle>
              <CardDescription>
                Gerencie os cadastros de alunos
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/agenda">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agenda Semanal
              </CardTitle>
              <CardDescription>
                Visualize e gerencie os horários das aulas
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/mensalidades">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                Mensalidades
              </CardTitle>
              <CardDescription>
                Gerencie as mensalidades dos alunos
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Alunos</span>
              <Link to="/alunos">
                <Button size="sm" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Cadastrar Novo
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Gerenciamento de alunos cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListaAlunos 
              alunos={alunos} 
              onEditar={handleEditarAluno} 
              onExcluir={handleExcluirAluno}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Aulas</span>
              <Link to="/aulas">
                <Button size="sm" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Cadastrar Nova
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Gerenciamento de aulas disponíveis no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListaAulas 
              aulas={aulas} 
              onEditar={handleEditarAula} 
              onExcluir={handleExcluirAula}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
