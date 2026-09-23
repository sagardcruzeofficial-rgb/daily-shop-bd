import React, { useContext } from 'react';
import Navbar from './components/Navbar';
import CategorySidebar from './components/CategorySidebar';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import { StoreContext } from './context/StoreContext';

export default function App() {
  const { products, activeTab } = useContext(StoreContext);

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col justify-between font-sans">
      <Navbar />

      <main className="max-w-[1300px] w-full mx-auto px-4 py-6 flex-1">
        {activeTab === 'Home' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Category Sidebar - Always Visible */}
            <CategorySidebar />

            {/* Right Product Grid */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-4 bg-white p-3 rounded shadow-sm border-l-4 border-[#f57224]">
                Flash Sale & Featured Products
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
