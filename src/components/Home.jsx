import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import ProductCard from './ProductCard';

export default function Home() {
  const { 
    filteredProducts = [], 
    products = [],
    categoryData = [], 
    selectedCategory, 
    setSelectedCategory, 
    selectedSubCategory, 
    setSelectedSubCategory,
    setSelectedProduct
  } = useContext(StoreContext);

  const currentCatObj = categoryData.find(c => c.name === selectedCategory);
  const currentSubCategories = currentCatObj ? currentCatObj.subCategories || [] : [];

  // লাস্ট ৫টি আপলোড করা প্রোডাক্ট
  const recentProducts = [...products].reverse().slice(0, 5);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ৩ সেকেন্ড পর পর অটো-স্লাইডার স্ক্রলিং
  useEffect(() => {
    if (recentProducts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recentProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [recentProducts.length]);

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-6 font-sans">
      
      {/* ২-কলামের মেইন লেআউট */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* ==================== ১. একবারে বাম সাইডবার (CATEGORIES SIDEBAR) ==================== */}
        <div className="md:col-span-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Categories
          </h2>
          
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedSubCategory('All'); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                selectedCategory === 'All' ? 'bg-[#f57224] text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-[#f57224]'
              }`}
            >
              <span>All Categories</span>
              <span>›</span>
            </button>

            {categoryData.map((cat) => (
              <div key={cat.name} className="flex flex-col">
                <button
                  onClick={() => { setSelectedCategory(cat.name); setSelectedSubCategory('All'); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                    selectedCategory === cat.name ? 'bg-[#f57224] text-white' : 'text-gray-700 hover:bg-orange-50 hover:text-[#f57224]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span>›</span>
                </button>

                {/* সাব-ক্যাটাগরি ড্রপডাউন/লিস্ট (সাইডবারের ভেতরেই) */}
                {selectedCategory === cat.name && currentSubCategories.length > 0 && (
                  <div className="ml-3 my-1 pl-2 border-l-2 border-orange-300 flex flex-col gap-1">
                    <button
                      onClick={() => setSelectedSubCategory('All')}
                      className={`text-left text-[11px] font-semibold py-1 px-2 rounded ${
                        selectedSubCategory === 'All' ? 'text-[#f57224] font-bold' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      • All {cat.name}
                    </button>
                    {currentSubCategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubCategory(sub)}
                        className={`text-left text-[11px] font-semibold py-1 px-2 rounded ${
                          selectedSubCategory === sub ? 'text-[#f57224] font-bold' : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        • {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ==================== ২. ডান পাশ (BANNERS & SCROLLING PRODUCTS) ==================== */}
        <div className="md:col-span-9 space-y-6">
          
          {/* ডান পাশের টপ ফ্রেম সেকশন (ব্যানার ও স্লাইডার) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* উপরে বড় সুপারশপ ব্যানার ইমেজ */}
            <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-52 bg-gray-900 group">
              <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80" 
                alt="Supershop Banner" 
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <span className="bg-[#f57224] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full w-max mb-1">
                  Super Deal
                </span>
                <h3 className="font-extrabold text-lg leading-tight">Daily Supershop Offers</h3>
                <p className="text-xs text-gray-200 mt-0.5">Get up to 40% OFF on daily essentials</p>
              </div>
            </div>

            {/* ডান পাশের ছোট ২টি ফ্রেম (লাস্ট ৫টি আপলোড স্ক্রল স্লাইডার + অফার ফ্রেম) */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
              
              {/* ফ্রেম ১: লাস্ট ৫টি আপলোড ইমেজের স্লাইডার */}
              <div 
                onClick={() => setSelectedProduct && recentProducts[currentSlide] && setSelectedProduct(recentProducts[currentSlide])}
                className="relative bg-black rounded-xl overflow-hidden shadow-sm h-24 lg:h-24 border border-gray-200 cursor-pointer group"
              >
                {recentProducts.length > 0 ? (
                  <>
                    <img 
                      src={recentProducts[currentSlide]?.image || 'https://via.placeholder.com/300'} 
                      alt="Recent Product" 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-700 ease-in-out"
                    />
                    <div className="absolute top-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                      🆕 ({currentSlide + 1}/5)
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-1.5">
                      <p className="text-white text-[10px] font-bold truncate">{recentProducts[currentSlide]?.title}</p>
                      <p className="text-[#f57224] text-[10px] font-black">৳{recentProducts[currentSlide]?.price}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-[10px] text-gray-400">
                    No Recent Items
                  </div>
                )}
              </div>

              {/* ফ্রেম ২: প্রমোশনাল ফ্রেম */}
              <div className="relative rounded-xl overflow-hidden shadow-sm h-24 lg:h-24 border border-gray-200 group bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80" 
                  alt="Promo Banner" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-1.5 text-white">
                  <p className="text-[10px] font-bold">Gadget Zone</p>
                  <p className="text-[8px] text-gray-200">Best Price Guaranteed</p>
                </div>
              </div>

            </div>

          </div>

          {/* প্রোডাক্ট লিস্ট / গ্রিড */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                {selectedCategory} {selectedSubCategory !== 'All' ? ` › ${selectedSubCategory}` : ''}
              </h3>
              <span className="text-xs text-gray-400 font-semibold">{filteredProducts.length} Products</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <span className="text-4xl">🛍️</span>
                <h4 className="text-base font-bold text-gray-700 mt-2">No Products Found!</h4>
                <p className="text-xs text-gray-400 mt-1">Try selecting a different category from the left menu.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
