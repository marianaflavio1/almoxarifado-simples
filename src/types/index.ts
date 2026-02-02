export interface Product {
  id: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  responsibleName: string;
  createdAt: string;
}

export interface Output {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  destination: string;
  responsibleName: string;
  date: string;
  createdAt: string;
}

export type MovementType = 'entrada' | 'saida' | 'ajuste';

export interface StockMovement {
  id: string;
  type: MovementType;
  productId: string;
  productName: string;
  previousQuantity: number;
  newQuantity: number;
  difference: number;
  destination?: string;
  responsibleName: string;
  date: string;
  createdAt: string;
}
