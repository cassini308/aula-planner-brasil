
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ListaAlunos from "@/components/ListaAlunos";
import ListaAulas from "@/components/ListaAulas";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CalendarCheck, List, Calendar } from "lucide-react";

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Sistema de Gestão de Aulas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/mensalidades">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                Mensalidades
              </CardTitle>
              <CardDescription>
                Gerencie as mensalidades dos alunos
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/agenda">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agenda Semanal
              </CardTitle>
              <CardDescription>
                Visualize e gerencie os horários das aulas
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Relatórios
            </CardTitle>
            <CardDescription>
              Visualize relatórios e estatísticas
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Alunos</CardTitle>
            <CardDescription>
              Gerenciamento de alunos cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListaAlunos />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aulas</CardTitle>
            <CardDescription>
              Gerenciamento de aulas disponíveis no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListaAulas />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
