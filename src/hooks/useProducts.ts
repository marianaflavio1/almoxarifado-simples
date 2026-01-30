import { useState, useEffect } from 'react';
import { Product } from '@/types';

const STORAGE_KEY = 'inventory_products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProductQuantity = (productId: string, quantityChange: number) => {
    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, quantity: p.quantity + quantityChange } : p
    );
    saveProducts(updatedProducts);
  };

  const getProduct = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  return {
    products,
    addProduct,
    updateProductQuantity,
    getProduct,
  };
}
