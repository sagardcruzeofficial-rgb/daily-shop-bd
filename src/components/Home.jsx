import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import ProductCard from './ProductCard';

export default function Home() {
  // ১. কনটেক্সট থেকে সব পসিবল ভ্যারিয়েবল ব্যাকআপসহ নেওয়া
  const context = useContext(StoreContext) || {};
  
  const categoryData = context.categoryData || [];
  const selectedCategory = context.selectedCategory || 'All';
  const setSelectedCategory = context.setSelectedCategory || (() => {});
  const selectedSubCategory = context.selectedSubCategory || 'All';
  const setSelectedSubCategory = context.setSelectedSubCategory || (() => {});
  const setSelectedProduct = context.setSelectedProduct || (() => {});

  // প্রোডাক্ট লিস্ট ফালব্যাক লজিক
  const filteredProducts = context.filteredProducts || context.products || context.allProducts || [];
  const allProductsList = context.products || context.filteredProducts || context.allProducts || [];

  // অটো স্লাইডারের জন্য ৫টি প্রোডাক্ট
  const recentProducts = [...allProductsList].reverse().slice(0, 5);
  const [currentSlide, setCurrentSlide] = useState(0);

  // কারেন্ট সাব-ক্যাটাগরি
  const currentCatObj = categoryData.find((c) => c.name === selectedCategory);
  const currentSubCategories = currentCatObj ? currentCatObj.subCategories || [] : [];

  // স্লাইডার টাইমার
  useEffect(() => {
    if (recentProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recentProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [recentProducts.length]);

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '16px' }} className="font-sans">
      
      {/* মেইন লেআউট Container (Standard CSS + Tailwind Mix) */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'flex-start' }} className="flex-col md:flex-row">
        
        {/* ==================== ১. বাম পাশের ক্যাটাগরি সাইডবার ==================== */}
        <div style={{ width: '250px', flexShrink: 0 }} className="w-full md:w-64">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Categories
            </h2>

            <div className="flex flex-col gap-1">
              {/* All Categories */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSubCategory('All');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                  selectedCategory === 'All'
                    ? 'bg-[#f57224] text-white'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-[#f57224]'
                }`}
              >
                <span>All Categories</span>
                <span>›</span>
              </button>

              {/* Dynamic Categories */}
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSelectedSubCategory('All');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                      selectedCategory === cat.name
                        ? 'bg-[#f57224] text-white'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-[#f57224]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span>›</span>
                  </button>

                  {/* Subcategories */}
                  {selectedCategory === cat.name && currentSubCategories.length > 0 && (
                    <div className="ml-3 my-1 pl-2 border-l-2 border-orange-300 flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedSubCategory('All')}
                        className={`text-left text-[11px] font-semibold py-1 px-2 rounded ${
                          selectedSubCategory === 'All'
                            ? 'text-[#f57224] font-bold'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        • All {cat.name}
                      </button>
                      {currentSubCategories.map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setSelectedSubCategory(sub)}
                          className={`text-left text-[11px] font-semibold py-1 px-2 rounded ${
                            selectedSubCategory === sub
                              ? 'text-[#f57224] font-bold'
                              : 'text-gray-500 hover:text-gray-800'
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
        </div>

        {/* ==================== ২. ডান পাশের ব্যানার ও প্রোডাক্ট গ্রিড ==================== */}
        <div style={{ flex: 1, width: '100%' }} className="space-y-6">
          
          {/* ব্যানার ও স্লাইডার ফ্রেম */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* মেইন সুপারশপ ব্যানার */}
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-52 bg-gray-900 group">
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

            {/* ডান পাশের ছোট স্লাইডার ও প্রোমো */}
            <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-3">
              
              {/* স্লাইডার ফ্রেম */}
              <div
                onClick={() => setSelectedProduct && recentProducts[currentSlide] && setSelectedProduct(recentProducts[currentSlide])}
                className="relative bg-black rounded-xl overflow-hidden shadow-sm h-24 border border-gray-200 cursor-pointer group"
              >
                {recentProducts.length > 0 ? (
                  <>
                    <img
                      src={recentProducts[currentSlide]?.image || 'https://via.placeholder.com/300'}
                      alt="Recent Product"
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                      🆕 ({currentSlide + 1}/{recentProducts.length})
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-1.5">
                      <p className="text-white text-[10px] font-bold truncate">{recentProducts[currentSlide]?.title}</p>
                      <p className="text-[#f57224] text-[10px] font-black">৳{recentProducts[currentSlide]?.price}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">
                    No Products
                  </div>
                )}
              </div>

              {/* প্রোমো ব্যানার */}
              <div className="relative rounded-xl overflow-hidden shadow-sm h-24 border border-gray-200 group bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80"
                  alt="Promo Banner"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-2 text-white">
                  <p className="text-[10px] font-bold">Gadget Zone</p>
                  <p className="text-[8px] text-gray-200">Exclusive Collection</p>
                </div>
              </div>

            </div>

          </div>

          {/* প্রোডাক্ট গ্রিড */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                {selectedCategory} {selectedSubCategory !== 'All' ? ` › ${selectedSubCategory}` : ''}
              </h3>
              <span className="text-xs text-gray-400 font-semibold">{filteredProducts.length} Items</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <span className="text-4xl">🛍️</span>
                <h4 className="text-base font-bold text-gray-700 mt-2">No Products Found!</h4>
                <p className="text-xs text-gray-400 mt-1">Try selecting a different category from the left menu.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredProducts.map((prod, idx) => (
                  <ProductCard key={prod.id || prod._id || idx} product={prod} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
