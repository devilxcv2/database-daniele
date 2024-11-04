import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Product } from '../types';

export function useProducts() {
  const products = useLiveQuery(() => db.products.toArray());

  const addProduct = async (product: Omit<Product, 'id'>) => {
    await db.products.add(product as Product);
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    await db.products.update(id, product);
  };

  const deleteProduct = async (id: string) => {
    await db.products.delete(id);
  };

  return {
    products: products ?? [],
    addProduct,
    updateProduct,
    deleteProduct,
  };
}