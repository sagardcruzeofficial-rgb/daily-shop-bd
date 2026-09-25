import React, { useContext, useState, useEffect } from 'react';
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
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    // Check URL parameters or domain on initial load
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    
    if (currentHost.includes('admin') || urlParams.get('admin') === 'true') {
      setIsAdminView(true);
    }
  }, []);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <p className="text-gray-600 font-bold">Loading DailyShopBD Store...</p>
      </div>
    );
  }

  const { products = [], categories = [], activeTab = 'Home' } = store;

  // Render Admin View if true
  if (isAdminView) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="bg-black text-white px-6 py-2 flex justify-between items-center text-xs">
          <span>🛠️ Admin Control Panel - DailyShopBD</span>
          <button 
            onClick={() => {
              setIsAdminView(false);
              if (typeof window !== 'undefined' && window.location.search.includes('admin=true')) {
                window.history.pushState({}, '', window.location.pathname);
              }
            }} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded transition"
          >
            Exit Admin Panel ✕
          </button>
        </div>
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
        ) : activeTab === 'About Us' ? (
          /* About Us Page Layout */
          <div className="max-w-[1000px] mx-auto px-4 py-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
              <h1 className="text-2xl font-black text-gray-900 border-b pb-3">About DailyShopBD</h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                Welcome to <strong>DailyShopBD</strong> — your one-stop destination for quality lifestyle products, electronics, gadgets, and trendy apparel in Bangladesh.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <h3 className="font-bold text-gray-800 text-sm mb-1">🚀 Fast Delivery</h3>
                  <p className="text-xs text-gray-500">Quick order processing and reliable delivery across Bangladesh.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <h3 className="font-bold text-gray-800 text-sm mb-1">💯 Quality Assurance</h3>
                  <p className="text-xs text-gray-500">We carefully curate and inspect every item before shipping.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <h3 className="font-bold text-gray-800 text-sm mb-1">📞 24/7 Support</h3>
                  <p className="text-xs text-gray-500">Dedicated support via WhatsApp and hotline for all queries.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Other Tabs (Privacy Policy / Contact Us) */
          <div className="max-w-[1000px] mx-auto px-4 py-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 min-h-[300px]">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeTab}</h2>
              <p className="text-gray-600 text-sm">Welcome to the {activeTab} page of DailyShopBD.</p>
            </div>
          </div>
        )}
      </main>

      {/* Admin Quick Switch Button at bottom right */}
      <div className="fixed bottom-3 right-3 z-50">
        <button 
          onClick={() => setIsAdminView(true)}
          className="bg-gray-900/90 hover:bg-black text-gray-300 hover:text-white text-[11px] font-semibold px-3 py-1.5 rounded-full border border-gray-700 shadow-lg transition"
        >
          ⚙️ Admin Panel
        </button>
      </div>

      <ProductDetailModal />
      <Footer />
    </div>
  );
}
