
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const Navigation = () => (
  <nav className="bg-slate-800 text-white p-4">
    <div className="container mx-auto flex flex-wrap items-center justify-between">
      <Link to="/" className="text-xl font-bold">Sistema de Aulas</Link>
      <div className="flex flex-wrap space-x-0 sm:space-x-2">
        <Link to="/"><Button variant="ghost" size="sm" className="text-sm">Home</Button></Link>
        <Link to="/alunos"><Button variant="ghost" size="sm" className="text-sm">Alunos</Button></Link>
        <Link to="/aulas"><Button variant="ghost" size="sm" className="text-sm">Aulas</Button></Link>
        <Link to="/agenda"><Button variant="ghost" size="sm" className="text-sm">Agenda</Button></Link>
        <Link to="/mensalidades"><Button variant="ghost" size="sm" className="text-sm">Mensalidades</Button></Link>
        <Link to="/avisos"><Button variant="ghost" size="sm" className="text-sm">Avisos</Button></Link>
        <Link to="/auto-cadastro"><Button variant="ghost" size="sm" className="text-sm">Auto Cadastro</Button></Link>
        <Link to="/login-aluno"><Button variant="ghost" size="sm" className="text-sm text-yellow-300">Área do Aluno</Button></Link>
        <Link to="/login-admin"><Button variant="ghost" size="sm" className="text-sm text-green-300">Admin</Button></Link>
      </div>
    </div>
  </nav>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Navigation />
      <div className="py-4">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/aulas" element={<Aulas />} />
          <Route path="/mensalidades" element={<Mensalidades />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/avisos" element={<Avisos />} />
          <Route path="/auto-cadastro" element={<AutoCadastro />} />
          <Route path="/aluno/:id" element={<PainelAluno />} />
          <Route path="/login-aluno" element={<LoginAluno />} />
          <Route path="/painel-aluno" element={<PainelAlunoPrivado />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/admin" element={<PainelAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
