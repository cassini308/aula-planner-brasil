
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Aula, AulaFormData, Periodicidade } from '@/types/aula';

export interface FormularioAulaProps {
  onSalvar: (formData: AulaFormData) => Promise<void>;
  aulaParaEditar?: Aula;
  onCancelar?: () => void; // Tornando opcional
}

// Schema de validação com Zod
const aulaFormSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  valor: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'O valor deve ser um número positivo',
  }),
  periodicidade: z.enum(['mensal', 'trimestral', 'semestral', 'anual']),
  vezes_semanais: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 7, {
    message: 'As vezes semanais devem ser entre 1 e 7',
  }),
});

const FormularioAula: React.FC<FormularioAulaProps> = ({ 
  onSalvar, 
  aulaParaEditar,
  onCancelar = () => {} // Valor padrão
}) => {
  // Inicializar o formulário com react-hook-form e zod
  const form = useForm<z.infer<typeof aulaFormSchema>>({
    resolver: zodResolver(aulaFormSchema),
    defaultValues: {
      nome: '',
      valor: '',
      periodicidade: 'mensal',
      vezes_semanais: '1',
    },
  });

  // Preencher o formulário se houver uma aula para editar
  useEffect(() => {
    if (aulaParaEditar) {
      form.reset({
        nome: aulaParaEditar.nome,
        valor: aulaParaEditar.valor.toString(),
        periodicidade: aulaParaEditar.periodicidade,
        vezes_semanais: aulaParaEditar.vezes_semanais.toString(),
      });
    }
  }, [aulaParaEditar, form]);

  // Função para lidar com o envio do formulário
  const onSubmit = async (data: z.infer<typeof aulaFormSchema>) => {
    const aulaData: AulaFormData = {
      nome: data.nome,
      valor: Number(data.valor),
      periodicidade: data.periodicidade as Periodicidade,
      vezes_semanais: Number(data.vezes_semanais),
    };

    await onSalvar(aulaData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Aula</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ballet Infantil" {...field} />
              </FormControl>
              <FormDescription>
                Informe o nome completo da aula.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Ex: 150.00" {...field} />
              </FormControl>
              <FormDescription>
                Informe o valor da aula.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="periodicidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Periodicidade</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a periodicidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Define a periodicidade de cobrança.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vezes_semanais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vezes por Semana</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'vez' : 'vezes'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Quantas vezes por semana a aula é ministrada.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancelar && (
            <Button type="button" variant="outline" onClick={onCancelar}>
              Cancelar
            </Button>
          )}
          <Button type="submit">
            {aulaParaEditar ? 'Atualizar' : 'Cadastrar'} Aula
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormularioAula;
