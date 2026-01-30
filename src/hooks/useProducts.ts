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

  const findProductByName = (name: string) => {
    const normalizedName = name.trim().toLowerCase();
    return products.find((p) => p.name.trim().toLowerCase() === normalizedName);
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): { product: Product; isNew: boolean; addedQuantity: number } => {
    const existingProduct = findProductByName(product.name);
    
    if (existingProduct) {
      // Produto já existe - somar quantidade
      const updatedProducts = products.map((p) =>
        p.id === existingProduct.id
          ? { ...p, quantity: p.quantity + product.quantity }
          : p
      );
      saveProducts(updatedProducts);
      return {
        product: { ...existingProduct, quantity: existingProduct.quantity + product.quantity },
        isNew: false,
        addedQuantity: product.quantity,
      };
    }

    // Produto novo - criar registro
    const newProduct: Product = {
      ...product,
      name: product.name.trim(),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveProducts([...products, newProduct]);
    return { product: newProduct, isNew: true, addedQuantity: product.quantity };
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
    findProductByName,
  };
}
