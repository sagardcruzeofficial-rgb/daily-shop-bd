import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function CategorySidebar() {
  const { categories, selectedCategory, setSelectedCategory } = useContext(StoreContext);

  const subCategories = {
    'Fashion': ['Men Clothing', 'Women Fashion', 'Shoes', 'Watches'],
    'Electronics': ['Headphones', 'Mobiles', 'Accessories', 'Audio'],
    'Gadgets': ['Smart Watches', 'Power Banks', 'Gaming Accessories'],
    'Home & Living': ['Kitchen Items', 'Decor', 'Lighting']
  };

  return (
    <div className="w-full lg:w-64 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-fit">
      <div className="bg-[#f57224] text-white px-4 py-3 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
        <span>☰</span> Categories
      </div>

      <ul className="divide-y divide-gray-100 text-sm">
        <li 
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-3 cursor-pointer transition font-medium flex justify-between items-center ${
            selectedCategory === 'All' ? 'bg-orange-100 text-[#f57224] font-bold border-l-4 border-[#f57224]' : 'hover:bg-orange-50 text-gray-700'
          }`}
        >
          <span>All Categories</span>
          <span>›</span>
        </li>

        {categories.map((cat, idx) => (
          <li key={idx} className="group relative">
            <div 
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-3 cursor-pointer transition font-medium flex justify-between items-center ${
                selectedCategory === cat ? 'bg-orange-100 text-[#f57224] font-bold border-l-4 border-[#f57224]' : 'hover:bg-orange-50 text-gray-700'
              }`}
            >
              <span>{cat}</span>
              <span className="text-gray-400 group-hover:text-[#f57224]">›</span>
            </div>

            {/* Hover Sub-Menu */}
            {subCategories[cat] && (
              <div className="hidden group-hover:block absolute top-0 left-full w-56 bg-white shadow-2xl border border-gray-200 z-50 rounded-r-lg p-2">
                <div className="text-xs font-bold text-[#f57224] px-3 py-1 uppercase">{cat} Sub-Categories</div>
                {subCategories[cat].map((sub, i) => (
                  <div key={i} className="px-3 py-2 text-xs text-gray-600 hover:bg-orange-50 hover:text-[#f57224] rounded cursor-pointer font-medium">
                    {sub}
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
