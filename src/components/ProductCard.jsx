import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct, startCheckout } = useContext(StoreContext);

  if (!product) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-[0_6px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_6px_16px_rgba(0,0,0,0.3)] hover:border-[#f57224] dark:hover:border-[#f57224] hover:shadow-[0_10px_24px_rgba(245,114,36,0.15)] transition-all duration-300 flex flex-col justify-between group">
      <div className="cursor-pointer relative overflow-hidden" onClick={() => setSelectedProduct && setSelectedProduct(product)}>
        <div className="relative w-full h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
          />
        </div>
        
        {/* Sub-Category Badge */}
        {product.subCategory && (
          <span className="absolute top-2.5 left-2.5 bg-black/80 text-white text-[9px] px-2.5 py-1 rounded-full font-bold backdrop-blur-md border border-white/10 shadow-sm">
            {product.subCategory}
          </span>
        )}

        <div className="p-3">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block mb-0.5">
            {product.category}
          </span>
          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-[#f57224] transition">
            {product.title}
          </h3>
          <p className="text-sm font-black text-[#f57224] mt-1">৳{product.price}</p>
        </div>
      </div>

      <div className="p-3 pt-0 grid grid-cols-2 gap-2">
        <button 
          onClick={() => addToCart && addToCart(product)}
          className="bg-orange-50 dark:bg-gray-800 border-2 border-orange-200 dark:border-gray-700 text-[#f57224] text-[11px] font-bold py-2 rounded-xl hover:bg-[#f57224] hover:text-white dark:hover:bg-[#f57224] dark:hover:text-white dark:hover:border-[#f57224] transition shadow-sm active:translate-y-[1px]"
        >
          Add to Cart
        </button>
        <button 
          onClick={() => startCheckout && startCheckout([product])}
          className="bg-[#f57224] text-white text-[11px] font-bold py-2 rounded-xl border-2 border-orange-600 hover:bg-orange-600 transition shadow-[0_3px_10px_rgba(245,114,36,0.3)] active:translate-y-[1px]"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
