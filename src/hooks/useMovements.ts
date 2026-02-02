import { useState, useEffect } from 'react';
import { StockMovement, MovementType } from '@/types';

const STORAGE_KEY = 'inventory_movements';

export function useMovements() {
  const [movements, setMovements] = useState<StockMovement[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMovements(JSON.parse(stored));
    }
  }, []);

  const saveMovements = (newMovements: StockMovement[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMovements));
    setMovements(newMovements);
  };

  const addMovement = (movement: Omit<StockMovement, 'id' | 'createdAt'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveMovements([newMovement, ...movements]);
    return newMovement;
  };

  const getMovements = () => movements;

  const getMovementsByType = (type: MovementType) => {
    return movements.filter((m) => m.type === type);
  };

  const getMovementsByProduct = (productId: string) => {
    return movements.filter((m) => m.productId === productId);
  };

  return {
    movements,
    addMovement,
    getMovements,
    getMovementsByType,
    getMovementsByProduct,
  };
}
