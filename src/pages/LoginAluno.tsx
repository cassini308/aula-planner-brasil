
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { loginAluno, verificarAutenticacao } from '@/services/authService';
import { Link } from 'react-router-dom';

const LoginAluno = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário já está logado
    const verificarLogin = async () => {
      const { autenticado } = await verificarAutenticacao();
      if (autenticado) {
        navigate('/painel-aluno');
      }
    };

    verificarLogin();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { success } = await loginAluno(email, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Você será redirecionado para o seu painel",
        });
        
        navigate('/painel-aluno');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Área do Aluno</CardTitle>
            <CardDescription>
              Entre com seu email e senha para acessar seu painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-center text-gray-500">
              Não tem uma conta? Entre em contato com a administração para cadastrar seu acesso.
            </p>
            <Button variant="link" asChild>
              <Link to="/">Voltar para a página principal</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginAluno;
