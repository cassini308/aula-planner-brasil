
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, BookOpen, Calendar, CreditCard, UserPlus, Lock, Bell } from 'lucide-react';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Sistema de Gestão de Aulas</h1>
        <p className="text-xl text-gray-600 mb-8">
          Gerencie alunos, aulas, agendamentos e mensalidades em um único lugar.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/login-aluno">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600">
              Área do Aluno
            </Button>
          </Link>
          <Link to="/login-admin">
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
              <Lock size={18} className="mr-2" /> Área do Administrador
            </Button>
          </Link>
          <Link to="/auto-cadastro">
            <Button size="lg" variant="outline">
              <UserPlus size={18} className="mr-2" /> Auto Cadastro
            </Button>
          </Link>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link to="/alunos" className="block">
          <Card className="transition-all hover:shadow-md hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} /> Alunos
              </CardTitle>
              <CardDescription>Gerenciamento de alunos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Cadastre, edite e gerencie informações de alunos, incluindo dados pessoais e matrículas.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">Acessar</Button>
            </CardFooter>
          </Card>
        </Link>

        <Link to="/aulas" className="block">
          <Card className="transition-all hover:shadow-md hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} /> Aulas
              </CardTitle>
              <CardDescription>Gerenciamento de aulas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Configure modalidades de aulas, valores, periodicidade e outras informações importantes.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">Acessar</Button>
            </CardFooter>
          </Card>
        </Link>
        
        <Link to="/agenda" className="block">
          <Card className="transition-all hover:shadow-md hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} /> Agenda
              </CardTitle>
              <CardDescription>Gerenciamento de horários</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Organize e acompanhe os horários de aulas por dia da semana e por aluno.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">Acessar</Button>
            </CardFooter>
          </Card>
        </Link>
        
        <Link to="/mensalidades" className="block">
          <Card className="transition-all hover:shadow-md hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={20} /> Mensalidades
              </CardTitle>
              <CardDescription>Controle financeiro</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acompanhe pagamentos, registre mensalidades e mantenha o controle financeiro.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">Acessar</Button>
            </CardFooter>
          </Card>
        </Link>
        
        <Link to="/avisos" className="block">
          <Card className="transition-all hover:shadow-md hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} /> Avisos
              </CardTitle>
              <CardDescription>Comunicados e notificações</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Crie e gerencie avisos para todos os alunos ou alunos específicos.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">Acessar</Button>
            </CardFooter>
          </Card>
        </Link>
      </section>
    </div>
  );
};

export default Index;
