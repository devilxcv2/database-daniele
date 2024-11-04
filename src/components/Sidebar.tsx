import React from 'react';
import { LayoutDashboard, Package, FileText, Truck, Settings, Users, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Magazzino', href: '/magazzino', icon: Package },
  { name: 'Preventivi', href: '/preventivi', icon: FileText },
  { name: 'Fornitori', href: '/fornitori', icon: Truck },
  { name: 'Impostazioni', href: '/impostazioni', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <Package className="h-8 w-8 text-blue-500" />
        <span className="ml-2 text-xl font-bold">ElettroGest</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                location.pathname === item.href
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <button className="flex w-full items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
          <LogOut className="mr-2 h-4 w-4" />
          Esci
        </button>
      </div>
    </div>
  );
}