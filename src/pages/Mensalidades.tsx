import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Mensalidade } from '@/types/aula';
import { 
  getMensalidades, 
  registrarPagamento, 
  cancelarMensalidade,
  atualizarValorMensalidade,
  getStatusMensalidadeClass,
  formatarStatusMensalidade
} from '@/services/mensalidadeService';
import { formatarData, formatarMoeda } from '@/services/alunoService';
import { getAlunos } from '@/services/alunoService';
import { CreditCard, ChevronDown, CheckCircle2, AlertCircle, Search, Edit2, XCircle, MoreVertical } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ConfirmacaoExclusao } from '@/components/ConfirmacaoExclusao';

const Mensalidades: React.FC = () => {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [mensalidadesFiltradas, setMensalidadesFiltradas] = useState<Mensalidade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processando, setProcessando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [alunoFilter, setAlunoFilter] = useState<string>('todos');
  const [alunos, setAlunos] = useState<{id: string, nome: string}[]>([]);
  const { toast } = useToast();
  
  // Estados para o modal de edição de valor
  const [editarModalAberto, setEditarModalAberto] = useState(false);
  const [mensalidadeSelecionada, setMensalidadeSelecionada] = useState<Mensalidade | null>(null);
  const [novoValor, setNovoValor] = useState<string>('');
  
  // Estado para o modal de confirmação de cancelamento
  const [cancelarModalAberto, setCancelarModalAberto] = useState(false);

  useEffect(() => {
    carregarMensalidades();
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      const alunosData = await getAlunos();
      setAlunos(alunosData.map(a => ({ id: a.id, nome: a.nome })));
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
    }
  };

  const carregarMensalidades = async () => {
    setLoading(true);
    setError(null);
    try {
      const mensalidadesCarregadas = await getMensalidades();
      setMensalidades(mensalidadesCarregadas);
      setMensalidadesFiltradas(mensalidadesCarregadas);
    } catch (err) {
      console.error("Erro ao carregar mensalidades:", err);
      setError("Não foi possível carregar as mensalidades. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filtrarMensalidades();
  }, [searchTerm, alunoFilter, mensalidades]);

  const filtrarMensalidades = () => {
    let filtradas = [...mensalidades];
    
    // Filtrar por aluno
    if (alunoFilter !== 'todos') {
      filtradas = filtradas.filter(m => 
        m.matricula?.aluno_id === alunoFilter
      );
    }
    
    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      const termo = searchTerm.toLowerCase();
      filtradas = filtradas.filter(m => 
        m.matricula?.aluno?.nome?.toLowerCase().includes(termo) || 
        m.matricula?.aula?.nome?.toLowerCase().includes(termo)
      );
    }
    
    setMensalidadesFiltradas(filtradas);
  };

  const handleRegistrarPagamento = async (mensalidadeId: string) => {
    setProcessando(mensalidadeId);
    setError(null);
    setSuccess(null);
    
    try {
      const mensalidadeAtualizada = await registrarPagamento(mensalidadeId);
      
      if (mensalidadeAtualizada) {
        // Recarregar a lista de mensalidades
        await carregarMensalidades();
        
        setSuccess(`Pagamento registrado com sucesso!`);
        toast({
          title: "Pagamento registrado",
          description: "O pagamento foi registrado e uma nova mensalidade foi gerada.",
        });
      } else {
        setError("Não foi possível registrar o pagamento. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao registrar pagamento:", err);
      setError("Ocorreu um erro ao processar o pagamento. Tente novamente.");
    } finally {
      setProcessando(null);
    }
  };

  // Funções para editar o valor da mensalidade
  const abrirModalEditar = (mensalidade: Mensalidade) => {
    setMensalidadeSelecionada(mensalidade);
    setNovoValor(mensalidade.valor.toString());
    setEditarModalAberto(true);
  };
  
  const handleEditarValor = async () => {
    if (!mensalidadeSelecionada) return;
    
    const valor = parseFloat(novoValor.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, informe um valor válido maior que zero.",
        variant: "destructive"
      });
      return;
    }
    
    setProcessando(mensalidadeSelecionada.id);
    
    try {
      const mensalidadeAtualizada = await atualizarValorMensalidade(
        mensalidadeSelecionada.id,
        valor
      );
      
      if (mensalidadeAtualizada) {
        await carregarMensalidades();
        toast({
          title: "Valor atualizado",
          description: `Valor da mensalidade atualizado para ${formatarMoeda(valor)}.`,
        });
        setEditarModalAberto(false);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o valor da mensalidade.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Erro ao atualizar valor:", err);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o valor da mensalidade.",
        variant: "destructive"
      });
    } finally {
      setProcessando(null);
    }
  };
  
  // Funções para cancelar mensalidade
  const abrirModalCancelar = (mensalidade: Mensalidade) => {
    setMensalidadeSelecionada(mensalidade);
    setCancelarModalAberto(true);
  };
  
  const handleCancelarMensalidade = async () => {
    if (!mensalidadeSelecionada) return;
    
    setProcessando(mensalidadeSelecionada.id);
    
    try {
      const mensalidadeCancelada = await cancelarMensalidade(mensalidadeSelecionada.id);
      
      if (mensalidadeCancelada) {
        await carregarMensalidades();
        toast({
          title: "Mensalidade cancelada",
          description: "A mensalidade foi cancelada com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível cancelar a mensalidade. Se já estiver paga, não pode ser cancelada.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Erro ao cancelar mensalidade:", err);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cancelar a mensalidade.",
        variant: "destructive"
      });
    } finally {
      setProcessando(null);
      setCancelarModalAberto(false);
    }
  };

  return (
    <div>
      <section className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <CreditCard size={24} />
            Gestão de Mensalidades
          </h2>
          <p className="text-gray-600">
            Gerencie os pagamentos de mensalidades dos alunos.
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white rounded-lg shadow-md">
          <Card>
            <CardHeader>
              <CardTitle>Mensalidades</CardTitle>
              <CardDescription>
                {loading ? 'Carregando...' : `Total: ${mensalidadesFiltradas.length} mensalidades`}
              </CardDescription>
              
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar mensalidades..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="w-full md:w-64">
                  <Select value={alunoFilter} onValueChange={setAlunoFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os alunos</SelectItem>
                      {alunos.map(aluno => (
                        <SelectItem key={aluno.id} value={aluno.id}>{aluno.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-10 text-gray-500">
                  Carregando mensalidades...
                </div>
              ) : mensalidadesFiltradas.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>Nenhuma mensalidade encontrada.</p>
                  <p>Matricule alunos para gerar mensalidades.</p>
                </div>
              ) : (
                <ScrollArea className="w-full" style={{ maxHeight: '600px' }}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Aula</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mensalidadesFiltradas.map((mensalidade) => (
                        <TableRow key={mensalidade.id}>
                          <TableCell className="font-medium">
                            {mensalidade.matricula?.aluno?.nome || "—"}
                          </TableCell>
                          <TableCell>
                            {mensalidade.matricula?.aula?.nome || "—"}
                          </TableCell>
                          <TableCell>
                            {formatarData(mensalidade.data_vencimento)}
                          </TableCell>
                          <TableCell>
                            {formatarMoeda(mensalidade.valor)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusMensalidadeClass(mensalidade.status)}>
                              {formatarStatusMensalidade(mensalidade.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {mensalidade.data_pagamento 
                              ? formatarData(mensalidade.data_pagamento) 
                              : "Não pago"}
                          </TableCell>
                          <TableCell className="text-right">
                            {mensalidade.status === 'pendente' && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRegistrarPagamento(mensalidade.id)}
                                  disabled={!!processando}
                                  className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                                >
                                  {processando === mensalidade.id ? "Processando..." : "Registrar Pagamento"}
                                </Button>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => abrirModalEditar(mensalidade)}>
                                      <Edit2 className="mr-2 h-4 w-4" />
                                      Editar Valor
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => abrirModalCancelar(mensalidade)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Cancelar Mensalidade
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                            
                            {mensalidade.status === 'pago' && (
                              <span className="text-green-600 text-sm font-semibold">Pago</span>
                            )}
                            
                            {mensalidade.status === 'atrasado' && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRegistrarPagamento(mensalidade.id)}
                                  disabled={!!processando}
                                  className="bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                                >
                                  {processando === mensalidade.id ? "Processando..." : "Registrar Pagamento"}
                                </Button>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => abrirModalEditar(mensalidade)}>
                                      <Edit2 className="mr-2 h-4 w-4" />
                                      Editar Valor
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => abrirModalCancelar(mensalidade)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Cancelar Mensalidade
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                            
                            {mensalidade.status === 'cancelado' && (
                              <span className="text-gray-500 text-sm">Cancelado</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Modal para editar valor da mensalidade */}
      <Dialog open={editarModalAberto} onOpenChange={setEditarModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Valor da Mensalidade</DialogTitle>
            <DialogDescription>
              Aluno: {mensalidadeSelecionada?.matricula?.aluno?.nome}<br />
              Aula: {mensalidadeSelecionada?.matricula?.aula?.nome}<br />
              Vencimento: {mensalidadeSelecionada ? formatarData(mensalidadeSelecionada.data_vencimento) : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Novo valor</Label>
              <Input
                id="valor"
                type="text"
                placeholder="0,00"
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditarModalAberto(false)}
              disabled={!!processando}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleEditarValor}
              disabled={!!processando}
            >
              {processando === mensalidadeSelecionada?.id ? "Atualizando..." : "Atualizar Valor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de confirmação para cancelar mensalidade */}
      <ConfirmacaoExclusao
        aberto={cancelarModalAberto}
        titulo="Cancelar Mensalidade"
        mensagem={`Tem certeza que deseja cancelar a mensalidade do aluno ${mensalidadeSelecionada?.matricula?.aluno?.nome} com vencimento em ${mensalidadeSelecionada ? formatarData(mensalidadeSelecionada.data_vencimento) : ''}?`}
        onConfirmar={handleCancelarMensalidade}
        onCancelar={() => setCancelarModalAberto(false)}
      />
    </div>
  );
};

export default Mensalidades;
