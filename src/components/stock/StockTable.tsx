import { Product } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package } from 'lucide-react';

interface StockTableProps {
  products: Product[];
  searchTerm: string;
}

export function StockTable({ products, searchTerm }: StockTableProps) {
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="empty-state">
        <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="font-medium">Nenhum produto encontrado</p>
        <p className="text-sm mt-1">
          {searchTerm
            ? 'Tente buscar com outros termos'
            : 'Cadastre produtos para visualizar o estoque'}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead>Cadastrado por</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="text-muted-foreground max-w-xs truncate">
              {product.description || '—'}
            </TableCell>
            <TableCell>{product.unit}</TableCell>
            <TableCell className="text-right font-semibold">
              {product.quantity}
            </TableCell>
            <TableCell>{product.responsibleName || '—'}</TableCell>
            <TableCell className="text-right">
              {product.quantity <= 0 ? (
                <span className="badge-low-stock">Sem estoque</span>
              ) : product.quantity <= 5 ? (
                <span className="badge-low-stock">Estoque baixo</span>
              ) : (
                <span className="badge-in-stock">Disponível</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
