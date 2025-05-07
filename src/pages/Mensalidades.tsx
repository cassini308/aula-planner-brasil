
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Mensalidade } from '@/types/aula';
import { 
  getMensalidades, 
  registrarPagamento, 
  getStatusMensalidadeClass,
  formatarStatusMensalidade
} from '@/services/mensalidadeService';
import { formatarData, formatarMoeda } from '@/services/alunoService';
import { CreditCard, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

const Mensalidades: React.FC = () => {
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processando, setProcessando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    carregarMensalidades();
  }, []);

  const carregarMensalidades = async () => {
    setLoading(true);
    setError(null);
    try {
      const mensalidadesCarregadas = await getMensalidades();
      setMensalidades(mensalidadesCarregadas);
    } catch (err) {
      console.error("Erro ao carregar mensalidades:", err);
      setError("Não foi possível carregar as mensalidades. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
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
                {loading ? 'Carregando...' : `Total: ${mensalidades.length} mensalidades`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-10 text-gray-500">
                  Carregando mensalidades...
                </div>
              ) : mensalidades.length === 0 ? (
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
                      {mensalidades.map((mensalidade) => (
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRegistrarPagamento(mensalidade.id)}
                                disabled={!!processando}
                                className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                              >
                                {processando === mensalidade.id ? "Processando..." : "Registrar Pagamento"}
                              </Button>
                            )}
                            
                            {mensalidade.status === 'pago' && (
                              <span className="text-green-600 text-sm font-semibold">Pago</span>
                            )}
                            
                            {mensalidade.status === 'atrasado' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRegistrarPagamento(mensalidade.id)}
                                disabled={!!processando}
                                className="bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                              >
                                {processando === mensalidade.id ? "Processando..." : "Registrar Pagamento"}
                              </Button>
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
    </div>
  );
};

export default Mensalidades;
