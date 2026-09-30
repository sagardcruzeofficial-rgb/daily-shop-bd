import React, { useContext, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CategorySidebar from './components/CategorySidebar';
import HeroSlider from './components/HeroSlider';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import AdminView from './components/AdminView';
import CheckoutPage from './components/CheckoutPage';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import { StoreContext } from './context/StoreContext';
import { createProductSlug } from './utils/slugify';

const AdminAuthWrapper = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    sessionStorage.getItem('adminAuth') === 'true'
  );
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  const ADMIN_USER = "Sagar Dcruze";
  const ADMIN_PASS = "sAgar2002@#";

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 font-sans transition-colors">
        <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-96 border-2 border-gray-200 dark:border-gray-800">
          <h2 className="mb-6 text-xl font-black text-center text-gray-800 dark:text-gray-100 border-b-2 border-gray-100 dark:border-gray-800 pb-3">Admin Panel Security</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-2 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Admin Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Username..."
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#f57224] text-sm text-gray-800 dark:text-gray-100 font-medium transition"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Admin Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password..."
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#f57224] text-sm text-gray-800 dark:text-gray-100 font-medium transition"
                required
              />
            </div>
            {error && <p className="mb-4 text-xs font-bold text-red-500">ভুল ইউজারনেম অথবা পাসওয়ার্ড! আবার চেষ্টা করুন।</p>}
            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-[#f57224] rounded-xl border-2 border-orange-600 hover:bg-orange-600 transition duration-200 text-sm shadow-[0_4px_12px_rgba(245,114,36,0.3)] active:translate-y-[1px]"
            >
              Login to Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800 px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider">Admin Panel Connected (Secure)</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl border-2 border-red-600 transition shadow-sm flex items-center gap-1.5 cursor-pointer active:translate-y-[1px]"
        >
          <span>🚪</span> Logout Admin
        </button>
      </div>

      {children}
    </div>
  );
};

