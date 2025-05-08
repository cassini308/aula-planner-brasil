
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export interface ConfirmacaoExclusaoProps {
  aberto: boolean;
  titulo?: string; // Adicionando como opcional
  mensagem: string;
  onConfirmar: () => Promise<void>;
  onCancelar: () => void;
}

export const ConfirmacaoExclusao = ({ 
  aberto, 
  titulo = "Confirmar Exclusão", // Valor padrão 
  mensagem, 
  onConfirmar, 
  onCancelar 
}: ConfirmacaoExclusaoProps) => {
  return (
    <AlertDialog open={aberto} onOpenChange={(open) => !open && onCancelar()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>
            {mensagem}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancelar}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={async () => {
              await onConfirmar();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
