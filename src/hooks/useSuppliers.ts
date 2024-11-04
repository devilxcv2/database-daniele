import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Supplier } from '../types';

export function useSuppliers() {
  const suppliers = useLiveQuery(() => db.suppliers.toArray());

  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    await db.suppliers.add(supplier as Supplier);
  };

  const updateSupplier = async (id: string, supplier: Partial<Supplier>) => {
    await db.suppliers.update(id, supplier);
  };

  const deleteSupplier = async (id: string) => {
    await db.suppliers.delete(id);
  };

  return {
    suppliers: suppliers ?? [],
    addSupplier,
    updateSupplier,
    deleteSupplier,
  };
}