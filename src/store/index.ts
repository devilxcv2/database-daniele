import { create } from 'zustand';
import { Product, Quote, Supplier } from '../types';

interface Store {
  products: Product[];
  quotes: Quote[];
  suppliers: Supplier[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addQuote: (quote: Omit<Quote, 'id' | 'dataCreazione'>) => void;
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  products: [],
  quotes: [],
  suppliers: [],
  
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, { ...product, id: crypto.randomUUID() }],
    })),
    
  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...product } : p
      ),
    })),
    
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
    
  addQuote: (quote) =>
    set((state) => ({
      quotes: [
        ...state.quotes,
        {
          ...quote,
          id: crypto.randomUUID(),
          dataCreazione: new Date().toISOString(),
        },
      ],
    })),
    
  updateQuote: (id, quote) =>
    set((state) => ({
      quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...quote } : q)),
    })),
    
  deleteQuote: (id) =>
    set((state) => ({
      quotes: state.quotes.filter((q) => q.id !== id),
    })),

  addSupplier: (supplier) =>
    set((state) => ({
      suppliers: [...state.suppliers, { ...supplier, id: crypto.randomUUID() }],
    })),

  updateSupplier: (id, supplier) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) =>
        s.id === id ? { ...s, ...supplier } : s
      ),
    })),

  deleteSupplier: (id) =>
    set((state) => ({
      suppliers: state.suppliers.filter((s) => s.id !== id),
    })),
}));