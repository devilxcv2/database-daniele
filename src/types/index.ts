export interface Supplier {
  id: string;
  ragioneSociale: string;
  partitaIva: string;
  indirizzo: string;
  email: string;
  telefono: string;
  note: string;
}

export interface Product {
  id: string;
  nome: string;
  codice: string;
  categoria: string;
  descrizione: string;
  prezzo: number;
  prezzoAcquisto: number;
  iva: number;
  quantita: number;
  unita: string;
  fornitoreId: string;
  codiceFornitori: string;
  specifiche: Record<string, string>;
  scortaMinima: number;
  ubicazione: string;
  dataUltimoAcquisto?: string;
  note: string;
}

export interface QuoteItem extends Product {
  quantita: number;
  ricarico: number;
  sconto: number;
}

export interface Quote {
  id: string;
  nomeCliente: string;
  emailCliente: string;
  articoli: QuoteItem[];
  dataCreazione: string;
  stato: 'bozza' | 'inviato' | 'accettato' | 'rifiutato';
  totale: number;
  totaleImponibile: number;
  totaleIva: number;
  scontoTotale: number;
  note: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  ruolo: 'admin' | 'utente';
}