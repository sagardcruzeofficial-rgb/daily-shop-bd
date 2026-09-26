import React, { useContext, useState } from 'react';
import Navbar from './components/Navbar';
import CategorySidebar from './components/CategorySidebar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import AdminView from './components/AdminView';
import CheckoutPage from './components/CheckoutPage';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import { StoreContext } from './context/StoreContext';

// Admin Username & Password Protected Wrapper Component with Logout
const AdminAuthWrapper = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    sessionStorage.getItem('adminAuth') === 'true'
  );
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  // আপনার পছন্দমতো ইউজারনেম এবং পাসওয়ার্ড এখানে সেট করতে পারেন
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "DailyShopBDAdmin123";

  const handleLogin = (e) => {
    e.preventDefault();
    if (usernameInput === ADMIN_USER && passwordInput === ADMIN_PASS) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setError(false);
    } else {
      setError(true);
      setPasswordInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAdminAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
        <div className="p-8 bg-white rounded-2xl shadow-md w-96 border border-gray-200">
          <h2 className="mb-6 text-xl font-black text-center text-gray-800 border-b pb-3">Admin Panel Security</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">Admin Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Username..."
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224] text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">Admin Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password..."
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224] text-sm"
                required
              />
            </div>
            {error && <p className="mb-4 text-xs font-bold text-red-500">ভুল ইউজারনেম অথবা পাসওয়ার্ড!</p>}
            <button
              type="submit"
              className="w-full py-2.5 font-bold text-white bg-[#f57224] rounded-xl hover:bg-orange-600 transition duration-200 text-sm shadow-sm"
            >
              Login to Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  // পাসওয়ার্ড সঠিক হলে অ্যাডমিন প্যানেল দেখাবে এবং উপরে একটি সিকিউর লগআউট বাটন থাকবে
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Admin Top Secure Bar with Logout Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-black text-gray-800 uppercase tracking-wider">Admin Panel Connected</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>🚪</span> Logout Admin
        </button>
      </div>

      {/* Main Admin View Content */}
      {children}
    </div>
  );
};

export default function App() {
  const store = useContext(StoreContext);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <p className="text-gray-600 font-bold">Loading DailyShopBD Store...</p>
      </div>
    );
  }

  const { 
    products = [], 
    filteredProducts = [], 
    categories = [], 
    categoryData = [], 
    selectedCategory = 'All', 
    setSelectedCategory, 
    selectedSubCategory = 'All', 
    setSelectedSubCategory, 
    activeTab = 'Home' 
  } = store;

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const isAdminDomain = currentHost.includes('admin') || urlParams.get('admin') === 'true';

  if (isAdminDomain) {
    return (
      <AdminAuthWrapper>
        <div className="bg-[#f8fafc] min-h-screen">
          <AdminView />
        </div>
      </AdminAuthWrapper>
    );
  }

  // Active Category details for Sub-Category filter
  const currentCatObj = categoryData ? categoryData.find(c => c.name === selectedCategory) : null;
  const currentSubCategories = currentCatObj ? currentCatObj.subCategories || [] : [];

  // Determine list of products to display
  const displayProducts = (filteredProducts && filteredProducts.length > 0) ? filteredProducts : products;

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'Checkout' ? (
          <CheckoutPage />
        ) : activeTab === 'Login' ? (
          <div className="py-10"><Login /></div>
        ) : activeTab === 'Register' ? (
          <div className="py-10"><Register /></div>
        ) : activeTab === 'Home' ? (
          <div className="max-w-[1300px] mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Category Sidebar */}
              <CategorySidebar />

              {/* Main Content Area */}
              <div className="flex-1 space-y-6">
                
                {/* Sub-Category Filter Buttons (When a Category is Selected) */}
                {selectedCategory && selectedCategory !== 'All' && currentSubCategories.length > 0 && (
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 mr-2">Sub-categories:</span>
                    <button
                      onClick={() => setSelectedSubCategory && setSelectedSubCategory('All')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        selectedSubCategory === 'All'
                          ? 'bg-[#f57224] text-white shadow-sm'
                          : 'bg-orange-50 text-[#f57224] hover:bg-orange-100'
                      }`}
                    >
                      All
                    </button>
                    {currentSubCategories.map((subCat) => (
                      <button
                        key={subCat}
                        onClick={() => setSelectedSubCategory && setSelectedSubCategory(subCat)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          selectedSubCategory === subCat
                            ? 'bg-[#f57224] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {subCat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Filtered Search / Category View */}
                {selectedCategory !== 'All' || selectedSubCategory !== 'All' ? (
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                      <h2 className="text-lg font-black text-gray-900 border-l-4 border-[#f57224] pl-3">
                        {selectedCategory} {selectedSubCategory !== 'All' ? `> ${selectedSubCategory}` : ''}
                      </h2>
                      <span className="text-xs text-orange-600 font-bold">
                        {displayProducts.length} Items Found
                      </span>
                    </div>

                    {displayProducts.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 text-sm font-medium">
                        No products available in this selection.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayProducts.map((prod) => (
                          <ProductCard key={prod.id} product={prod} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Section-wise Category View (Default View) */
                  categories.map((cat) => {
                    const categoryProducts = displayProducts.filter(p => p.category === cat);
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
                  })
                )}

              </div>
            </div>
          </div>
        ) : activeTab === 'About Us' ? (
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
          <div className="max-w-[1000px] mx-auto px-4 py-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 min-h-[300px]">
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
