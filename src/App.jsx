import React, { useContext } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import Footer from './components/Footer';
import AdminView from './components/AdminView';
import { StoreContext } from './context/StoreContext';

function AppContent() {
  const { products, activeTab } = useContext(StoreContext);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div>
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'Home' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'Home' && (
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">{activeTab}</h2>
              <p className="text-gray-600">This is the {activeTab} page for Daily Shop BD.</p>
            </div>
          )}
        </main>
      </div>

      <ProductDetailModal />
      <AdminView />
      <Footer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
