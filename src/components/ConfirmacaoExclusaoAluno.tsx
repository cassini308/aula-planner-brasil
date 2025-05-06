
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

interface ConfirmacaoExclusaoAlunoProps {
  aberto: boolean;
  alunoName: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

const ConfirmacaoExclusaoAluno: React.FC<ConfirmacaoExclusaoAlunoProps> = ({
  aberto,
  alunoName,
  onConfirmar,
  onCancelar
}) => {
  return (
    <AlertDialog open={aberto} onOpenChange={onCancelar}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir o aluno <strong>"{alunoName}"</strong>? 
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

export default ConfirmacaoExclusaoAluno;
