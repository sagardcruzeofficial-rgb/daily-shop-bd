import React, { useContext } from 'react';
import Navbar from './components/Navbar';
import CategorySidebar from './components/CategorySidebar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import AdminView from './components/AdminView';
import Footer from './components/Footer';
import { StoreContext } from './context/StoreContext';

export default function App() {
  const { products, selectedCategory, activeTab, viewMode } = useContext(StoreContext);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1">
        {viewMode === 'admin' ? (
          <AdminView />
        ) : (
          <div className="max-w-[1300px] mx-auto px-4 py-6">
            {activeTab === 'Home' ? (
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Category Bar - Always Visible */}
                <CategorySidebar />

                {/* Right Product Grid (4 columns) */}
                <div className="flex-1">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-between items-center">
                    <h2 className="text-lg font-black text-gray-900 border-l-4 border-[#f57224] pl-3">
                      {selectedCategory} Products ({filteredProducts.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow border border-gray-200 min-h-[350px]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeTab}</h2>
                <p className="text-gray-600 text-sm">Welcome to the {activeTab} page of DailyShop BD.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <ProductDetailModal />
      <Footer />
    </div>
  );
}
