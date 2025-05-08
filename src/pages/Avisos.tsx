
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ChevronDown, ChevronUp, Search, Plus, Edit, Trash2, Bell, BellOff, ListFilter, Check, X } from 'lucide-react';
import { formatarData } from '@/services/alunoService';
import { getAlunos } from '@/services/alunoService';
import { Aluno } from '@/types/aula';
import { Aviso, AvisoFormData, adicionarAviso, atualizarAviso, excluirAviso, getAvisos, alternarPublicacaoAviso } from '@/services/avisoService';
import { ConfirmacaoExclusao } from '@/components/ConfirmacaoExclusao';

const Avisos = () => {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filtro, setFiltro] = useState('');
  const [dialogoAberto, setDialogoAberto] = useState(false);
  const [dialogoExclusaoAberto, setDialogoExclusaoAberto] = useState(false);
  const [avisoParaEditar, setAvisoParaEditar] = useState<Aviso | null>(null);
  const [avisoParaExcluir, setAvisoParaExcluir] = useState<Aviso | null>(null);
  const [tab, setTab] = useState('todos');
  const [formData, setFormData] = useState<AvisoFormData>({
    titulo: '',
    conteudo: '',
    para_todos: true,
    alunos_ids: []
  });
  const { toast } = useToast();

  // Carregar avisos e alunos ao iniciar
  useEffect(() => {
    carregarAvisos();
    carregarAlunos();
  }, []);

  // Função para carregar avisos
  const carregarAvisos = async () => {
    try {
      const dadosAvisos = await getAvisos();
      setAvisos(dadosAvisos);
    } catch (error) {
      console.error("Erro ao carregar avisos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os avisos. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Função para carregar alunos
  const carregarAlunos = async () => {
    try {
      const dadosAlunos = await getAlunos();
      setAlunos(dadosAlunos);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    }
  };

  // Filtrar avisos
  const avisosFiltrados = avisos.filter(aviso => 
    aviso.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    aviso.conteudo.toLowerCase().includes(filtro.toLowerCase())
  ).filter(aviso => {
    if (tab === 'todos') return true;
    if (tab === 'publicados') return aviso.publicado;
    if (tab === 'rascunhos') return !aviso.publicado;
    return true;
  });

  // Abrir formulário de aviso para edição
  const abrirFormularioEdicao = (aviso: Aviso) => {
    setAvisoParaEditar(aviso);
    setFormData({
      titulo: aviso.titulo,
      conteudo: aviso.conteudo,
      para_todos: aviso.para_todos,
      alunos_ids: aviso.alunos_ids || []
    });
    setDialogoAberto(true);
  };

  // Abrir formulário de aviso para criação
  const abrirFormularioCriacao = () => {
    setAvisoParaEditar(null);
    setFormData({
      titulo: '',
      conteudo: '',
      para_todos: true,
      alunos_ids: []
    });
    setDialogoAberto(true);
  };

  // Alternar seleção de aluno no formulário
  const alternarSelecaoAluno = (alunoId: string) => {
    setFormData(prev => {
      const ids = prev.alunos_ids || [];
      if (ids.includes(alunoId)) {
        return { ...prev, alunos_ids: ids.filter(id => id !== alunoId) };
      } else {
        return { ...prev, alunos_ids: [...ids, alunoId] };
      }
    });
  };

  // Salvar aviso (criar ou atualizar)
  const salvarAviso = async () => {
    try {
      // Validar formulário
      if (!formData.titulo.trim() || !formData.conteudo.trim()) {
        toast({
          title: "Dados incompletos",
          description: "Por favor, preencha o título e o conteúdo do aviso.",
          variant: "destructive"
        });
        return;
      }
      
      // Se não for para todos, deve ter pelo menos um aluno selecionado
      if (!formData.para_todos && (!formData.alunos_ids || formData.alunos_ids.length === 0)) {
        toast({
          title: "Seleção de alunos obrigatória",
          description: "Selecione pelo menos um aluno para este aviso ou marque como 'Para todos os alunos'.",
          variant: "destructive"
        });
        return;
      }
      
      let aviso;
      if (avisoParaEditar) {
        // Atualizar
        aviso = await atualizarAviso(avisoParaEditar.id, formData);
        if (aviso) {
          toast({
            title: "Aviso atualizado",
            description: "O aviso foi atualizado com sucesso."
          });
        }
      } else {
        // Criar novo
        aviso = await adicionarAviso(formData);
        if (aviso) {
          toast({
            title: "Aviso criado",
            description: "O aviso foi criado com sucesso."
          });
        }
      }
      
      if (aviso) {
        setDialogoAberto(false);
        carregarAvisos();
      }
    } catch (error) {
      console.error("Erro ao salvar aviso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o aviso. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Alternar publicação de um aviso
  const handleAlternarPublicacao = async (aviso: Aviso) => {
    try {
      const sucesso = await alternarPublicacaoAviso(aviso.id, !aviso.publicado);
      if (sucesso) {
        toast({
          title: aviso.publicado ? "Aviso despublicado" : "Aviso publicado",
          description: `O aviso foi ${aviso.publicado ? 'despublicado' : 'publicado'} com sucesso.`
        });
        carregarAvisos();
      }
    } catch (error) {
      console.error("Erro ao alternar publicação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status de publicação do aviso.",
        variant: "destructive"
      });
    }
  };

  // Excluir aviso
  const handleExcluirAviso = async () => {
    if (!avisoParaExcluir) return;
    
    try {
      const sucesso = await excluirAviso(avisoParaExcluir.id);
      if (sucesso) {
        toast({
          title: "Aviso excluído",
          description: "O aviso foi excluído com sucesso."
        });
        carregarAvisos();
      }
    } catch (error) {
      console.error("Erro ao excluir aviso:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o aviso. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setDialogoExclusaoAberto(false);
      setAvisoParaExcluir(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Avisos</h1>
        <Button onClick={abrirFormularioCriacao}>
          <Plus size={16} className="mr-2" /> Novo Aviso
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-5 h-5 text-gray-500" />
          <Input
            placeholder="Buscar avisos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="publicados">Publicados</TabsTrigger>
            <TabsTrigger value="rascunhos">Não Publicados</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {avisosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum aviso encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece criando um novo aviso para os alunos.
          </p>
          <div className="mt-6">
            <Button onClick={abrirFormularioCriacao}>
              <Plus size={16} className="mr-2" /> Novo Aviso
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {avisosFiltrados.map(aviso => (
            <Card key={aviso.id} className={aviso.publicado ? "border-green-200" : "border-amber-200"}>
              <CardHeader className={aviso.publicado ? "bg-green-50" : "bg-amber-50"}>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{aviso.titulo}</CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleAlternarPublicacao(aviso)}
                      title={aviso.publicado ? "Despublicar" : "Publicar"}
                      className={aviso.publicado ? "text-green-600" : "text-amber-600"}
                    >
                      {aviso.publicado ? <Bell size={16} /> : <BellOff size={16} />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => abrirFormularioEdicao(aviso)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setAvisoParaExcluir(aviso);
                        setDialogoExclusaoAberto(true);
                      }}
                      title="Excluir"
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {formatarData(aviso.data_criacao)} • 
                  {aviso.para_todos ? " Para todos os alunos" : " Para alunos específicos"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="whitespace-pre-wrap">{aviso.conteudo}</p>
              </CardContent>
              <CardFooter className="border-t pt-4 text-sm text-gray-500">
                Status: {aviso.publicado ? "Publicado" : "Não publicado"}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Diálogo de formulário de aviso */}
      <Dialog open={dialogoAberto} onOpenChange={setDialogoAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{avisoParaEditar ? "Editar Aviso" : "Novo Aviso"}</DialogTitle>
            <DialogDescription>
              {avisoParaEditar 
                ? "Modifique os campos do aviso conforme necessário."
                : "Preencha os campos para criar um novo aviso para os alunos."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Digite o título do aviso"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo</Label>
              <Textarea
                id="conteudo"
                value={formData.conteudo}
                onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                placeholder="Digite o conteúdo do aviso"
                rows={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="para_todos"
                checked={formData.para_todos}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, para_todos: checked as boolean })
                }
              />
              <Label htmlFor="para_todos">Para todos os alunos</Label>
            </div>

            {!formData.para_todos && (
              <div className="space-y-2 border rounded-md p-4">
                <Label>Selecionar Alunos</Label>
                {alunos.length > 0 ? (
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {alunos.map(aluno => (
                        <div key={aluno.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`aluno-${aluno.id}`}
                            checked={(formData.alunos_ids || []).includes(aluno.id)}
                            onCheckedChange={() => alternarSelecaoAluno(aluno.id)}
                          />
                          <Label htmlFor={`aluno-${aluno.id}`}>{aluno.nome}</Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-gray-500">Carregando lista de alunos...</p>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDialogoAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={salvarAviso}>
                {avisoParaEditar ? "Atualizar" : "Criar"} Aviso
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <ConfirmacaoExclusao
        aberto={dialogoExclusaoAberto}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o aviso "${avisoParaExcluir?.titulo}"? Esta ação não pode ser desfeita.`}
        onConfirmar={handleExcluirAviso}
        onCancelar={() => {
          setDialogoExclusaoAberto(false);
          setAvisoParaExcluir(null);
        }}
      />
    </div>
  );
};

export default Avisos;
