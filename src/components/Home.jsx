import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import ProductCard from './ProductCard';

export default function Home() {
  const { 
    filteredProducts = [], 
    categoryData = [], 
    selectedCategory, 
    setSelectedCategory, 
    selectedSubCategory, 
    setSelectedSubCategory 
  } = useContext(StoreContext);

  const currentCatObj = categoryData.find(c => c.name === selectedCategory);
  const currentSubCategories = currentCatObj ? currentCatObj.subCategories || [] : [];

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-6 font-sans">
      
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
