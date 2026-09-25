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

  // অটো-স্ক্রলিং ৩ সেকেন্ড পর পর
  useEffect(() => {
    if (recentProducts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recentProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [recentProducts.length]);

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-6 font-sans">
      
      {/* 2-Column Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ==================== LEFT SIDE (Categories & Product Grid) ==================== */}
        <div className="lg:col-span-8">
          
          {/* Main Category Tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedSubCategory('All'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                selectedCategory === 'All' ? 'bg-[#f57224] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Products
            </button>
            {categoryData.map((cat) => (
              <button
                key={cat.name}
                onClick={() => { setSelectedCategory(cat.name); setSelectedSubCategory('All'); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat.name ? 'bg-[#f57224] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sub Category Pills */}
          {selectedCategory !== 'All' && currentSubCategories.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 bg-orange-50 p-3 rounded-xl border border-orange-100">
              <button
                onClick={() => setSelectedSubCategory('All')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  selectedSubCategory === 'All' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-orange-200'
                }`}
              >
                All {selectedCategory}
              </button>
              {currentSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    selectedSubCategory === sub ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border border-orange-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <span className="text-4xl">🛍️</span>
              <h4 className="text-base font-bold text-gray-700 mt-2">No Products Found!</h4>
              <p className="text-xs text-gray-400 mt-1">Try selecting a different category or sub-category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>

        {/* ==================== RIGHT SIDE (Supershop Banner & Auto-Slider) ==================== */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* ১. উপরে বড় সুপারশপ ব্যানার ইমেজ */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 group h-56 bg-gray-900">
            <img 
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80" 
              alt="Supershop Banner" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="bg-[#f57224] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full w-max mb-1">
                Super Deal
              </span>
              <h3 className="font-extrabold text-base leading-tight">Daily Supershop Offers</h3>
              <p className="text-xs text-gray-200 mt-0.5">Get up to 40% OFF on daily essentials</p>
            </div>
          </div>

          {/* ২. নিচে ২টি ফ্রেমে লাস্ট ৫ আপলোড প্রোডাক্ট স্লাইডার ও অফার ব্যানার */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
            
            {/* ফ্রেম A: লাস্ট ৫টি আপলোড করা ইমেজের অটো-স্ক্রলিং ক্যারোসেল */}
            <div 
              onClick={() => setSelectedProduct && recentProducts[currentSlide] && setSelectedProduct(recentProducts[currentSlide])}
              className="relative bg-black rounded-xl overflow-hidden shadow-sm h-40 border border-gray-200 cursor-pointer group"
            >
              {recentProducts.length > 0 ? (
                <>
                  <img 
                    src={recentProducts[currentSlide]?.image || 'https://via.placeholder.com/300'} 
                    alt="Recent Product" 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-700 ease-in-out"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                    🆕 Just Added ({currentSlide + 1}/5)
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                    <p className="text-white text-[11px] font-bold truncate">{recentProducts[currentSlide]?.title}</p>
                    <p className="text-[#f57224] text-[11px] font-black">৳{recentProducts[currentSlide]?.price}</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-400">
                  No Recent Products
                </div>
              )}
            </div>

            {/* ফ্রেম B: অফার/প্রোমোশনাল ইমেজ */}
            <div className="relative rounded-xl overflow-hidden shadow-sm h-40 border border-gray-200 group bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80" 
                alt="Promo Banner" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-2 text-white">
                <p className="text-xs font-bold">Gadget Zone</p>
                <p className="text-[10px] text-gray-200">Exclusive Collection</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
