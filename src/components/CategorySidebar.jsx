import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function CategorySidebar() {
  const { 
    categories = [], 
    categoryData = [], 
    selectedCategory, 
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory 
  } = useContext(StoreContext);

  const handleSubCategoryClick = (cat, sub, e) => {
    e.stopPropagation(); // Parent category click stop করার জন্য
    if (setSelectedCategory) setSelectedCategory(cat);
    if (setSelectedSubCategory) setSelectedSubCategory(sub);
  };

  return (
    <div className="w-full lg:w-64 bg-white rounded-xl shadow-md border border-gray-200 overflow-visible h-fit">
      <div className="bg-[#f57224] text-white px-4 py-3 font-bold text-sm uppercase tracking-wider flex items-center gap-2 rounded-t-xl">
        <span>☰</span> Categories
      </div>

      <ul className="divide-y divide-gray-100 text-sm relative">
        <li 
          onClick={() => {
            if (setSelectedCategory) setSelectedCategory('All');
            if (setSelectedSubCategory) setSelectedSubCategory('All');
          }}
          className={`px-4 py-3 cursor-pointer transition font-medium flex justify-between items-center ${
            selectedCategory === 'All' ? 'bg-orange-100 text-[#f57224] font-bold border-l-4 border-[#f57224]' : 'hover:bg-orange-50 text-gray-700'
          }`}
        >
          <span>All Categories</span>
          <span>›</span>
        </li>

        {categories.map((cat, idx) => {
          // Find matching category object from categoryData to get sub-categories dynamically
          const catObj = categoryData ? categoryData.find(c => c.name === cat) : null;
          const subs = catObj && catObj.subCategories ? catObj.subCategories : [];

          return (
            <li key={idx} className="group relative">
              <div 
                onClick={() => {
                  if (setSelectedCategory) setSelectedCategory(cat);
                  if (setSelectedSubCategory) setSelectedSubCategory('All');
                }}
                className={`px-4 py-3 cursor-pointer transition font-medium flex justify-between items-center ${
                  selectedCategory === cat ? 'bg-orange-100 text-[#f57224] font-bold border-l-4 border-[#f57224]' : 'hover:bg-orange-50 text-gray-700'
                }`}
              >
                <span>{cat}</span>
                <span className="text-gray-400 group-hover:text-[#f57224]">›</span>
              </div>

              {/* Hover Sub-Menu (Dynamically rendered from Context) */}
              {subs.length > 0 && (
                <div className="hidden group-hover:block absolute top-0 left-full w-56 bg-white shadow-2xl border border-gray-200 z-50 rounded-r-lg p-2">
                  <div className="text-xs font-bold text-[#f57224] px-3 py-1 uppercase border-b border-gray-100 mb-1">
                    {cat} Sub-Categories
                  </div>
                  <div 
                    onClick={(e) => handleSubCategoryClick(cat, 'All', e)}
                    className={`px-3 py-1.5 text-xs rounded cursor-pointer font-medium transition ${
                      selectedCategory === cat && selectedSubCategory === 'All'
                        ? 'bg-orange-100 text-[#f57224] font-bold'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-[#f57224]'
                    }`}
                  >
                    All {cat}
                  </div>
                  {subs.map((sub, i) => (
                    <div 
                      key={i} 
                      onClick={(e) => handleSubCategoryClick(cat, sub, e)}
                      className={`px-3 py-1.5 text-xs rounded cursor-pointer font-medium transition ${
                        selectedCategory === cat && selectedSubCategory === sub
                          ? 'bg-orange-500 text-white font-bold'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-[#f57224]'
                      }`}
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
