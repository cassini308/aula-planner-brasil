
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Music } from "lucide-react";
import { salvarConfiguracoesSite, getConfiguracoesSite } from "@/services/configuracoesService";

const formSchema = z.object({
  nomeEscola: z.string().min(3, "O nome da escola deve ter pelo menos 3 caracteres"),
  logoUrl: z.string().optional(),
});

export function ConfiguracaoSite() {
  const [carregando, setCarregando] = useState(false);

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
      await salvarConfiguracoesSite(values);
      toast.success("Configurações do site salvas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="text-blue-500" size={20} />
          Configurações do Site
        </CardTitle>
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

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Logo (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/logo.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={carregando}>
                {carregando ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
