
import React, { useEffect, useState } from 'react';
import { AlunoFormData, ResponsavelFormData } from '@/types/aula';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { verificarCpfExistente } from '@/services/alunoService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Checkbox } from '@/components/ui/checkbox';

interface FormularioAlunoProps {
  onSalvar: (aluno: AlunoFormData, responsavel?: ResponsavelFormData) => void;
  alunoParaEditar?: any;
  onCancelarEdicao?: () => void;
}

const FormularioAluno: React.FC<FormularioAlunoProps> = ({ 
  onSalvar, 
  alunoParaEditar, 
  onCancelarEdicao 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AlunoFormData>({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    rg: '',
    endereco: '',
    data_nascimento: new Date(),
    menor_idade: false
  });

  const [responsavelData, setResponsavelData] = useState<ResponsavelFormData>({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    rg: '',
    endereco: '',
    data_nascimento: null
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (alunoParaEditar) {
      setFormData({
        nome: alunoParaEditar.nome,
        email: alunoParaEditar.email || '',
        telefone: alunoParaEditar.telefone || '',
        cpf: alunoParaEditar.cpf,
        rg: alunoParaEditar.rg || '',
        endereco: alunoParaEditar.endereco || '',
        data_nascimento: new Date(alunoParaEditar.data_nascimento),
        menor_idade: alunoParaEditar.menor_idade
      });

      if (alunoParaEditar.responsavel) {
        setResponsavelData({
          nome: alunoParaEditar.responsavel.nome,
          email: alunoParaEditar.responsavel.email || '',
          telefone: alunoParaEditar.responsavel.telefone || '',
          cpf: alunoParaEditar.responsavel.cpf,
          rg: alunoParaEditar.responsavel.rg || '',
          endereco: alunoParaEditar.responsavel.endereco || '',
          data_nascimento: alunoParaEditar.responsavel.data_nascimento ? 
            new Date(alunoParaEditar.responsavel.data_nascimento) : null
        });
      }
    }
  }, [alunoParaEditar]);

  const validarFormulario = async () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Erro no formulário",
        description: "Nome do aluno é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.cpf.trim()) {
      toast({
        title: "Erro no formulário",
        description: "CPF do aluno é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    // Verifica se CPF já existe
    const cpfExiste = await verificarCpfExistente(
      formData.cpf, 
      alunoParaEditar?.id
    );
    
    if (cpfExiste) {
      toast({
        title: "CPF já cadastrado",
        description: "Este CPF já pertence a outro aluno",
        variant: "destructive"
      });
      return false;
    }

    // Validações para o responsável se for menor de idade
    if (formData.menor_idade) {
      if (!responsavelData.nome.trim()) {
        toast({
          title: "Erro no formulário",
          description: "Nome do responsável é obrigatório",
          variant: "destructive"
        });
        return false;
      }

      if (!responsavelData.cpf.trim()) {
        toast({
          title: "Erro no formulário",
          description: "CPF do responsável é obrigatório",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    const valido = await validarFormulario();
    
    if (valido) {
      onSalvar(
        formData, 
        formData.menor_idade ? responsavelData : undefined
      );

      if (!alunoParaEditar) {
        // Reset form after submit if not editing
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          cpf: '',
          rg: '',
          endereco: '',
          data_nascimento: new Date(),
          menor_idade: false
        });
        
        setResponsavelData({
          nome: '',
          email: '',
          telefone: '',
          cpf: '',
          rg: '',
          endereco: '',
          data_nascimento: null
        });
      }
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleResponsavelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setResponsavelData({
      ...responsavelData,
      [name]: value
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setFormData({
      ...formData,
      data_nascimento: new Date(dateValue)
    });
    
    // Calcula se é menor de idade
    const hoje = new Date();
    const dataNascimento = new Date(dateValue);
    const idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const menorIdade = idade < 18 || (
      idade === 18 && 
      (hoje.getMonth() < dataNascimento.getMonth() || 
        (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() < dataNascimento.getDate())
      )
    );
    
    setFormData(prev => ({
      ...prev,
      menor_idade: menorIdade
    }));
  };

  const handleResponsavelDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setResponsavelData({
      ...responsavelData,
      data_nascimento: dateValue ? new Date(dateValue) : null
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-aula-blue">
          {alunoParaEditar ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="nome" className="text-base">Nome Completo</Label>
            <Input 
              id="nome"
              name="nome"
              type="text"
              placeholder="Nome completo do aluno"
              value={formData.nome}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="email" className="text-base">E-mail</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                placeholder="E-mail do aluno"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="telefone" className="text-base">Telefone</Label>
              <Input 
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="cpf" className="text-base">CPF</Label>
              <Input 
                id="cpf"
                name="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="rg" className="text-base">RG</Label>
              <Input 
                id="rg"
                name="rg"
                type="text"
                placeholder="00.000.000-0"
                value={formData.rg}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="endereco" className="text-base">Endereço</Label>
            <Input 
              id="endereco"
              name="endereco"
              type="text"
              placeholder="Endereço completo"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="data_nascimento" className="text-base">Data de Nascimento</Label>
            <Input 
              id="data_nascimento"
              name="data_nascimento"
              type="date"
              value={format(formData.data_nascimento, 'yyyy-MM-dd')}
              onChange={handleDateChange}
              className="w-full"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="menor_idade" 
              checked={formData.menor_idade}
              onCheckedChange={(checked) => {
                setFormData(prev => ({...prev, menor_idade: !!checked}));
              }}
            />
            <Label htmlFor="menor_idade" className="text-base">
              Menor de idade
            </Label>
          </div>

          {formData.menor_idade && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Dados do Responsável</h3>
              
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="resp_nome" className="text-base">Nome Completo</Label>
                <Input 
                  id="resp_nome"
                  name="nome"
                  type="text"
                  placeholder="Nome completo do responsável"
                  value={responsavelData.nome}
                  onChange={handleResponsavelChange}
                  className="w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="resp_email" className="text-base">E-mail</Label>
                  <Input 
                    id="resp_email"
                    name="email"
                    type="email"
                    placeholder="E-mail do responsável"
                    value={responsavelData.email}
                    onChange={handleResponsavelChange}
                    className="w-full"
                  />
                </div>

                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="resp_telefone" className="text-base">Telefone</Label>
                  <Input 
                    id="resp_telefone"
                    name="telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={responsavelData.telefone}
                    onChange={handleResponsavelChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="resp_cpf" className="text-base">CPF</Label>
                  <Input 
                    id="resp_cpf"
                    name="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={responsavelData.cpf}
                    onChange={handleResponsavelChange}
                    className="w-full"
                    required
                  />
                </div>

                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="resp_rg" className="text-base">RG</Label>
                  <Input 
                    id="resp_rg"
                    name="rg"
                    type="text"
                    placeholder="00.000.000-0"
                    value={responsavelData.rg}
                    onChange={handleResponsavelChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid w-full items-center gap-3 mt-4">
                <Label htmlFor="resp_endereco" className="text-base">Endereço</Label>
                <Input 
                  id="resp_endereco"
                  name="endereco"
                  type="text"
                  placeholder="Endereço completo"
                  value={responsavelData.endereco}
                  onChange={handleResponsavelChange}
                  className="w-full"
                />
              </div>

              <div className="grid w-full items-center gap-3 mt-4">
                <Label htmlFor="resp_data_nascimento" className="text-base">Data de Nascimento</Label>
                <Input 
                  id="resp_data_nascimento"
                  name="data_nascimento"
                  type="date"
                  value={responsavelData.data_nascimento ? format(responsavelData.data_nascimento, 'yyyy-MM-dd') : ''}
                  onChange={handleResponsavelDateChange}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {alunoParaEditar && onCancelarEdicao && (
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancelarEdicao}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            className={`${alunoParaEditar ? 'bg-aula-green' : 'bg-aula-blue'} hover:opacity-90`}
            disabled={loading}
            style={{marginLeft: alunoParaEditar ? '0' : 'auto'}}
          >
            {loading ? 'Processando...' : alunoParaEditar ? 'Atualizar Aluno' : 'Cadastrar Aluno'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FormularioAluno;
