import { Output } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { History } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OutputHistoryProps {
  outputs: Output[];
}

export function OutputHistory({ outputs }: OutputHistoryProps) {
  if (outputs.length === 0) {
    return (
      <div className="empty-state">
        <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="font-medium">Nenhuma saída registrada</p>
        <p className="text-sm mt-1">
          As saídas de materiais aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead className="text-right">Quantidade</TableHead>
          <TableHead>Destino</TableHead>
          <TableHead>Responsável</TableHead>
          <TableHead>Registrado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {outputs.map((output) => (
          <TableRow key={output.id}>
            <TableCell>
              {format(parseISO(output.date), 'dd/MM/yyyy', { locale: ptBR })}
            </TableCell>
            <TableCell className="font-medium">{output.productName}</TableCell>
            <TableCell className="text-right font-semibold">
              -{output.quantity}
            </TableCell>
            <TableCell>{output.destination}</TableCell>
            <TableCell>{output.responsibleName || '—'}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {format(parseISO(output.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                locale: ptBR,
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
