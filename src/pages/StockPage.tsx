import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StockTable } from '@/components/stock/StockTable';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/useProducts';
import { Package, Search, AlertTriangle, CheckCircle } from 'lucide-react';

export default function StockPage() {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const totalProducts = products.length;
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockCount = products.filter((p) => p.quantity <= 5 && p.quantity > 0).length;
  const outOfStockCount = products.filter((p) => p.quantity <= 0).length;

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Controle de Estoque</h1>
        <p className="page-description">
          Visualize e gerencie todos os produtos do almoxarifado
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-value">{totalProducts}</p>
              <p className="stat-label">Produtos</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-value">{totalItems}</p>
              <p className="stat-label">Total em Estoque</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-value">{lowStockCount}</p>
              <p className="stat-label">Estoque Baixo</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Package className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="stat-value">{outOfStockCount}</p>
              <p className="stat-label">Sem Estoque</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="table-container">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <StockTable products={products} searchTerm={searchTerm} />
      </div>
    </Layout>
  );
}
