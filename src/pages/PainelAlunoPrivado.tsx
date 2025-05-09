
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { User, MessageSquare, CreditCard, Calendar, Clock, Bell, LogOut } from 'lucide-react';
import { Aluno } from '@/types/aula';
import { verificarAutenticacao, logout } from '@/services/authService';
import { getMensalidadesByAluno, formatarStatusMensalidade, getStatusMensalidadeClass } from '@/services/mensalidadeService';
import { getMatriculasByAlunoId } from '@/services/matriculaService';
import { getAgendamentosByAlunoId } from '@/services/agendaService';
import { formatarData, formatarMoeda } from '@/services/alunoService';
import { getAvisosByAlunoId } from '@/services/avisoService';
import { formatarTelefone, formatarCpf } from '@/services/alunoService';
import MatriculasAluno from '@/components/MatriculasAluno';

const PainelAlunoPrivado = () => {
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('dados');
  const [mensalidades, setMensalidades] = useState<any[]>([]);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [avisos, setAvisos] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Verificar autenticação
        const { autenticado, aluno, error } = await verificarAutenticacao();
        
        if (!autenticado || !aluno) {
          toast({
            title: "Acesso negado",
            description: "Você precisa estar logado para acessar esta página",
            variant: "destructive"
          });
          navigate('/login-aluno');
          return;
        }
        
        setAluno(aluno);
        
        // Carregar mensalidades
        const dadosMensalidades = await getMensalidadesByAluno(aluno.id);
        setMensalidades(dadosMensalidades);
        
        // Carregar agendamentos
        const dadosAgendamentos = await getAgendamentosByAlunoId(aluno.id);
        setAgendamentos(dadosAgendamentos);
        
        // Carregar avisos
        const dadosAvisos = await getAvisosByAlunoId(aluno.id);
        setAvisos(dadosAvisos);
      } catch (error) {
        console.error("Erro ao carregar dados do aluno:", error);
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
      navigate('/login-aluno');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Carregando seus dados...</p>
        </div>
      </div>
    );
  }
  
  if (!aluno) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-gray-500">Dados do aluno não encontrados</p>
          <Link to="/login-aluno">
            <Button variant="link" className="mt-2">Voltar para o login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meu Painel de Aluno</h1>
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut size={16} /> Sair
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="bg-blue-50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{aluno?.nome}</CardTitle>
            <CardDescription>
              {aluno?.email} {aluno?.telefone && `• ${formatarTelefone(aluno.telefone)}`}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="dados" className="flex items-center">
            <User size={16} className="mr-2" /> Meus Dados
          </TabsTrigger>
          <TabsTrigger value="matriculas" className="flex items-center">
            <MessageSquare size={16} className="mr-2" /> Matrículas
          </TabsTrigger>
          <TabsTrigger value="mensalidades" className="flex items-center">
            <CreditCard size={16} className="mr-2" /> Mensalidades
          </TabsTrigger>
          <TabsTrigger value="agenda" className="flex items-center">
            <Calendar size={16} className="mr-2" /> Minha Agenda
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dados">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>Suas informações cadastrais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-4">
                    <p className="font-medium text-gray-500">Nome completo</p>
                    <p>{aluno.nome}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-500">Data de nascimento</p>
                    <p>{formatarData(aluno.data_nascimento)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-500">CPF</p>
                    <p>{formatarCpf(aluno.cpf)}</p>
                  </div>
                  
                  {aluno.rg && (
                    <div className="mb-4">
                      <p className="font-medium text-gray-500">RG</p>
                      <p>{aluno.rg}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="mb-4">
                    <p className="font-medium text-gray-500">Email</p>
                    <p>{aluno.email || "Não informado"}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-500">Telefone</p>
                    <p>{aluno.telefone ? formatarTelefone(aluno.telefone) : "Não informado"}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-500">Endereço</p>
                    <p>{aluno.endereco || "Não informado"}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-500">Data de cadastro</p>
                    <p>{formatarData(aluno.data_cadastro)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="matriculas">
          {aluno && <MatriculasAluno aluno={aluno} showPainelLink={false} showCancelar={false} />}
        </TabsContent>
        
        <TabsContent value="mensalidades">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Mensalidades</CardTitle>
              <CardDescription>Histórico e status de pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
              {mensalidades.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma mensalidade registrada.
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aula</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Pagamento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mensalidades.map((mensalidade) => (
                        <TableRow key={mensalidade.id}>
                          <TableCell className="font-medium">
                            {mensalidade.matricula?.aula?.nome || "N/D"}
                          </TableCell>
                          <TableCell>{formatarMoeda(mensalidade.valor)}</TableCell>
                          <TableCell>{formatarData(mensalidade.data_vencimento)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusMensalidadeClass(mensalidade.status)}>
                              {formatarStatusMensalidade(mensalidade.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {mensalidade.data_pagamento 
                              ? formatarData(mensalidade.data_pagamento)
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agenda">
          <Card>
            <CardHeader>
              <CardTitle>Minha Agenda de Aulas</CardTitle>
              <CardDescription>Seus horários agendados</CardDescription>
            </CardHeader>
            <CardContent>
              {agendamentos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum horário agendado.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agendamentos.map((agendamento) => (
                    <Card key={agendamento.id} className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                          <p className="font-medium">
                            {agendamento.dia_semana_texto}
                          </p>
                        </div>
                        <div className="flex items-center mb-2">
                          <Clock className="mr-2 h-4 w-4 text-blue-600" />
                          <p>{agendamento.hora_texto}</p>
                        </div>
                        <div className="text-sm mt-2 font-medium text-blue-600">
                          {agendamento.aula?.nome}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PainelAlunoPrivado;
