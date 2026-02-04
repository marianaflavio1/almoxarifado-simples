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
import { format } from 'date-fns';
import { toTitleCase } from '@/lib/utils';

interface OutputFormProps {
  products: Product[];
  onSubmit: (output: {
    productId: string;
    productName: string;
    quantity: number;
    destination: string;
    responsibleName: string;
    date: string;
  }) => { success: boolean; error?: string };
}

export function OutputForm({ products, onSubmit }: OutputFormProps) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [destination, setDestination] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { toast } = useToast();

  const selectedProduct = products.find((p) => p.id === productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      toast({
        title: 'Erro',
        description: 'Selecione um produto.',
        variant: 'destructive',
      });
      return;
    }

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      toast({
        title: 'Erro',
        description: 'Informe uma quantidade válida.',
        variant: 'destructive',
      });
      return;
    }

    if (!destination.trim()) {
      toast({
        title: 'Erro',
        description: 'Informe o destino da saída.',
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

    if (!date) {
      toast({
        title: 'Erro',
        description: 'Informe a data da saída.',
        variant: 'destructive',
      });
      return;
    }

    const result = onSubmit({
      productId,
      productName: selectedProduct?.name || '',
      quantity: qty,
      destination: destination.trim(),
      responsibleName: toTitleCase(responsibleName),
      date,
    });

    if (result.success) {
      setProductId('');
      setQuantity('');
      setDestination('');
      setResponsibleName('');
      setDate(format(new Date(), 'yyyy-MM-dd'));

      toast({
        title: 'Sucesso!',
        description: 'Saída registrada com sucesso.',
      });
    } else {
      toast({
        title: 'Erro',
        description: result.error || 'Erro ao registrar saída.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="product">Produto *</Label>
        <Select value={productId} onValueChange={setProductId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o produto" />
          </SelectTrigger>
          <SelectContent>
            {products.length === 0 ? (
              <SelectItem value="none" disabled>
                Nenhum produto cadastrado
              </SelectItem>
            ) : (
              products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} ({product.quantity} {product.unit.toLowerCase()}
                  {product.quantity !== 1 ? 's' : ''} disponíveis)
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedProduct && (
        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            Estoque disponível:{' '}
            <span className="font-semibold text-foreground">
              {selectedProduct.quantity} {selectedProduct.unit.toLowerCase()}
              {selectedProduct.quantity !== 1 ? 's' : ''}
            </span>
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantidade *</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          max={selectedProduct?.quantity || undefined}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantidade a retirar"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data da Saída *</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destino *</Label>
        <Input
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Ex: Setor Administrativo, Manutenção, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsibleName">Nome do Responsável *</Label>
        <Input
          id="responsibleName"
          value={responsibleName}
          onChange={(e) => setResponsibleName(e.target.value)}
          placeholder="Nome de quem está retirando"
        />
        <p className="text-xs text-muted-foreground">
          Informe o nome da pessoa responsável por esta retirada
        </p>
      </div>

      <Button type="submit" className="w-full">
        Registrar Saída
      </Button>
    </form>
  );
}
