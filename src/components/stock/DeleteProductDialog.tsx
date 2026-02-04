import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product } from '@/types';
import { toTitleCase } from '@/lib/utils';

interface DeleteProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (responsibleName: string) => void;
}

export function DeleteProductDialog({
  product,
  open,
  onOpenChange,
  onConfirm,
}: DeleteProductDialogProps) {
  const [responsibleName, setResponsibleName] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!responsibleName.trim()) {
      setError('O nome do responsável é obrigatório.');
      return;
    }
    onConfirm(toTitleCase(responsibleName));
    setResponsibleName('');
    setError('');
  };

  const handleCancel = () => {
    setResponsibleName('');
    setError('');
    onOpenChange(false);
  };

  if (!product) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              Você está prestes a excluir o produto{' '}
              <strong className="text-foreground">{product.name}</strong>.
            </span>
            <span className="block">
              Quantidade atual em estoque: <strong className="text-foreground">{product.quantity} {product.unit}</strong>
            </span>
            <span className="block text-destructive font-medium">
              Esta ação é irreversível e o produto será removido permanentemente.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="responsible-name">
            Nome do Responsável pela Exclusão <span className="text-destructive">*</span>
          </Label>
          <Input
            id="responsible-name"
            value={responsibleName}
            onChange={(e) => {
              setResponsibleName(e.target.value);
              setError('');
            }}
            placeholder="Digite o nome do responsável"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir Permanentemente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
