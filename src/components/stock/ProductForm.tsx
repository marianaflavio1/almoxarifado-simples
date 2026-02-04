import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { toTitleCase } from '@/lib/utils';

const UNITS = ['Unidade', 'Pacote', 'Metro'];

interface ProductFormProps {
  onSubmit: (product: {
    name: string;
    description: string;
    unit: string;
    quantity: number;
    responsibleName: string;
  }) => { product: { name: string; unit: string; quantity: number }; isNew: boolean; addedQuantity: number } | void;
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Erro',
        description: 'O nome do produto é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    if (!unit) {
      toast({
        title: 'Erro',
        description: 'Selecione uma unidade de medida.',
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

    const qty = parseInt(quantity) || 0;
    if (qty < 0) {
      toast({
        title: 'Erro',
        description: 'A quantidade não pode ser negativa.',
        variant: 'destructive',
      });
      return;
    }

    const result = onSubmit({
      name: name.trim(),
      description: description.trim(),
      unit,
      quantity: qty,
      responsibleName: toTitleCase(responsibleName),
    });

    // Reset form
    setName('');
    setDescription('');
    setUnit('');
    setQuantity('');
    setResponsibleName('');

    // Mensagem de confirmação baseada no resultado
    if (result && typeof result === 'object' && 'isNew' in result) {
      if (result.isNew) {
        toast({
          title: 'Produto Cadastrado!',
          description: `"${result.product.name}" adicionado ao estoque com ${result.addedQuantity} ${result.product.unit.toLowerCase()}(s).`,
        });
      } else {
        toast({
          title: 'Estoque Atualizado!',
          description: `Foram adicionadas ${result.addedQuantity} ${result.product.unit.toLowerCase()}(s) ao produto "${result.product.name}". Nova quantidade total: ${result.product.quantity}.`,
        });
      }
    } else {
      toast({
        title: 'Sucesso!',
        description: 'Operação realizada com sucesso.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Produto *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Papel A4"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição detalhada do produto (opcional)"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unit">Unidade de Medida *</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantidade Inicial</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsibleName">Nome do Responsável *</Label>
        <Input
          id="responsibleName"
          value={responsibleName}
          onChange={(e) => setResponsibleName(e.target.value)}
          placeholder="Nome de quem está cadastrando"
        />
        <p className="text-xs text-muted-foreground">
          Informe o nome da pessoa responsável por este cadastro
        </p>
      </div>

      <Button type="submit" className="w-full">
        Cadastrar Produto
      </Button>
    </form>
  );
}
