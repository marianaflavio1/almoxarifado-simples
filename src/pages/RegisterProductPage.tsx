import { Layout } from '@/components/layout/Layout';
import { ProductForm } from '@/components/stock/ProductForm';
import { useProducts } from '@/hooks/useProducts';
import { useMovements } from '@/hooks/useMovements';

export default function RegisterProductPage() {
  const { addProduct } = useProducts();
  const { addMovement } = useMovements();

  const handleAddProduct = (product: {
    name: string;
    description: string;
    unit: string;
    quantity: number;
    responsibleName: string;
  }) => {
    const result = addProduct(product);

    // Register movement
    addMovement({
      type: 'entrada',
      productId: result.product.id || crypto.randomUUID(),
      productName: result.product.name,
      previousQuantity: result.isNew ? 0 : result.product.quantity - result.addedQuantity,
      newQuantity: result.product.quantity,
      difference: result.addedQuantity,
      responsibleName: product.responsibleName,
      date: new Date().toISOString(),
    });

    return result;
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Cadastrar Produto</h1>
        <p className="page-description">
          Adicione novos produtos ao estoque do almoxarifado
        </p>
      </div>

      <div className="max-w-xl">
        <div className="form-section">
          <ProductForm onSubmit={handleAddProduct} />
        </div>
      </div>
    </Layout>
  );
}
