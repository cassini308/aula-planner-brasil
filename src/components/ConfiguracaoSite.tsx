
import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Music, Upload, Shield, Key, Plus, UserPlus, Users } from "lucide-react";
import { salvarConfiguracoesSite, getConfiguracoesSite, uploadLogo } from "@/services/configuracoesService";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlterarSenha from "@/components/AlterarSenha";

const formSchema = z.object({
  nomeEscola: z.string().min(3, "O nome da escola deve ter pelo menos 3 caracteres"),
  logoUrl: z.string().optional(),
});

export function ConfiguracaoSite() {
  const [carregando, setCarregando] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeEscola: "Escola de Música Harmonia",
      logoUrl: "",
    },
  });

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      try {
        const configuracoes = await getConfiguracoesSite();
        if (configuracoes) {
          form.reset({
            nomeEscola: configuracoes.nomeEscola,
            logoUrl: configuracoes.logoUrl || "",
          });
          setLogoPreview(configuracoes.logoUrl || null);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    carregarConfiguracoes();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setCarregando(true);
    try {
      await salvarConfiguracoesSite({
        nomeEscola: values.nomeEscola,
        logoUrl: values.logoUrl || logoPreview || undefined,
      });
      toast.success("Configurações do site salvas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setCarregando(false);
    }
  };

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validação básica
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }
    
    setUploading(true);
    try {
      // Mostra uma prévia da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Faz o upload
      const logoUrl = await uploadLogo(file);
      if (logoUrl) {
        form.setValue("logoUrl", logoUrl);
        toast.success("Logo enviada com sucesso");
      } else {
        toast.error("Erro ao enviar logo");
      }
    } catch (error) {
      console.error("Erro ao processar a logo:", error);
      toast.error("Erro ao processar a logo");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    form.setValue("logoUrl", "");
  };

  return (
    <Tabs defaultValue="geral" className="space-y-6">
      <TabsList>
        <TabsTrigger value="geral" className="flex items-center gap-2">
          <Music size={16} />
          Configurações Gerais
        </TabsTrigger>
        <TabsTrigger value="senha" className="flex items-center gap-2">
          <Key size={16} />
          Segurança
        </TabsTrigger>
        <TabsTrigger value="admins" className="flex items-center gap-2">
          <Users size={16} />
          Administradores
        </TabsTrigger>
      </TabsList>

      <TabsContent value="geral">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="text-blue-500" size={20} />
              Configurações do Site
            </CardTitle>
            <CardDescription>
              Configure o nome e o logo da escola de música
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nomeEscola"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Escola</FormLabel>
                      <FormControl>
                        <Input placeholder="Insira o nome da escola" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Logo da Escola</FormLabel>
                  <div className="flex flex-col gap-4">
                    {logoPreview ? (
                      <div className="flex flex-col items-center gap-4 p-4 border rounded-md">
                        <img 
                          src={logoPreview} 
                          alt="Logo da escola" 
                          className="max-h-40 object-contain"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleRemoveLogo}
                        >
                          Remover Logo
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="flex flex-col items-center gap-4 p-6 border border-dashed rounded-md bg-gray-50 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={32} className="text-gray-400" />
                        <p className="text-sm text-gray-500">Clique para selecionar uma imagem</p>
                      </div>
                    )}
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleLogoChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? "Enviando..." : "Fazer Upload de Logo"}
                    </Button>
                  </div>
                </FormItem>

                <div className="flex justify-end">
                  <Button type="submit" disabled={carregando}>
                    {carregando ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6 text-sm text-gray-500">
            Sistema Desenvolvido por Matheus Cassini. Versão 1.0
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="senha">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="text-blue-500" size={20} />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Altere a senha do seu usuário administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlterarSenha />
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6 text-sm text-gray-500">
            Sistema Desenvolvido por Matheus Cassini. Versão 1.0
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="admins">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="text-blue-500" size={20} />
              Gerenciar Administradores
            </CardTitle>
            <CardDescription>
              Adicione ou remova administradores do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">admin@escola.com</p>
                  <p className="text-sm text-gray-500">Administrador principal</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Remover
                </Button>
              </div>
              
              <div className="p-4 border border-dashed rounded-md">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <UserPlus className="text-blue-500" size={20} />
                    <h3 className="font-medium">Adicionar Novo Administrador</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Nome" />
                    <Input placeholder="Email" type="email" />
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Adicionar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6 text-sm text-gray-500">
            Sistema Desenvolvido por Matheus Cassini. Versão 1.0
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
