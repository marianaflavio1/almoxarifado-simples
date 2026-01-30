import { Layout } from '@/components/layout/Layout';
import { ProductForm } from '@/components/stock/ProductForm';
import { useProducts } from '@/hooks/useProducts';

export default function RegisterProductPage() {
  const { addProduct } = useProducts();

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
          <ProductForm onSubmit={addProduct} />
        </div>
      </div>
    </Layout>
  );
}
