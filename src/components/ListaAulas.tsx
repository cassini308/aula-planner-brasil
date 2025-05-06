
import React from 'react';
import { Aula } from '@/types/aula';
import { formatarMoeda } from '@/services/aulaService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pencil, Trash2 } from 'lucide-react';

interface ListaAulasProps {
  aulas: Aula[];
  onEditar: (aula: Aula) => void;
  onExcluir: (id: string) => void;
}

const ListaAulas: React.FC<ListaAulasProps> = ({ aulas, onEditar, onExcluir }) => {
  // Função para formatar a periodicidade
  const formatarPeriodicidade = (periodicidade: string): string => {
    switch (periodicidade) {
      case 'mensal': return 'Mensal';
      case 'trimestral': return 'Trimestral';
      case 'semestral': return 'Semestral';
      case 'anual': return 'Anual';
      default: return periodicidade;
    }
  };

  // Função para formatar o texto de vezes por semana
  const formatarVezesSemanais = (vezes: number): string => {
    return vezes === 1 ? '1 vez por semana' : `${vezes} vezes por semana`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-aula-blue">
          Aulas Cadastradas
        </CardTitle>
        <CardDescription>
          {aulas.length === 0 
            ? "Nenhuma aula cadastrada ainda." 
            : `Total de ${aulas.length} ${aulas.length === 1 ? 'aula cadastrada' : 'aulas cadastradas'}.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {aulas.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>Ainda não há aulas cadastradas.</p>
            <p>Use o formulário acima para adicionar uma nova aula.</p>
          </div>
        ) : (
          <ScrollArea className="w-full" style={{ maxHeight: '400px' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Aula</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Periodicidade</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aulas.map((aula) => (
                  <TableRow key={aula.id}>
                    <TableCell className="font-medium">{aula.nome}</TableCell>
                    <TableCell>{formatarMoeda(aula.valor)}</TableCell>
                    <TableCell>{formatarPeriodicidade(aula.periodicidade)}</TableCell>
                    <TableCell>{formatarVezesSemanais(aula.vezesSemanais)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditar(aula)}
                          className="h-8 w-8 p-0 text-aula-blue hover:text-aula-blue hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onExcluir(aula.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

export default ListaAulas;
