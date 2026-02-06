import { useState, useEffect } from 'react';
import { Output } from '@/types';

const STORAGE_KEY = 'inventory_outputs';

export function useOutputs() {
  const [outputs, setOutputs] = useState<Output[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: Output[] = JSON.parse(stored);
      // Migrar registros existentes para MAIÚSCULAS
      const migrated = parsed.map((o) => ({
        ...o,
        productName: o.productName?.trim().toUpperCase() ?? '',
        destination: o.destination?.trim().toUpperCase() ?? '',
        responsibleName: o.responsibleName?.trim().toUpperCase() ?? '',
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      setOutputs(migrated);
    }
  }, []);

  const saveOutputs = (newOutputs: Output[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOutputs));
    setOutputs(newOutputs);
  };

  const addOutput = (output: Omit<Output, 'id' | 'createdAt'>) => {
    const newOutput: Output = {
      ...output,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveOutputs([newOutput, ...outputs]);
    return newOutput;
  };

  return {
    outputs,
    addOutput,
  };
}
