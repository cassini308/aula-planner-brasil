
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarioSemanal } from "@/components/CalendarioSemanal";
import { AdicionarHorario } from "@/components/AdicionarHorario";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AgendamentoHorario } from "@/types/agenda";
import { getAgendamentos, getDiaDaSemanaTexto } from "@/services/agendaService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Agenda() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoHorario[]>([]);
  const [dialogoAberto, setDialogoAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const carregarAgendamentos = async () => {
    setCarregando(true);
    try {
      const dados = await getAgendamentos();
      setAgendamentos(dados);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      toast.error("Erro ao carregar a agenda");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const handleNovoAgendamento = () => {
    setDialogoAberto(true);
  };

  const handleAgendamentoAdicionado = () => {
    setDialogoAberto(false);
    carregarAgendamentos();
    toast.success("Horário adicionado com sucesso");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agenda Semanal</h1>
        <Button onClick={handleNovoAgendamento}>Adicionar Horário</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <p className="text-center py-8">Carregando agenda...</p>
          ) : (
            <CalendarioSemanal agendamentos={agendamentos} onAgendamentoAtualizado={carregarAgendamentos} />
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogoAberto} onOpenChange={setDialogoAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Horário</DialogTitle>
          </DialogHeader>
          <AdicionarHorario onAgendamentoAdicionado={handleAgendamentoAdicionado} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
