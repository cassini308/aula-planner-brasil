
import React from "react";
import { useNavigate } from "react-router-dom";
import { ConfiguracaoSite } from "@/components/ConfiguracaoSite";
import { verificarAdminAutenticado } from "@/services/adminAuthService";
import { useToast } from "@/components/ui/use-toast";

export default function ConfiguracoesSite() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { autenticado } = await verificarAdminAutenticado();
        if (!autenticado) {
          toast({
            variant: "destructive",
            title: "Acesso negado",
            description: "Você precisa estar logado como administrador para acessar esta página",
          });
          navigate("/login-admin");
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro ao verificar sua autenticação",
        });
        navigate("/login-admin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Configurações do Site</h1>
      <ConfiguracaoSite />
    </div>
  );
}