export default function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://pl31521197.profitableratecpmnetwork.com/bf/7f/c0/bf7fc0f2e24c8a78a159f536cd65c863.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const store = useContext(StoreContext);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 font-sans">
        <p className="text-gray-600 dark:text-gray-400 font-bold">Loading DailyShopBD Store...</p>
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
    activeTab = 'Home',
    setSelectedProduct
  } = store;

  // Handle URL Slug Routing for Direct Links & Facebook Share matching /product/{slug}-{firestoreId}
  const [currentSlugProduct, setCurrentSlugProduct] = useState(null);

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      
      if (path && path.startsWith('/product/') && products.length > 0) {
        const slugParam = path.replace('/product/', '');
        let matchedProd = null;

        // 1. Try matching by final Firestore ID (the part after the last hyphen)
        const lastHyphenIndex = slugParam.lastIndexOf('-');
        if (lastHyphenIndex !== -1) {
          const firestoreId = slugParam.substring(lastHyphenIndex + 1);
          matchedProd = products.find(p => p.id === firestoreId);
        }

        // 2. Fallback: match by full generated slug
        if (!matchedProd) {
          matchedProd = products.find(p => createProductSlug(p.name || p.title, p.id) === slugParam);
        }

        if (matchedProd) {
          setCurrentSlugProduct(matchedProd);
          
          // Update OpenGraph tags dynamically
          document.title = `${matchedProd.name || matchedProd.title} | DailyShopBD`;
          
          let metaOgTitle = document.querySelector("meta[property='og:title']");
          if (metaOgTitle) metaOgTitle.setAttribute("content", matchedProd.name || matchedProd.title);

          let metaOgDesc = document.querySelector("meta[property='og:description']");
          if (metaOgDesc) metaOgDesc.setAttribute("content", matchedProd.description || "Best price in Bangladesh at DailyShopBD.");

          let metaOgImage = document.querySelector("meta[property='og:image']");
          if (metaOgImage && matchedProd.image) metaOgImage.setAttribute("content", matchedProd.image);
        } else {
          setCurrentSlugProduct(null);
        }
      } else {
        setCurrentSlugProduct(null);
      }
    };

    handleUrlChange();

    // Listen to browser back/forward and custom pushState events
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [products]);

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const isAdminDomain = currentHost.includes('admin') || urlParams.get('admin') === 'true';

  if (isAdminDomain) {
    return (
      <AdminAuthWrapper>
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
          <AdminView />
        </div>
      </AdminAuthWrapper>
    );
  }

  const currentCatObj = categoryData ? categoryData.find(c => c.name === selectedCategory) : null;
  const currentSubCategories = currentCatObj ? currentCatObj.subCategories || [] : [];
  const displayProducts = (filteredProducts && filteredProducts.length > 0) ? filteredProducts : products;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col justify-between font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {currentSlugProduct ? (
          <div className="max-w-[1300px] mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-xl flex flex-col md:flex-row gap-6 items-center">
              <img src={currentSlugProduct.image} alt={currentSlugProduct.name || currentSlugProduct.title} className="max-h-80 object-contain rounded-xl" />
              <div className="space-y-4">
                <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100">{currentSlugProduct.name || currentSlugProduct.title}</h1>
                <p className="text-xl font-bold text-[#f57224]">৳{currentSlugProduct.price}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{currentSlugProduct.description}</p>
                <button 
                  onClick={() => setSelectedProduct(currentSlugProduct)}
                  className="bg-[#f57224] hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-xs transition shadow-lg cursor-pointer"
                >
                  Buy Now / Order
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'Checkout' ? (
          <CheckoutPage />
        ) : activeTab === 'Login' ? (
          <div className="py-10"><Login /></div>
        ) : activeTab === 'Register' ? (
          <div className="py-10"><Register /></div>
        ) : activeTab === 'Home' ? (
          <div className="max-w-[1300px] mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              
              <CategorySidebar />

              <div className="flex-1 space-y-6">
                
                {/* Hero Banner & Quick Categories Slider */}
                <HeroSlider setSelectedCategory={setSelectedCategory} />

                {selectedCategory && selectedCategory !== 'All' && currentSubCategories.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-2">Sub-categories:</span>
                    <button
                      onClick={() => setSelectedSubCategory && setSelectedSubCategory('All')}
                      className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition shadow-sm active:translate-y-[1px] ${
                        selectedSubCategory === 'All'
                          ? 'bg-[#f57224] border-orange-600 text-white shadow-[0_3px_10px_rgba(245,114,36,0.3)]'
                          : 'bg-orange-50 dark:bg-gray-800 border-orange-200 dark:border-gray-700 text-[#f57224] hover:bg-orange-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      All
                    </button>
                    {currentSubCategories.map((subCat) => (
                      <button
                        key={subCat}
                        onClick={() => setSelectedSubCategory && setSelectedSubCategory(subCat)}
                        className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition shadow-sm active:translate-y-[1px] ${
                          selectedSubCategory === subCat
                            ? 'bg-[#f57224] border-orange-600 text-white shadow-[0_3px_10px_rgba(245,114,36,0.3)]'
                            : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {subCat}
                      </button>
                    ))}
                  </div>
                )}

                {selectedCategory !== 'All' || selectedSubCategory !== 'All' ? (
                  <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-4 border-b-2 border-gray-100 dark:border-gray-800 pb-3">
                      <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 border-l-4 border-[#f57224] pl-3">
                        {selectedCategory} {selectedSubCategory !== 'All' ? `> ${selectedSubCategory}` : ''}
                      </h2>
                      <span className="text-xs text-orange-600 dark:text-orange-400 font-bold">
                        {displayProducts.length} Items Found
                      </span>
                    </div>

                    {displayProducts.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm font-medium">
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
                  categories.map((cat) => {
                    const categoryProducts = displayProducts.filter(p => p.category === cat);
                    if (categoryProducts.length === 0) return null;

                    return (
                      <div key={cat} className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-4 border-b-2 border-gray-100 dark:border-gray-800 pb-3">
                          <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 border-l-4 border-[#f57224] pl-3">
                            {cat} Section
                          </h2>
                          <span className="text-xs text-orange-600 dark:text-orange-400 font-bold">Featured Items</span>
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
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-800 space-y-6">
              <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 border-b-2 border-gray-100 dark:border-gray-800 pb-3">About DailyShopBD</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Welcome to <strong>DailyShopBD</strong> — your one-stop destination for quality lifestyle products, electronics, gadgets, and trendy apparel in Bangladesh.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-orange-50 dark:bg-gray-800/80 p-4 rounded-xl border-2 border-orange-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">🚀 Fast Delivery</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Quick order processing and reliable delivery across Bangladesh.</p>
                </div>
                <div className="bg-orange-50 dark:bg-gray-800/80 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">💯 Quality Assurance</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">We carefully curate and inspect every item before shipping.</p>
                </div>
                <div className="bg-orange-50 dark:bg-gray-800/80 p-4 rounded-xl border-2 border-orange-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">📞 24/7 Support</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dedicated support via WhatsApp and hotline for all queries.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[1000px] mx-auto px-4 py-10">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.3)] border-2 border-gray-200 dark:border-gray-800 min-h-[300px]">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{activeTab}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Welcome to the {activeTab} page of DailyShopBD.</p>
            </div>
          </div>
        )}
      </main>

      <ProductDetailModal />
      <Footer />
    </div>
  );
}
