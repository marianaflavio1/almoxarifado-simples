import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface AdminAdjustmentFormProps {
  products: Product[];
  onSubmit: (data: {
    productId: string;
    productName: string;
    previousQuantity: number;
    newQuantity: number;
    responsibleName: string;
  }) => { success: boolean; error?: string };
}

export function AdminAdjustmentForm({ products, onSubmit }: AdminAdjustmentFormProps) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const { toast } = useToast();

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const currentQuantity = selectedProduct?.quantity ?? 0;
  const parsedNewQuantity = parseInt(newQuantity) || 0;
  const difference = parsedNewQuantity - currentQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId) {
      toast({
        title: 'Erro',
        description: 'Selecione um produto.',
        variant: 'destructive',
      });
      return;
    }

    if (!responsibleName.trim()) {
      toast({
        title: 'Erro',
        description: 'O nome do responsável é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    if (newQuantity === '' || parsedNewQuantity < 0) {
      toast({
        title: 'Erro',
        description: 'Informe uma quantidade válida (não negativa).',
        variant: 'destructive',
      });
      return;
    }

    const result = onSubmit({
      productId: selectedProductId,
      productName: selectedProduct!.name,
      previousQuantity: currentQuantity,
      newQuantity: parsedNewQuantity,
      responsibleName: responsibleName.trim(),
    });

    if (result.success) {
      toast({
        title: 'Estoque Ajustado!',
        description: `"${selectedProduct!.name}" alterado de ${currentQuantity} para ${parsedNewQuantity} ${selectedProduct!.unit.toLowerCase()}(s).`,
      });
      setSelectedProductId('');
      setNewQuantity('');
      setResponsibleName('');
    } else {
      toast({
        title: 'Erro',
        description: result.error || 'Falha ao ajustar estoque.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="product">Produto *</Label>
        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um produto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} ({product.quantity} {product.unit.toLowerCase()}(s))
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProduct && (
        <div className="p-4 bg-muted rounded-lg space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quantidade Atual:</span>
            <span className="font-semibold">{currentQuantity} {selectedProduct.unit.toLowerCase()}(s)</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newQuantity">Nova Quantidade *</Label>
            <Input
              id="newQuantity"
              type="number"
              min="0"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              placeholder="Digite a nova quantidade"
            />
          </div>

          {newQuantity !== '' && (
            <div className="flex items-center justify-between p-3 bg-background rounded border">
              <div className="flex items-center gap-2 text-sm">
                <span>{currentQuantity}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{parsedNewQuantity}</span>
              </div>
              <span className={`text-sm font-medium ${
                difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                {difference > 0 ? `+${difference}` : difference}
              </span>
            </div>
          )}

          {parsedNewQuantity < 0 && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Quantidade não pode ser negativa</span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="responsibleName">Nome do Responsável *</Label>
        <Input
          id="responsibleName"
          value={responsibleName}
          onChange={(e) => setResponsibleName(e.target.value)}
          placeholder="Nome de quem está fazendo o ajuste"
        />
        <p className="text-xs text-muted-foreground">
          Informe o nome do responsável pelo ajuste administrativo
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={!selectedProductId}>
        Confirmar Ajuste
      </Button>
    </form>
  );
}
