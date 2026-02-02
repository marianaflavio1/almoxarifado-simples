import { Layout } from '@/components/layout/Layout';
import { MovementHistory } from '@/components/stock/MovementHistory';
import { useMovements } from '@/hooks/useMovements';

export default function HistoryPage() {
  const { movements } = useMovements();

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Histórico de Movimentações</h1>
        <p className="page-description">
          Visualize todas as entradas, saídas e ajustes de estoque
        </p>
      </div>

      <div className="table-container">
        <MovementHistory movements={movements} />
      </div>
    </Layout>
  );
}
