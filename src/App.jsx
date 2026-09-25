import React, { useContext } from 'react';
import Navbar from './components/Navbar';
import CategorySidebar from './components/CategorySidebar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import AdminView from './components/AdminView';
import CheckoutPage from './components/CheckoutPage';
import Footer from './components/Footer';
import { StoreContext } from './context/StoreContext';

export default function App() {
  const store = useContext(StoreContext);

  // StoreContext ready/loaded naki check
  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <p className="text-gray-600 font-bold">Loading DailyShopBD Store...</p>
      </div>
    );
  }

  const { products = [], categories = [], activeTab = 'Home' } = store;

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const isAdminDomain = currentHost.includes('admin') || urlParams.get('admin') === 'true';

  if (isAdminDomain) {
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
        {activeTab === 'Checkout' ? (
          <CheckoutPage />
        ) : activeTab === 'Home' ? (
          <div className="max-w-[1300px] mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <CategorySidebar />

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
          </div>
        ) : (
          <div className="max-w-[1300px] mx-auto px-4 py-6">
            <div className="bg-white p-8 rounded-xl shadow border min-h-[350px]">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeTab}</h2>
              <p className="text-gray-600 text-sm">Welcome to the {activeTab} page of DailyShopBD.</p>
            </div>
          </div>
        )}
      </main>

      <ProductDetailModal />
      <Footer />
    </div>
  );
}
