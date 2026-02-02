import { Layout } from '@/components/layout/Layout';
import { AdminAdjustmentForm } from '@/components/stock/AdminAdjustmentForm';
import { useProducts } from '@/hooks/useProducts';
import { useMovements } from '@/hooks/useMovements';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPanelPage() {
  const { products, setProductQuantity } = useProducts();
  const { addMovement } = useMovements();

  const handleAdjustment = (data: {
    productId: string;
    productName: string;
    previousQuantity: number;
    newQuantity: number;
    responsibleName: string;
  }) => {
    const result = setProductQuantity(data.productId, data.newQuantity);

    if (result.success) {
      // Register movement
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
