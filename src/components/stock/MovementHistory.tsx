import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StockMovement, MovementType } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MovementHistoryProps {
  movements: StockMovement[];
}

const typeConfig: Record<MovementType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  entrada: { label: 'Entrada', variant: 'default' },
  saida: { label: 'Saída', variant: 'destructive' },
  ajuste: { label: 'Ajuste Admin', variant: 'secondary' },
  exclusao: { label: 'Exclusão', variant: 'outline' },
};

export function MovementHistory({ movements }: MovementHistoryProps) {
  if (movements.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhuma movimentação registrada ainda.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Destino/Observação</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements.map((movement) => {
          const config = typeConfig[movement.type];
          return (
            <TableRow key={movement.id}>
              <TableCell>
                <Badge variant={config.variant}>{config.label}</Badge>
              </TableCell>
              <TableCell className="font-medium">{movement.productName}</TableCell>
              <TableCell>
                {movement.type === 'ajuste' ? (
                  <span>
                    {movement.previousQuantity} → {movement.newQuantity}{' '}
                    <span className={movement.difference > 0 ? 'text-primary' : 'text-destructive'}>
                      ({movement.difference > 0 ? `+${movement.difference}` : movement.difference})
                    </span>
                  </span>
                ) : movement.type === 'entrada' ? (
                  <span className="text-primary">+{movement.difference}</span>
                ) : movement.type === 'exclusao' ? (
                  <span className="text-muted-foreground">{movement.previousQuantity} (removido)</span>
                ) : (
                  <span className="text-destructive">{movement.difference}</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {movement.destination || '-'}
              </TableCell>
              <TableCell>{movement.responsibleName}</TableCell>
              <TableCell>
                {format(new Date(movement.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
