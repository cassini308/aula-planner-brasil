
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, UserPlus, Lock } from 'lucide-react';
import { verificarAdminAutenticado } from '@/services/adminAuthService';
import { verificarAutenticacao } from '@/services/authService';
import { useState, useEffect } from 'react';

const Index = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAluno, setIsAluno] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const adminAuth = await verificarAdminAutenticado();
      const alunoAuth = await verificarAutenticacao();
      
      setIsAdmin(adminAuth.autenticado);
      setIsAluno(alunoAuth.autenticado);
    };
    
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <Music size={80} className="mx-auto text-yellow-400" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Escola de Música Harmonia</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Transformando paixão em talento através da educação musical de qualidade
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!isAluno && !isAdmin && (
              <>
                <Link to="/auto-cadastro">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600">
                    <UserPlus size={18} className="mr-2" /> Quero ser Aluno
                  </Button>
                </Link>
                <Link to="/login-aluno">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    Área do Aluno
                  </Button>
                </Link>
              </>
            )}
            
            {isAluno && (
              <Link to="/painel-aluno">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600">
                  Meu Painel de Aluno
                </Button>
              </Link>
            )}
            
            {isAdmin && (
              <Link to="/admin">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Painel Administrativo
                </Button>
              </Link>
            )}
            
            {!isAdmin && (
              <Link to="/login-admin" className="hidden sm:block">
                <Button size="lg" variant="ghost" className="text-gray-300 hover:text-white">
                  <Lock size={16} className="mr-1" /> Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher a Escola de Música Harmonia?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-blue-800">Professores Qualificados</h3>
              <p className="text-gray-700">
                Nossa equipe de professores é formada por músicos profissionais com vasta experiência em ensino e performance.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-blue-800">Metodologia Personalizada</h3>
              <p className="text-gray-700">
                Desenvolvemos um plano de estudos adaptado ao seu ritmo de aprendizado e objetivos musicais.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 text-blue-800">Diversos Instrumentos</h3>
              <p className="text-gray-700">
                Oferecemos aulas de piano, violão, bateria, canto, violino, flauta e muito mais.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials/CTA Section */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Pronto para começar sua jornada musical?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de alunos que estão transformando seus sonhos musicais em realidade
          </p>
          
          <Link to="/auto-cadastro">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600">
              Faça sua matrícula agora
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-auto bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Music size={24} className="mr-2 text-yellow-400" />
              <span className="text-xl font-bold">Escola de Música Harmonia</span>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Escola de Música Harmonia. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
