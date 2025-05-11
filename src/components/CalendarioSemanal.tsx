import { useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmacaoExclusaoAgendamento } from "@/components/ConfirmacaoExclusaoAgendamento";
import { AgendamentoHorario } from "@/types/agenda";
import { formatarHorario, getDiaDaSemanaTexto } from "@/services/agendaService";

interface CalendarioSemanalProps {
  agendamentos: AgendamentoHorario[];
  onAgendamentoAtualizado: () => void;
}

export function CalendarioSemanal({ agendamentos, onAgendamentoAtualizado }: CalendarioSemanalProps) {
  const [dialogoExclusaoAberto, setDialogoExclusaoAberto] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<AgendamentoHorario | null>(null);
  const diasDaSemana = [1, 2, 3, 4, 5, 6, 0]; // Segunda a Domingo (formato que o JS usa: 0 = Domingo)
  const horas = Array.from({ length: 14 }, (_, i) => i + 7); // Das 7h às 20h

  // Criar um mapa para acessar agendamentos rapidamente por dia e hora
  const mapaAgendamentos: Record<string, AgendamentoHorario[]> = {};
  
  agendamentos.forEach(agendamento => {
    const chave = `${agendamento.dia_semana}-${agendamento.hora_inicio}`;
    if (!mapaAgendamentos[chave]) {
      mapaAgendamentos[chave] = [];
    }
    mapaAgendamentos[chave].push(agendamento);
  });

  const handleRemoverAgendamento = (agendamento: AgendamentoHorario) => {
    setAgendamentoSelecionado(agendamento);
    setDialogoExclusaoAberto(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100"></th>
            {diasDaSemana.map(dia => (
              <th key={dia} className="border p-2 bg-gray-100 font-medium text-center">
                {getDiaDaSemanaTexto(dia)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horas.map(hora => (
            <tr key={hora}>
              <td className="border p-2 text-center font-medium bg-gray-50">
                {formatarHorario(hora)}
              </td>
              {diasDaSemana.map(dia => {
                const chave = `${dia}-${hora}`;
                const celAgendamentos = mapaAgendamentos[chave] || [];

                return (
                  <td key={`${dia}-${hora}`} className="border p-1 h-16 align-top">
                    {celAgendamentos.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {celAgendamentos.map(agendamento => (
                          <div 
                            key={agendamento.id} 
                            className="p-1 text-xs rounded bg-blue-100 border border-blue-200 flex justify-between items-center"
                          >
                            <span className="font-medium">{agendamento.aluno?.nome || "Desconhecido"}</span>
                            <span className="text-gray-600">{agendamento.aula?.nome || "Aula"}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 w-5 p-0" 
                              onClick={() => handleRemoverAgendamento(agendamento)}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={dialogoExclusaoAberto} onOpenChange={setDialogoExclusaoAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Agendamento</DialogTitle>
          </DialogHeader>
          {agendamentoSelecionado && (
            <ConfirmacaoExclusaoAgendamento
              agendamento={agendamentoSelecionado}
              onConfirmar={() => {
                setDialogoExclusaoAberto(false);
                onAgendamentoAtualizado();
              }}
              onCancelar={() => setDialogoExclusaoAberto(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}