import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function CategorySidebar() {
  const { categories, selectedCategory, setSelectedCategory } = useContext(StoreContext);

  return (
    <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-3 h-fit">
      <div className="bg-[#f57224] text-white px-3 py-2 rounded-t font-bold text-sm uppercase tracking-wide flex items-center gap-2 mb-2">
        <span>☰</span> Categories
      </div>
      <ul className="divide-y divide-gray-100 text-sm">
        <li 
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-2.5 rounded cursor-pointer transition font-medium flex justify-between items-center ${
            selectedCategory === 'All' ? 'bg-orange-50 text-[#f57224] font-bold' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <span>All Categories</span>
          <span>›</span>
        </li>
        {categories.map((cat, idx) => (
          <li 
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-2.5 rounded cursor-pointer transition font-medium flex justify-between items-center ${
              selectedCategory === cat ? 'bg-orange-50 text-[#f57224] font-bold' : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span>{cat}</span>
            <span className="text-gray-400 text-xs">›</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
