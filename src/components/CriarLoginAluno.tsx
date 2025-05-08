
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { registrarAluno } from '@/services/authService';
import { Aluno } from '@/types/aula';

interface CriarLoginAlunoProps {
  aluno: Aluno;
  onSuccess?: () => void;
}

const CriarLoginAluno = ({ aluno, onSuccess }: CriarLoginAlunoProps) => {
  const [email, setEmail] = useState(aluno.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe um email válido",
        variant: "destructive",
      });
      return;
    }
    
    if (!password.trim() || password.length < 6) {
      toast({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "As senhas digitadas não são iguais",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { success } = await registrarAluno(email, password, aluno.id);
      
      if (success) {
        toast({
          title: "Acesso criado com sucesso",
          description: "O aluno já pode fazer login com as credenciais informadas",
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Acesso para o Aluno</CardTitle>
        <CardDescription>
          Configure um email e senha para que o aluno possa acessar seu painel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="aluno@email.com" 
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
              placeholder="Mínimo 6 caracteres" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input 
              id="confirmPassword"
              type="password" 
              placeholder="Repita a senha" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando acesso...' : 'Criar Acesso'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CriarLoginAluno;
