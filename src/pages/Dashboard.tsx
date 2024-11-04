import { Package, FileText, Truck, TrendingUp } from 'lucide-react';
import { useStore } from '../store';

export default function Dashboard() {
  const { products, quotes, suppliers } = useStore();

  const stats = [
    {
      name: 'Prodotti in Magazzino',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Preventivi Attivi',
      value: quotes.filter(q => q.stato === 'inviato').length,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      name: 'Fornitori',
      value: suppliers.length,
      icon: Truck,
      color: 'bg-purple-500',
    },
    {
      name: 'Valore Magazzino',
      value: new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
      }).format(
        products.reduce((acc, product) => acc + product.prezzo * product.quantita, 0)
      ),
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`rounded-md ${stat.color} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </p>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}