
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Calendar, CreditCard, UserPlus } from 'lucide-react';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800">Sistema de Gestão de Aulas</h1>
        <p className="text-xl text-slate-600 mt-2">Gerenciamento completo de alunos, aulas e mensalidades</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card de Alunos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Alunos</CardTitle>
            <CardDescription>Gerenciamento de cadastros de alunos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">Cadastre, edite e visualize todos os alunos do sistema.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/alunos">
              <Button>Gerenciar Alunos</Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Card de Aulas */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle>Aulas</CardTitle>
            <CardDescription>Configuração de tipos de aulas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">Configure os tipos de aulas, valores e periodicidades.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/aulas">
              <Button>Gerenciar Aulas</Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Card de Agenda */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Agenda</CardTitle>
            <CardDescription>Programação de horários</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">Visualize e gerencie os agendamentos de aulas semanais.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/agenda">
              <Button>Ver Agenda</Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Card de Mensalidades */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <CreditCard className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle>Mensalidades</CardTitle>
            <CardDescription>Controle financeiro</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">Gerencie as mensalidades e pagamentos dos alunos.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/mensalidades">
              <Button>Controlar Mensalidades</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 max-w-md mx-auto">
        <Card className="hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Auto Cadastro de Alunos</CardTitle>
            <CardDescription>Formulário para novos alunos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              É novo por aqui? Preencha seus dados no formulário de auto cadastro para iniciar sua matrícula.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/auto-cadastro">
              <Button variant="outline" className="border-blue-300 hover:bg-blue-50">
                Ir para o formulário
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
