
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Mensalidades from "./pages/Mensalidades";
import Agenda from "./pages/Agenda";
import NotFound from "./pages/NotFound";
import Alunos from "./pages/Alunos";
import Aulas from "./pages/Aulas";
import AutoCadastro from "./pages/AutoCadastro";
import PainelAluno from "./pages/PainelAluno";
import PainelAlunoPrivado from "./pages/PainelAlunoPrivado";
import LoginAluno from "./pages/LoginAluno";
import LoginAdmin from "./pages/LoginAdmin";
import PainelAdmin from "./pages/PainelAdmin";
import Avisos from "./pages/Avisos";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { verificarAdminAutenticado, AdminUser } from "@/services/adminAuthService";
import { verificarAutenticacao } from "@/services/authService";

const queryClient = new QueryClient();

// Componente para proteger rotas de administrador
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { autenticado } = await verificarAdminAutenticado();
      setIsAdmin(autenticado);
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (loading) {
    return <div className="container mx-auto p-4">Verificando autenticação...</div>;
  }
  
  if (!isAdmin) {
    return <Navigate to="/login-admin" replace />;
  }
  
  return <>{children}</>;
};

// Componente para proteger rotas de aluno
const ProtectedAlunoRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAluno, setIsAluno] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { autenticado } = await verificarAutenticacao();
      setIsAluno(autenticado);
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  if (loading) {
    return <div className="container mx-auto p-4">Verificando autenticação...</div>;
  }
  
  if (!isAluno) {
    return <Navigate to="/login-aluno" replace />;
  }
  
  return <>{children}</>;
};

const Navigation = () => {
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
    <nav className="bg-slate-800 text-white p-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link to="/" className="text-xl font-bold">Sistema de Aulas</Link>
        <div className="flex flex-wrap space-x-0 sm:space-x-2">
          <Link to="/"><Button variant="ghost" size="sm" className="text-sm">Home</Button></Link>
          
          {isAdmin && (
            <>
              <Link to="/alunos"><Button variant="ghost" size="sm" className="text-sm">Alunos</Button></Link>
              <Link to="/aulas"><Button variant="ghost" size="sm" className="text-sm">Aulas</Button></Link>
              <Link to="/agenda"><Button variant="ghost" size="sm" className="text-sm">Agenda</Button></Link>
              <Link to="/mensalidades"><Button variant="ghost" size="sm" className="text-sm">Mensalidades</Button></Link>
              <Link to="/avisos"><Button variant="ghost" size="sm" className="text-sm">Avisos</Button></Link>
              <Link to="/admin"><Button variant="ghost" size="sm" className="text-sm text-green-300">Painel Admin</Button></Link>
            </>
          )}
          
          {!isAdmin && !isAluno && (
            <>
              <Link to="/auto-cadastro"><Button variant="ghost" size="sm" className="text-sm">Auto Cadastro</Button></Link>
              <Link to="/login-aluno"><Button variant="ghost" size="sm" className="text-sm text-yellow-300">Área do Aluno</Button></Link>
              <Link to="/login-admin"><Button variant="ghost" size="sm" className="text-sm text-green-300">Admin</Button></Link>
            </>
          )}
          
          {isAluno && !isAdmin && (
            <Link to="/painel-aluno"><Button variant="ghost" size="sm" className="text-sm text-yellow-300">Meu Painel</Button></Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Navigation />
      <div className="py-4">
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Rotas protegidas de administrador */}
          <Route path="/alunos" element={
            <ProtectedAdminRoute>
              <Alunos />
            </ProtectedAdminRoute>
          } />
          <Route path="/aulas" element={
            <ProtectedAdminRoute>
              <Aulas />
            </ProtectedAdminRoute>
          } />
          <Route path="/mensalidades" element={
            <ProtectedAdminRoute>
              <Mensalidades />
            </ProtectedAdminRoute>
          } />
          <Route path="/agenda" element={
            <ProtectedAdminRoute>
              <Agenda />
            </ProtectedAdminRoute>
          } />
          <Route path="/avisos" element={
            <ProtectedAdminRoute>
              <Avisos />
            </ProtectedAdminRoute>
          } />
          <Route path="/aluno/:id" element={
            <ProtectedAdminRoute>
              <PainelAluno />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <PainelAdmin />
            </ProtectedAdminRoute>
          } />
          
          {/* Rotas de acesso público */}
          <Route path="/auto-cadastro" element={<AutoCadastro />} />
          <Route path="/login-aluno" element={<LoginAluno />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          
          {/* Rota protegida de aluno */}
          <Route path="/painel-aluno" element={
            <ProtectedAlunoRoute>
              <PainelAlunoPrivado />
            </ProtectedAlunoRoute>
          } />
          
          {/* Rota de fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
