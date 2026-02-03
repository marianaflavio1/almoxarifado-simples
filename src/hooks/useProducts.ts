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

  const formatProductName = (name: string): string => {
    const trimmed = name.trim();
    if (!trimmed) return '';
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const findProductByName = (name: string) => {
    const normalizedName = name.trim().toLowerCase();
    return products.find((p) => p.name.trim().toLowerCase() === normalizedName);
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): { product: Product; isNew: boolean; addedQuantity: number } => {
    const formattedName = formatProductName(product.name);
    const existingProduct = findProductByName(formattedName);
    
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

    // Produto novo - criar registro com nome padronizado
    const newProduct: Product = {
      ...product,
      name: formattedName,
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

  const setProductQuantity = (productId: string, newQuantity: number): { success: boolean; previousQuantity?: number; error?: string } => {
    if (newQuantity < 0) {
      return { success: false, error: 'Não é possível definir quantidade negativa.' };
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, error: 'Produto não encontrado.' };
    }

    const previousQuantity = product.quantity;
    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, quantity: newQuantity } : p
    );
    saveProducts(updatedProducts);
    return { success: true, previousQuantity };
  };

  const getProduct = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  return {
    products,
    addProduct,
    updateProductQuantity,
    setProductQuantity,
    getProduct,
    findProductByName,
  };
}
