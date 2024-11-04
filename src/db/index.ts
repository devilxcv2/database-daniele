import Dexie, { Table } from 'dexie';
import { Product, Quote, Supplier } from '../types';

export class ElettroGestDB extends Dexie {
  products!: Table<Product>;
  quotes!: Table<Quote>;
  suppliers!: Table<Supplier>;

  constructor() {
    super('elettrogest');
    
    this.version(1).stores({
      products: '++id, nome, codice, categoria, fornitoreId',
      quotes: '++id, nomeCliente, dataCreazione, stato',
      suppliers: '++id, ragioneSociale, partitaIva'
    });
  }
}

export const db = new ElettroGestDB();

// Add some example data if the database is empty
async function initializeDB() {
  const productCount = await db.products.count();
  const supplierCount = await db.suppliers.count();
  
  if (supplierCount === 0) {
    await db.suppliers.bulkAdd([
      {
        id: '1',
        ragioneSociale: 'Elettroforniture SpA',
        partitaIva: '12345678901',
        indirizzo: 'Via Roma 1, Milano',
        email: 'info@elettroforniture.it',
        telefono: '02123456',
        note: 'Fornitore principale'
      }
    ]);
  }

  if (productCount === 0) {
    await db.products.bulkAdd([
      {
        id: '1',
        nome: 'Interruttore Magnetotermico',
        codice: 'INT001',
        categoria: 'Interruttori',
        descrizione: 'Interruttore magnetotermico 16A',
        prezzo: 25.50,
        prezzoAcquisto: 15.30,
        iva: 22,
        quantita: 100,
        unita: 'pz',
        fornitoreId: '1',
        codiceFornitori: 'F001',
        specifiche: {},
        scortaMinima: 10,
        ubicazione: 'A1-B2',
        note: ''
      }
    ]);
  }
}

initializeDB();