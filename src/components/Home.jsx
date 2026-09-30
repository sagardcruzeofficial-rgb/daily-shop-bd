import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import ProductCard from './ProductCard';

export default function Home() {
  // ১. কনটেক্সট থেকে সব পসিবল ভ্যারিয়েবল ব্যাকআপসহ নেওয়া
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

  // পেজিনেশন স্টেট (প্রতি পেজে ২৪টি প্রোডাক্ট)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // ক্যাটাগরি বা সাব-ক্যাটাগরি পরিবর্তন হলে পেজ ১-এ রিইন্ড করার জন্য
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubCategory]);

  // বর্তমান ফিল্টার করা লিস্ট থেকে পেজিনেশনের জন্য প্রোডাক্ট কাটছাঁট করা
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  
  // সেফটি চেক: বর্তমান পেজ মোট পেজের বেশি হয়ে গেলে পেজ ১ এ নিয়ে আসা
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // স্লাইডার টাইমার
  useEffect(() => {
    if (recentProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recentProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [recentProducts.length]);

  // ক্যাটাগরি-ওয়াইজ আলাদা সেকশন বানানোর লজিক (যদি ইউজার আলাদা আলাদা ক্যাটাগরি সেকশন দেখতে চান)
  const categoriesToDisplay = selectedCategory === 'All' 
    ? categoryData 
    : categoryData.filter(cat => cat.name === selectedCategory);

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '16px' }} className="font-sans bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      
      {/* মেইন লেআউট Container */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* ==================== ১. বাম পাশের ক্যাটাগরি সাইডবার ==================== */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] sticky top-4 transition-all duration-300">
            <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 pb-1 border-b border-gray-100 dark:border-gray-800">
              Categories
            </h2>

            <div className="flex flex-col gap-1.5">
              {/* All Categories Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSubCategory('All');
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between border ${
                  selectedCategory === 'All'
                    ? 'bg-[#f57224] text-white border-[#e0621b] shadow-[0_4px_12px_rgba(245,114,36,0.35)] translate-y-[-1px]'
                    : 'bg-gray-50 dark:bg-gray-850 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-750 hover:border-[#f57224] dark:hover:border-[#f57224] hover:bg-orange-50/50 dark:hover:bg-gray-800'
                }`}
              >
                <span>All Categories</span>
                <span className="text-sm font-black">›</span>
              </button>

              {/* Dynamic Categories */}
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setSelectedSubCategory('All');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between border ${
                      selectedCategory === cat.name
                        ? 'bg-[#f57224] text-white border-[#e0621b] shadow-[0_4px_12px_rgba(245,114,36,0.35)] translate-y-[-1px]'
                        : 'bg-gray-50 dark:bg-gray-850 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-750 hover:border-[#f57224] dark:hover:border-[#f57224] hover:bg-orange-50/50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-sm font-black">›</span>
                  </button>

                  {/* Subcategories */}
                  {selectedCategory === cat.name && currentSubCategories.length > 0 && (
                    <div className="ml-3 my-1 pl-2.5 border-l-2 border-[#f57224] bg-gray-50/80 dark:bg-gray-950/50 p-2 rounded-r-xl border-y border-r border-gray-200/60 dark:border-gray-800 flex flex-col gap-1.5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setSelectedSubCategory('All')}
                        className={`text-left text-[11px] font-bold py-1.5 px-2.5 rounded-lg border transition-all ${
                          selectedSubCategory === 'All'
                            ? 'bg-white dark:bg-gray-800 text-[#f57224] border-gray-200 dark:border-gray-700 shadow-sm'
                            : 'bg-transparent text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-900'
                        }`}
                      >
                        • All {cat.name}
                      </button>
                      {currentSubCategories.map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setSelectedSubCategory(sub)}
                          className={`text-left text-[11px] font-bold py-1.5 px-2.5 rounded-lg border transition-all ${
                            selectedSubCategory === sub
                              ? 'bg-white dark:bg-gray-800 text-[#f57224] border-gray-200 dark:border-gray-700 shadow-sm'
                              : 'bg-transparent text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-900'
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

        {/* ==================== ২. ডান পাশের ব্যানার ও আলাদা সেকশন গ্রিড ==================== */}
        <div className="flex-1 w-full space-y-6">
          
          {/* ব্যানার ও স্লাইডার ফ্রেম */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.5)] border-2 border-gray-200 dark:border-gray-800 h-52 bg-gray-900 group">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80"
                alt="Supershop Banner"
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="bg-[#f57224] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md w-max mb-1.5 shadow-md border border-orange-400">
                  Super Deal
                </span>
                <h3 className="font-black text-xl leading-tight drop-shadow-md">Daily Supershop Offers</h3>
                <p className="text-xs text-gray-200 mt-0.5 font-medium">Get up to 40% OFF on daily essentials</p>
              </div>
            </div>

            <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-3">
              <div
                onClick={() => setSelectedProduct && recentProducts[currentSlide] && setSelectedProduct(recentProducts[currentSlide])}
                className="relative bg-black rounded-xl overflow-hidden shadow-[0_6px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_6px_15px_rgba(0,0,0,0.4)] h-24 border-2 border-gray-200 dark:border-gray-800 cursor-pointer group hover:border-[#f57224] transition-all"
              >
                {recentProducts.length > 0 ? (
                  <>
                    <img
                      src={recentProducts[currentSlide]?.image || 'https://via.placeholder.com/300'}
                      alt="Recent Product"
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] font-black px-2 py-0.5 rounded-md backdrop-blur-md border border-gray-700">
                      🆕 ({currentSlide + 1}/{recentProducts.length})
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-2">
                      <p className="text-white text-[10px] font-bold truncate">{recentProducts[currentSlide]?.title}</p>
                      <p className="text-[#f57224] text-[11px] font-black">৳{recentProducts[currentSlide]?.price}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-400">
                    No Products
                  </div>
                )}
              </div>

              <div className="relative rounded-xl overflow-hidden shadow-[0_6px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_6px_15px_rgba(0,0,0,0.4)] h-24 border-2 border-gray-200 dark:border-gray-800 group bg-gray-100 dark:bg-gray-800 hover:border-[#f57224] transition-all">
                <img
                  src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80"
                  alt="Promo Banner"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-2.5 text-white">
                  <p className="text-[11px] font-black drop-shadow">Gadget Zone</p>
                  <p className="text-[9px] text-gray-200 font-medium">Exclusive Collection</p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== ক্যাটাগরি-ওয়াইজ আলাদা সেকশন রেন্ডারিং ==================== */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-800 text-center py-16 shadow-sm">
              <span className="text-4xl">🛍️</span>
              <h4 className="text-base font-bold text-gray-700 dark:text-gray-300 mt-2">No Products Found!</h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try selecting a different category from the left menu.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* যদি আপনি Fashion, Electronics ইত্যাদি আলাদা সেকশন অনুযায়ী দেখাতে চান */}
              {categoriesToDisplay.map((cat) => {
                // ক্যাটাগরির আন্ডারে থাকা প্রোডাক্ট ফিল্টার করা
                const catProducts = currentProducts.filter(
                  (prod) => prod.category === cat.name || prod.categoryName === cat.name
                );

                // যদি নির্দিষ্ট ক্যাটাগরি সিলেক্ট করা থাকে অথবা অল ক্যাটাগরিতে এই ক্যাটাগরির প্রোডাক্ট থাকে
                if (selectedCategory !== 'All' && selectedCategory !== cat.name) return null;
                if (selectedCategory === 'All' && catProducts.length === 0 && categoryData.length > 1) return null;

                // যদি ক্যাটাগরি ফিল্টার করা না থাকে কিন্তু অল প্রোডাক্ট দেখাতে হয়, তবে সরাসরি currentProducts দেখাবে
                const displayList = selectedCategory === 'All' ? currentProducts : catProducts;

                if (displayList.length === 0) return null;

                return (
                  <div key={cat.name} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-[0_8px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-100 dark:border-gray-800">
                      <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f57224]"></span>
                        {cat.name} {selectedSubCategory !== 'All' ? ` › ${selectedSubCategory}` : ''}
                      </h3>
                      <span className="text-xs text-white bg-[#f57224] px-2.5 py-1 rounded-lg font-black shadow-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {displayList.map((prod, idx) => (
                        <ProductCard key={prod.id || prod._id || idx} product={prod} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* পেজিনেশন বাটন (Pagination Controls) */}
              {totalPages > 1 && (
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center gap-2 shadow-sm">
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-850 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    Prev
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => {
                          setCurrentPage(pageNumber);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                          currentPage === pageNumber
                            ? 'bg-[#f57224] text-white shadow-md shadow-orange-500/30'
                            : 'bg-gray-50 dark:bg-gray-850 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-750 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-850 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
