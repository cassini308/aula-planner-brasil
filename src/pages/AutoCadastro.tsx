
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { parse } from 'date-fns';
import { AlunoFormData, ResponsavelFormData } from '@/types/aula';
import { adicionarAluno, verificarCpfExistente } from '@/services/alunoService';

const AutoCadastro: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formularioEnviado, setFormularioEnviado] = useState(false);
  
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

  const [dataNascimentoStr, setDataNascimentoStr] = useState('');
  const [dataNascimentoRespStr, setDataNascimentoRespStr] = useState('');

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
    setDataNascimentoStr(dateValue);
    
    try {
      // Tenta converter a string de data para o formato Date
      const date = parse(dateValue, 'dd/MM/yyyy', new Date());
      
      if (!isNaN(date.getTime())) {
        setFormData({
          ...formData,
          data_nascimento: date
        });
        
        // Calcula se é menor de idade
        const hoje = new Date();
        const idade = hoje.getFullYear() - date.getFullYear();
        const menorIdade = idade < 18 || (
          idade === 18 && 
          (hoje.getMonth() < date.getMonth() || 
            (hoje.getMonth() === date.getMonth() && hoje.getDate() < date.getDate())
          )
        );
        
        setFormData(prev => ({
          ...prev,
          menor_idade: menorIdade,
          data_nascimento: date
        }));
      }
    } catch (error) {
      console.error("Erro ao converter data:", error);
    }
  };

  const handleResponsavelDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setDataNascimentoRespStr(dateValue);
    
    try {
      if (dateValue) {
        const date = parse(dateValue, 'dd/MM/yyyy', new Date());
        if (!isNaN(date.getTime())) {
          setResponsavelData({
            ...responsavelData,
            data_nascimento: date
          });
        }
      } else {
        setResponsavelData({
          ...responsavelData,
          data_nascimento: null
        });
      }
    } catch (error) {
      console.error("Erro ao converter data do responsável:", error);
    }
  };

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

    // Verifica data de nascimento
    if (!dataNascimentoStr) {
      toast({
        title: "Erro no formulário",
        description: "Data de nascimento do aluno é obrigatória",
        variant: "destructive"
      });
      return false;
    }

    // Verifica se CPF já existe
    const cpfExiste = await verificarCpfExistente(formData.cpf);
    
    if (cpfExiste) {
      toast({
        title: "CPF já cadastrado",
        description: "Este CPF já está cadastrado no sistema",
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
      try {
        const novoAluno = await adicionarAluno(
          formData, 
          formData.menor_idade ? responsavelData : undefined
        );
        
        if (novoAluno) {
          toast({
            title: "Cadastro realizado com sucesso!",
            description: "Seus dados foram enviados para análise.",
          });
          setFormularioEnviado(true);
        } else {
          toast({
            title: "Erro no cadastro",
            description: "Não foi possível completar o cadastro. Tente novamente.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erro ao salvar aluno:", error);
        toast({
          title: "Erro no sistema",
          description: "Ocorreu um erro ao processar seu cadastro. Tente novamente.",
          variant: "destructive"
        });
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Formulário de Auto Cadastro</h1>
          <p className="text-lg text-slate-600 mt-2">Preencha seus dados para se cadastrar no sistema</p>
        </div>

        {formularioEnviado ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-600">Cadastro Enviado!</CardTitle>
              <CardDescription>
                Seu cadastro foi recebido com sucesso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-700 py-4">
                Obrigado por enviar seus dados. Nossa equipe entrará em contato para confirmar sua matrícula.
              </p>
              <p className="text-center text-gray-700">
                Você receberá um email de confirmação em breve.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/')} className="mt-4">
                Voltar para a página inicial
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-aula-blue">Formulário de Cadastro</CardTitle>
              <CardDescription>
                Preencha seus dados pessoais para iniciar seu cadastro
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="nome" className="text-base">Nome Completo</Label>
                  <Input 
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Seu nome completo"
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
                      placeholder="Seu e-mail"
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
                    placeholder="Seu endereço completo"
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
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={dataNascimentoStr}
                    onChange={handleDateChange}
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-gray-500">Digite a data no formato dia/mês/ano (DD/MM/AAAA)</p>
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
                        placeholder="Endereço completo do responsável"
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
                        type="text"
                        placeholder="DD/MM/AAAA"
                        value={dataNascimentoRespStr}
                        onChange={handleResponsavelDateChange}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">Digite a data no formato dia/mês/ano (DD/MM/AAAA)</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-aula-blue hover:bg-aula-blue/90"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar cadastro"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AutoCadastro;
