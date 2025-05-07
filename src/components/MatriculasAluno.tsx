
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Ban } from 'lucide-react';
import { Aluno, Matricula } from '@/types/aula';
import { getMatriculasByAlunoId, cancelarMatricula } from '@/services/matriculaService';
import { formatarData, formatarMoeda } from '@/services/alunoService';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface MatriculasAlunoProps {
  aluno: Aluno;
  onUpdate?: () => void;
}

const MatriculasAluno: React.FC<MatriculasAlunoProps> = ({ aluno, onUpdate }) => {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [matriculaParaCancelar, setMatriculaParaCancelar] = useState<Matricula | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMatriculas();
  }, [aluno.id]);

  const loadMatriculas = async () => {
    setLoading(true);
    try {
      const matriculasAluno = await getMatriculasByAlunoId(aluno.id);
      setMatriculas(matriculasAluno);
    } catch (error) {
      console.error("Erro ao carregar matrículas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as matrículas do aluno.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarMatricula = async () => {
    if (!matriculaParaCancelar) return;

    try {
      const sucesso = await cancelarMatricula(matriculaParaCancelar.id);
      
      if (sucesso) {
        setMatriculas(matriculas.map(m => 
          m.id === matriculaParaCancelar.id ? { ...m, ativa: false } : m
        ));
        
        toast({
          title: "Matrícula cancelada",
          description: `A matrícula em ${matriculaParaCancelar.aula?.nome} foi cancelada com sucesso.`,
        });
        
        if (onUpdate) onUpdate();
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível cancelar a matrícula. Tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao cancelar matrícula:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cancelar a matrícula.",
        variant: "destructive"
      });
    } finally {
      setMatriculaParaCancelar(null);
    }
  };

  return (
    <>
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-aula-blue flex items-center gap-2">
            <BookOpen size={20} />
            Matrículas do Aluno
          </CardTitle>
          <CardDescription>
            {matriculas.length === 0 
              ? "Este aluno não está matriculado em nenhuma aula." 
              : `Total de ${matriculas.length} ${matriculas.length === 1 ? 'matrícula' : 'matrículas'}.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-gray-500">
              Carregando matrículas...
            </div>
          ) : matriculas.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>Ainda não há matrículas para este aluno.</p>
              <p>Use o botão "Matricular" para adicionar este aluno a uma aula.</p>
            </div>
          ) : (
            <ScrollArea className="w-full" style={{ maxHeight: '300px' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aula</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Periodicidade</TableHead>
                    <TableHead>Data de Matrícula</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matriculas.map((matricula) => (
                    <TableRow key={matricula.id}>
                      <TableCell className="font-medium">{matricula.aula?.nome}</TableCell>
                      <TableCell>{matricula.aula ? formatarMoeda(matricula.aula.valor) : '-'}</TableCell>
                      <TableCell>{matricula.aula?.periodicidade}</TableCell>
                      <TableCell>{formatarData(matricula.data_matricula)}</TableCell>
                      <TableCell>
                        <Badge variant={matricula.ativa ? "outline" : "secondary"} className={matricula.ativa ? "bg-green-50 text-green-700" : ""}>
                          {matricula.ativa ? "Ativa" : "Cancelada"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {matricula.ativa && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMatriculaParaCancelar(matricula)}
                            className="h-8 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 flex gap-1 items-center"
                          >
                            <Ban className="h-4 w-4" />
                            <span>Cancelar</span>
                          </Button>
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

      <AlertDialog 
        open={!!matriculaParaCancelar} 
        onOpenChange={(open) => !open && setMatriculaParaCancelar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente cancelar a matrícula de <strong>{aluno.nome}</strong> em <strong>{matriculaParaCancelar?.aula?.nome}</strong>?
              <br/><br/>
              Esta ação não pode ser desfeita e mensalidades pendentes continuarão ativas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelarMatricula} className="bg-red-500 hover:bg-red-600">
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MatriculasAluno;
