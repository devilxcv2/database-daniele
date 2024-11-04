import { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useQuotes } from '../hooks/useQuotes';
import { useProducts } from '../hooks/useProducts';
import { Quote, QuoteItem } from '../types';

export default function Preventivi() {
  const { quotes, addQuote, updateQuote, deleteQuote } = useQuotes();
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const selectedProducts = products.filter(p => 
      (formData.get(`product_${p.id}`) as string) === 'true'
    );
    
    const quoteItems: QuoteItem[] = selectedProducts.map(product => ({
      ...product,
      quantita: parseInt(formData.get(`quantity_${product.id}`) as string) || 1,
      ricarico: parseFloat(formData.get(`markup_${product.id}`) as string) || 0,
      sconto: parseFloat(formData.get(`discount_${product.id}`) as string) || 0,
    }));

    const totaleImponibile = quoteItems.reduce((acc, item) => {
      const prezzoBase = item.prezzo * (1 + item.ricarico / 100);
      const prezzoScontato = prezzoBase * (1 - item.sconto / 100);
      return acc + (prezzoScontato * item.quantita);
    }, 0);

    const totaleIva = quoteItems.reduce((acc, item) => {
      const prezzoBase = item.prezzo * (1 + item.ricarico / 100);
      const prezzoScontato = prezzoBase * (1 - item.sconto / 100);
      return acc + (prezzoScontato * item.quantita * (item.iva / 100));
    }, 0);

    const quoteData = {
      nomeCliente: formData.get('nomeCliente') as string,
      emailCliente: formData.get('emailCliente') as string,
      articoli: quoteItems,
      stato: 'bozza' as const,
      totale: totaleImponibile + totaleIva,
      totaleImponibile,
      totaleIva,
      scontoTotale: quoteItems.reduce((acc, item) => acc + item.sconto, 0),
      note: formData.get('note') as string,
    };

    try {
      if (editingQuote) {
        await updateQuote(editingQuote.id, quoteData);
      } else {
        await addQuote(quoteData);
      }
      setIsModalOpen(false);
      setEditingQuote(null);
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Si è verificato un errore durante il salvataggio del preventivo.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Preventivi</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Preventivo
        </button>
      </div>

      <div className="mt-6 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca preventivi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Totale
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredQuotes.map((quote) => (
              <tr key={quote.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {quote.nomeCliente}
                  </div>
                  <div className="text-sm text-gray-500">
                    {quote.emailCliente}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(quote.dataCreazione).toLocaleDateString('it-IT')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${quote.stato === 'accettato' ? 'bg-green-100 text-green-800' : ''}
                    ${quote.stato === 'inviato' ? 'bg-blue-100 text-blue-800' : ''}
                    ${quote.stato === 'bozza' ? 'bg-gray-100 text-gray-800' : ''}
                    ${quote.stato === 'rifiutato' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {quote.stato.charAt(0).toUpperCase() + quote.stato.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.NumberFormat('it-IT', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(quote.totale)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingQuote(quote);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteQuote(quote.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingQuote ? 'Modifica Preventivo' : 'Nuovo Preventivo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome Cliente
                  </label>
                  <input
                    type="text"
                    name="nomeCliente"
                    defaultValue={editingQuote?.nomeCliente}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Cliente
                  </label>
                  <input
                    type="email"
                    name="emailCliente"
                    defaultValue={editingQuote?.emailCliente}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Prodotti</h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2"></th>
                        <th className="px-4 py-2 text-left">Prodotto</th>
                        <th className="px-4 py-2 text-left">Quantità</th>
                        <th className="px-4 py-2 text-left">Ricarico %</th>
                        <th className="px-4 py-2 text-left">Sconto %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => {
                        const quoteItem = editingQuote?.articoli.find(
                          (item) => item.id === product.id
                        );
                        return (
                          <tr key={product.id}>
                            <td className="px-4 py-2">
                              <input
                                type="checkbox"
                                name={`product_${product.id}`}
                                defaultChecked={!!quoteItem}
                                className="rounded border-gray-300 text-blue-600"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <div className="text-sm font-medium text-gray-900">
                                {product.nome}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.codice}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                name={`quantity_${product.id}`}
                                defaultValue={quoteItem?.quantita || 1}
                                min="1"
                                className="w-20 rounded-md border border-gray-300 px-2 py-1"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                name={`markup_${product.id}`}
                                defaultValue={quoteItem?.ricarico || 0}
                                step="0.1"
                                className="w-20 rounded-md border border-gray-300 px-2 py-1"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                name={`discount_${product.id}`}
                                defaultValue={quoteItem?.sconto || 0}
                                step="0.1"
                                className="w-20 rounded-md border border-gray-300 px-2 py-1"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Note
                </label>
                <textarea
                  name="note"
                  rows={3}
                  defaultValue={editingQuote?.note}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingQuote(null);
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingQuote ? 'Aggiorna' : 'Salva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}