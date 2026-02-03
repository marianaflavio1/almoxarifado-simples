import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { AdminAdjustmentForm } from '@/components/stock/AdminAdjustmentForm';
import { DeleteProductDialog } from '@/components/stock/DeleteProductDialog';
import { useProducts } from '@/hooks/useProducts';
import { useMovements } from '@/hooks/useMovements';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function AdminPanelPage() {
  const { products, setProductQuantity, deleteProduct } = useProducts();
  const { addMovement } = useMovements();
  const { toast } = useToast();
  
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAdjustment = (data: {
    productId: string;
    productName: string;
    previousQuantity: number;
    newQuantity: number;
    responsibleName: string;
  }) => {
    const result = setProductQuantity(data.productId, data.newQuantity);

    if (result.success) {
      addMovement({
        type: 'ajuste',
        productId: data.productId,
        productName: data.productName,
        previousQuantity: data.previousQuantity,
        newQuantity: data.newQuantity,
        difference: data.newQuantity - data.previousQuantity,
        responsibleName: data.responsibleName,
        date: new Date().toISOString(),
      });
    }

    return result;
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = (responsibleName: string) => {
    if (!productToDelete) return;

    const result = deleteProduct(productToDelete.id);

    if (result.success && result.deletedProduct) {
      addMovement({
        type: 'exclusao',
        productId: result.deletedProduct.id,
        productName: result.deletedProduct.name,
        previousQuantity: result.deletedProduct.quantity,
        newQuantity: 0,
        difference: -result.deletedProduct.quantity,
        responsibleName: responsibleName,
        date: new Date().toISOString(),
      });

      toast({
        title: 'Produto excluído',
        description: `O produto "${result.deletedProduct.name}" foi removido permanentemente do estoque.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: result.error || 'Não foi possível excluir o produto.',
      });
    }

    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Painel do Administrador</h1>
        <p className="page-description">
          Gerencie manualmente as quantidades dos produtos em estoque
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ajuste de Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminAdjustmentForm products={products} onSubmit={handleAdjustment} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtos em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum produto cadastrado ainda.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteClick(product)}
                          title="Excluir produto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteProductDialog
        product={productToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </Layout>
  );
}
