
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { adicionarAgendamento } from "@/services/agendaService";
import { getAlunos } from "@/services/alunoService";
import { getAulas } from "@/services/aulaService";
import { Aluno, Aula } from "@/types/aula";

interface AdicionarHorarioProps {
  onAgendamentoAdicionado: () => void;
}

const formSchema = z.object({
  aluno_id: z.string({ required_error: "Selecione um aluno" }),
  aula_id: z.string({ required_error: "Selecione uma aula" }),
  dia_semana: z.string({ required_error: "Selecione o dia da semana" }),
  hora_inicio: z.string({ required_error: "Selecione a hora de início" }),
});

export function AdicionarHorario({ onAgendamentoAdicionado }: AdicionarHorarioProps) {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [carregando, setCarregando] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [dadosAlunos, dadosAulas] = await Promise.all([
          getAlunos(),
          getAulas(),
        ]);
        setAlunos(dadosAlunos);
        setAulas(dadosAulas);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      }
    };

    carregarDados();
  }, []);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setCarregando(true);
    try {
      await adicionarAgendamento({
        aluno_id: values.aluno_id,
        aula_id: values.aula_id,
        dia_semana: parseInt(values.dia_semana),
        hora_inicio: parseInt(values.hora_inicio),
      });
      
      onAgendamentoAdicionado();
      form.reset();
    } catch (error) {
      console.error("Erro ao adicionar agendamento:", error);
      toast.error("Erro ao adicionar horário");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="aluno_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {alunos.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aula_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aula</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma aula" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {aulas.map((aula) => (
                    <SelectItem key={aula.id} value={aula.id}>
                      {aula.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dia_semana"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia da Semana</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Segunda-feira</SelectItem>
                    <SelectItem value="2">Terça-feira</SelectItem>
                    <SelectItem value="3">Quarta-feira</SelectItem>
                    <SelectItem value="4">Quinta-feira</SelectItem>
                    <SelectItem value="5">Sexta-feira</SelectItem>
                    <SelectItem value="6">Sábado</SelectItem>
                    <SelectItem value="0">Domingo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hora_inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 14 }, (_, i) => i + 7).map((hora) => (
                      <SelectItem key={hora} value={hora.toString()}>
                        {`${hora}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={carregando}>
            {carregando ? "Adicionando..." : "Adicionar Horário"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
