import { Layout } from '@/components/layout/Layout';
import { OutputForm } from '@/components/stock/OutputForm';
import { useProducts } from '@/hooks/useProducts';
import { useOutputs } from '@/hooks/useOutputs';

export default function OutputPage() {
  const { products, updateProductQuantity, getProduct } = useProducts();
  const { addOutput } = useOutputs();

  const handleOutput = (output: {
    productId: string;
    productName: string;
    quantity: number;
    destination: string;
    responsibleName: string;
    date: string;
  }) => {
    const product = getProduct(output.productId);

    if (!product) {
      return { success: false, error: 'Produto não encontrado.' };
    }

    if (output.quantity > product.quantity) {
      return {
        success: false,
        error: 'Quantidade indisponível no estoque.',
      };
    }

    // Register output
    addOutput(output);

    // Update product quantity
    updateProductQuantity(output.productId, -output.quantity);

    return { success: true };
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Registrar Saída</h1>
        <p className="page-description">
          Registre a saída de materiais do almoxarifado
        </p>
      </div>

      <div className="max-w-xl">
        <div className="form-section">
          <OutputForm products={products} onSubmit={handleOutput} />
        </div>
      </div>
    </Layout>
  );
}
