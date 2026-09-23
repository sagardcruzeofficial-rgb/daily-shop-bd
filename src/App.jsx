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
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans">
      <div>
        <Navbar />
        
        {/* Banner Section */}
        {activeTab === 'Home' && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 mb-8 shadow-inner">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="bg-orange-500 text-xs font-extrabold uppercase px-3 py-1 rounded-full">Exclusive Offers</span>
                <h2 className="text-4xl font-black mt-3 mb-2">Welcome to Daily Shop BD</h2>
                <p className="text-blue-100 text-sm max-w-lg">Find the best products at unbeatable prices. Fast delivery all across Bangladesh.</p>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 pb-12">
          {activeTab === 'Home' && (
            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                  <p className="text-xs text-gray-500 mt-1">Explore top items picked for you</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'Home' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{activeTab}</h2>
              <p className="text-gray-500 text-sm">Content for {activeTab} will appear here.</p>
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
