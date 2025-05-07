
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AgendamentoHorario } from "@/types/agenda";
import { removerAgendamento, formatarHorario, getDiaDaSemanaTexto } from "@/services/agendaService";

interface ConfirmacaoExclusaoAgendamentoProps {
  agendamento: AgendamentoHorario;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmacaoExclusaoAgendamento({
  agendamento,
  onConfirmar,
  onCancelar,
}: ConfirmacaoExclusaoAgendamentoProps) {
  const [carregando, setCarregando] = useState(false);

  const handleConfirmar = async () => {
    setCarregando(true);
    try {
      await removerAgendamento(agendamento.id);
      toast.success("Horário removido com sucesso");
      onConfirmar();
    } catch (error) {
      console.error("Erro ao remover agendamento:", error);
      toast.error("Erro ao remover horário");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-4">
      <p>
        Tem certeza que deseja remover este horário agendado?
      </p>
      
      <div className="bg-gray-50 p-3 rounded-md">
        <p><strong>Aluno:</strong> {agendamento.aluno?.nome || "Desconhecido"}</p>
        <p><strong>Aula:</strong> {agendamento.aula?.nome || "Desconhecida"}</p>
        <p>
          <strong>Horário:</strong> {getDiaDaSemanaTexto(agendamento.dia_semana)}, {formatarHorario(agendamento.hora_inicio)}
        </p>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancelar} disabled={carregando}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={handleConfirmar} disabled={carregando}>
          {carregando ? "Removendo..." : "Confirmar Exclusão"}
        </Button>
      </div>
    </div>
  );
}
