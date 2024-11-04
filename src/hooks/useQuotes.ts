import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Quote } from '../types';

export function useQuotes() {
  const quotes = useLiveQuery(() => db.quotes.toArray());

  const addQuote = async (quote: Omit<Quote, 'id' | 'dataCreazione'>) => {
    const newQuote = {
      ...quote,
      dataCreazione: new Date().toISOString(),
    } as Quote;
    await db.quotes.add(newQuote);
  };

  const updateQuote = async (id: string, quote: Partial<Quote>) => {
    await db.quotes.update(id, quote);
  };

  const deleteQuote = async (id: string) => {
    await db.quotes.delete(id);
  };

  return {
    quotes: quotes ?? [],
    addQuote,
    updateQuote,
    deleteQuote,
  };
}