import React, { useContext } from 'react';
import Navbar from './components/Navbar';
import CategorySidebar from './components/CategorySidebar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import AdminView from './components/AdminView';
import Footer from './components/Footer';
import { StoreContext } from './context/StoreContext';

export default function App() {
  const { products, categories, activeTab } = useContext(StoreContext);

  // Check if secret admin route is requested via URL "?admin=true"
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminPath = urlParams.get('admin') === 'true';

  if (isAdminPath) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <AdminView />
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-[1300px] mx-auto px-4 py-6">
          {activeTab === 'Home' ? (
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Left Category Menu */}
              <CategorySidebar />

              {/* Right Blogger Style Category Blocks */}
              <div className="flex-1 space-y-10">
                {categories.map((cat) => {
                  const categoryProducts = products.filter(p => p.category === cat);
                  if (categoryProducts.length === 0) return null;

                  return (
                    <div key={cat} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                        <h2 className="text-lg font-black text-gray-900 border-l-4 border-[#f57224] pl-3">
                          {cat} Section
                        </h2>
                        <span className="text-xs text-orange-600 font-bold">Featured Items</span>
                      </div>

                      {/* 4-column grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categoryProducts.map((prod) => (
                          <ProductCard key={prod.id} product={prod} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow border min-h-[350px]">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeTab}</h2>
              <p className="text-gray-600 text-sm">Welcome to the {activeTab} page of DailyShop BD.</p>
            </div>
          )}
        </div>
      </main>

      <ProductDetailModal />
      <Footer />
    </div>
  );
}
