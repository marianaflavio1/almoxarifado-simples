export interface Product {
  id: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  createdAt: string;
}

export interface Output {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  destination: string;
  date: string;
  createdAt: string;
}
