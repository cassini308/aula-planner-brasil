
import React, { useEffect, useState } from 'react';
import { Aula, AulaFormData, Periodicidade } from '@/types/aula';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface FormularioAulaProps {
  onSalvar: (aula: AulaFormData) => void;
  aulaParaEditar?: Aula | null;
  onCancelarEdicao?: () => void;
}

const FormularioAula: React.FC<FormularioAulaProps> = ({ 
  onSalvar, 
  aulaParaEditar, 
  onCancelarEdicao 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AulaFormData>({
    nome: '',
    valor: 0,
    periodicidade: 'mensal',
    vezes_semanais: 1
  });

  useEffect(() => {
    if (aulaParaEditar) {
      setFormData({
        nome: aulaParaEditar.nome,
        valor: aulaParaEditar.valor,
        periodicidade: aulaParaEditar.periodicidade,
        vezes_semanais: aulaParaEditar.vezes_semanais
      });
    }
  }, [aulaParaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast({
        title: "Erro no formulário",
        description: "Nome da aula é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (formData.valor <= 0) {
      toast({
        title: "Erro no formulário",
        description: "Valor deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }

    onSalvar(formData);
    
    if (!aulaParaEditar) {
      // Limpar formulário após adicionar (não após editar)
      setFormData({
        nome: '',
        valor: 0,
        periodicidade: 'mensal',
        vezes_semanais: 1
      });
    }
    
    toast({
      title: aulaParaEditar ? "Aula atualizada" : "Aula adicionada",
      description: `${formData.nome} foi ${aulaParaEditar ? 'atualizada' : 'adicionada'} com sucesso!`,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'valor') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else if (name === 'vezes_semanais') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 1
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handlePeriodicidadeChange = (value: string) => {
    setFormData({
      ...formData,
      periodicidade: value as Periodicidade
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-aula-blue">
          {aulaParaEditar ? 'Editar Aula' : 'Cadastrar Nova Aula'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="nome" className="text-base">Nome da Aula</Label>
            <Input 
              id="nome"
              name="nome"
              type="text"
              placeholder="Ex: Matemática, Inglês, Violão..."
              value={formData.nome}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="valor" className="text-base">Valor (R$)</Label>
            <Input
              id="valor" 
              name="valor"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={formData.valor}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="periodicidade" className="text-base">Periodicidade de Pagamento</Label>
            <Select 
              value={formData.periodicidade} 
              onValueChange={handlePeriodicidadeChange}
            >
              <SelectTrigger id="periodicidade">
                <SelectValue placeholder="Selecione a periodicidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="vezes_semanais" className="text-base">Aulas por Semana</Label>
            <Input 
              id="vezes_semanais"
              name="vezes_semanais"
              type="number"
              min="1"
              max="7"
              value={formData.vezes_semanais}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {aulaParaEditar && onCancelarEdicao && (
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancelarEdicao}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            className={`${aulaParaEditar ? 'bg-aula-green' : 'bg-aula-blue'} hover:opacity-90`}
            style={{marginLeft: aulaParaEditar ? '0' : 'auto'}}
          >
            {aulaParaEditar ? 'Atualizar Aula' : 'Cadastrar Aula'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FormularioAula;
