
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Users, BookOpen, Calendar, CreditCard, Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { verificarAdminAutenticado, logout } from '@/services/adminAuthService';
import { Link } from 'react-router-dom';

const PainelAdmin = () => {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('dashboard');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Verificar autenticação
        const { autenticado, admin, error } = await verificarAdminAutenticado();
        
        if (!autenticado || !admin) {
          toast({
            title: "Acesso negado",
            description: "Você precisa estar logado como administrador para acessar esta página",
            variant: "destructive"
          });
          navigate('/login-admin');
          return;
        }
        
        setAdmin(admin);
      } catch (error) {
        console.error("Erro ao carregar dados do administrador:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar seus dados. Por favor, tente novamente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();
  }, [toast, navigate]);
  
  const handleLogout = async () => {
    const { success } = await logout();
    if (success) {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso"
      });
      navigate('/login-admin');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Carregando dados do administrador...</p>
        </div>
      </div>
    );
  }
  
  if (!admin) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-gray-500">Sessão de administrador não encontrada</p>
          <Link to="/login-admin">
            <Button variant="link" className="mt-2">Voltar para o login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut size={16} /> Sair
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="bg-blue-50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Administrador</CardTitle>
            <CardDescription>
              {admin.email} • Acesso total ao sistema
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="dashboard" className="flex items-center">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="alunos" className="flex items-center">
            <Users size={16} className="mr-2" /> Alunos
          </TabsTrigger>
          <TabsTrigger value="aulas" className="flex items-center">
            <BookOpen size={16} className="mr-2" /> Aulas
          </TabsTrigger>
          <TabsTrigger value="agenda" className="flex items-center">
            <Calendar size={16} className="mr-2" /> Agenda
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="flex items-center">
            <CreditCard size={16} className="mr-2" /> Financeiro
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral</CardTitle>
              <CardDescription>Resumo das atividades do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/alunos" className="w-full">
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Users className="w-5 h-5 mr-2" /> Gerenciar Alunos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Cadastro, edição e gerenciamento completo dos alunos
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/aulas" className="w-full">
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" /> Gerenciar Aulas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Configuração das aulas, valores e modalidades
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/agenda" className="w-full">
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="w-5 h-5 mr-2" /> Agenda
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Gerenciamento dos horários e agendamentos
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/mensalidades" className="w-full">
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" /> Mensalidades
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Controle financeiro e gerenciamento de pagamentos
                      </p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/avisos" className="w-full">
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Bell className="w-5 h-5 mr-2" /> Avisos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Criação e gerenciamento de avisos para os alunos
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alunos">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Alunos</CardTitle>
              <CardDescription>
                <Link to="/alunos">
                  <Button variant="link" className="p-0">Ir para a página de Alunos →</Button>
                </Link>
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        
        <TabsContent value="aulas">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Aulas</CardTitle>
              <CardDescription>
                <Link to="/aulas">
                  <Button variant="link" className="p-0">Ir para a página de Aulas →</Button>
                </Link>
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        
        <TabsContent value="agenda">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Agenda</CardTitle>
              <CardDescription>
                <Link to="/agenda">
                  <Button variant="link" className="p-0">Ir para a página de Agenda →</Button>
                </Link>
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        
        <TabsContent value="financeiro">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento Financeiro</CardTitle>
              <CardDescription>
                <Link to="/mensalidades">
                  <Button variant="link" className="p-0">Ir para a página de Mensalidades →</Button>
                </Link>
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PainelAdmin;
