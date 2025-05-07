
import React, { useState } from 'react';
import { Aluno } from '@/types/aula';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pencil, Trash2, BookOpen } from 'lucide-react';
import { formatarCpf, formatarTelefone, formatarData } from '@/services/alunoService';
import MatricularAluno from './MatricularAluno';

interface ListaAlunosProps {
  alunos?: Aluno[];
  onEditar?: (aluno: Aluno) => void;
  onExcluir?: (id: string) => void;
  onMatricular?: (aluno: Aluno) => void;
}

const ListaAlunos: React.FC<ListaAlunosProps> = ({ 
  alunos = [], 
  onEditar = () => {}, 
  onExcluir = () => {}, 
  onMatricular = () => {} 
}) => {
  const [matriculaAtualizada, setMatriculaAtualizada] = useState<boolean>(false);

  const handleMatriculaSuccess = () => {
    setMatriculaAtualizada(!matriculaAtualizada);
    if (alunos.length > 0) {
      onMatricular(alunos[0]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-aula-blue">
          Alunos Cadastrados
        </CardTitle>
        <CardDescription>
          {alunos.length === 0 
            ? "Nenhum aluno cadastrado ainda." 
            : `Total de ${alunos.length} ${alunos.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alunos.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>Ainda não há alunos cadastrados.</p>
            <p>Use o formulário acima para adicionar um novo aluno.</p>
          </div>
        ) : (
          <ScrollArea className="w-full" style={{ maxHeight: '400px' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Data de Nascimento</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Menor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunos.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell>{aluno.cpf ? formatarCpf(aluno.cpf) : '-'}</TableCell>
                    <TableCell>{formatarData(aluno.data_nascimento)}</TableCell>
                    <TableCell>{aluno.telefone ? formatarTelefone(aluno.telefone) : '-'}</TableCell>
                    <TableCell>{aluno.menor_idade ? 'Sim' : 'Não'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditar(aluno)}
                          className="h-8 w-8 p-0 text-aula-blue hover:text-aula-blue hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onExcluir(aluno.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <MatricularAluno 
                          aluno={aluno}
                          onSuccess={handleMatriculaSuccess}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ListaAlunos;
