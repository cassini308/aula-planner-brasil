
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Aluno, Aula } from '@/types/aula';
import { getAulas } from '@/services/aulaService';
import { adicionarMatricula, verificarMatriculaExistente } from '@/services/matriculaService';
import { AlertCircle, CheckCircle2, SchoolIcon, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MatricularAlunoProps {
  aluno: Aluno;
  onSuccess?: () => void;
}

const MatricularAluno: React.FC<MatricularAlunoProps> = ({ aluno, onSuccess }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [aulaId, setAulaId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (dialogOpen) {
      loadAulas();
      setAulaId('');
      setError(null);
      setSuccess(false);
    }
  }, [dialogOpen]);

  const loadAulas = async () => {
    setLoading(true);
    try {
      const aulasDisponiveis = await getAulas();
      setAulas(aulasDisponiveis);
    } catch (error) {
      console.error("Erro ao carregar aulas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as aulas disponíveis.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMatricular = async () => {
    if (!aulaId) {
      setError("Selecione uma aula para matricular o aluno.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verificar se já existe matrícula ativa para este aluno nesta aula
      const matriculaExistente = await verificarMatriculaExistente(aluno.id, aulaId);
      
      if (matriculaExistente) {
        setError("Este aluno já está matriculado nesta aula.");
        return;
      }

      // Criar matrícula
      const novaMatricula = await adicionarMatricula({
        aluno_id: aluno.id,
        aula_id: aulaId
      });

      if (novaMatricula) {
        setSuccess(true);
        toast({
          title: "Matrícula realizada",
          description: `${aluno.nome} foi matriculado com sucesso!`,
        });
        
        // Fechar o diálogo após um breve momento
        setTimeout(() => {
          setDialogOpen(false);
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        setError("Não foi possível realizar a matrícula. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao matricular aluno:", error);
      setError("Ocorreu um erro ao processar a matrícula. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline"
        size="sm" 
        onClick={() => setDialogOpen(true)}
        className="text-aula-blue hover:text-aula-blue hover:bg-blue-50 flex gap-1 items-center"
      >
        <BookOpen className="h-4 w-4" />
        <span>Matricular</span>
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-aula-blue">
              <BookOpen className="h-5 w-5" />
              Matricular Aluno
            </DialogTitle>
            <DialogDescription>
              Selecione uma aula para matricular <strong>{aluno.nome}</strong>
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-2 bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Matrícula realizada com sucesso!</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="aula" className="text-sm font-medium">
                Aula / Curso
              </label>
              <Select
                disabled={loading || success}
                value={aulaId}
                onValueChange={setAulaId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma aula" />
                </SelectTrigger>
                <SelectContent>
                  {aulas.length === 0 ? (
                    <SelectItem value="no-options" disabled>
                      Nenhuma aula disponível
                    </SelectItem>
                  ) : (
                    aulas.map((aula) => (
                      <SelectItem key={aula.id} value={aula.id}>
                        {aula.nome} - R$ {aula.valor.toLocaleString('pt-BR', {minimumFractionDigits: 2})} ({aula.periodicidade})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={loading || success}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleMatricular} 
              disabled={!aulaId || loading || success}
              className={loading ? "opacity-80" : ""}
            >
              {loading ? "Processando..." : "Matricular"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatricularAluno;
