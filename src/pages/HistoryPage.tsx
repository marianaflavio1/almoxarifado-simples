import { Layout } from '@/components/layout/Layout';
import { OutputHistory } from '@/components/stock/OutputHistory';
import { useOutputs } from '@/hooks/useOutputs';

export default function HistoryPage() {
  const { outputs } = useOutputs();

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Histórico de Saídas</h1>
        <p className="page-description">
          Visualize todas as saídas de materiais registradas
        </p>
      </div>

      <div className="table-container">
        <OutputHistory outputs={outputs} />
      </div>
    </Layout>
  );
}
