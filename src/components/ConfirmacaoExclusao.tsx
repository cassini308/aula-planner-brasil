
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmacaoExclusaoProps {
  aberto: boolean;
  aulaName: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

const ConfirmacaoExclusao: React.FC<ConfirmacaoExclusaoProps> = ({
  aberto,
  aulaName,
  onConfirmar,
  onCancelar
}) => {
  return (
    <AlertDialog open={aberto} onOpenChange={onCancelar}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir a aula <strong>"{aulaName}"</strong>? 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmar}
            className="bg-red-500 hover:bg-red-600"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmacaoExclusao;
