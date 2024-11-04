import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Magazzino from './pages/Magazzino';
import Preventivi from './pages/Preventivi';
import Fornitori from './pages/Fornitori';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="magazzino" element={<Magazzino />} />
          <Route path="preventivi" element={<Preventivi />} />
          <Route path="fornitori" element={<Fornitori />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}