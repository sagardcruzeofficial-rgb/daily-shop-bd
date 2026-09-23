import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct } = useContext(StoreContext);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-orange-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
      
      {/* 3D Glow / Lighting effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-orange-400/10 via-transparent to-orange-500/10 pointer-events-none" />

      <div onClick={() => setSelectedProduct(product)} className="cursor-pointer p-3">
        {/* Product Image */}
        <div className="w-full h-44 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden mb-3">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-h-full object-contain group-hover:scale-105 transition duration-300" 
          />
        </div>

        {/* Category Badge */}
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-gray-800 text-xs mt-1.5 mb-1 line-clamp-2 group-hover:text-[#f57224] leading-relaxed">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-400 text-[10px] mb-2">
          ★★★★☆ <span className="text-gray-400 text-[10px]">(98)</span>
        </div>

        {/* Price Tag */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-[#f57224]">৳{product.price}</span>
          <span className="text-xs text-gray-400 line-through">৳{product.price + 300}</span>
        </div>
      </div>

      {/* Direct Add to Cart Button */}
      <div className="p-3 pt-0 z-10">
        <button 
          onClick={() => addToCart(product)}
          className="w-full bg-[#f57224] hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg transition shadow-md flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>🛒</span> Add to Cart
        </button>
      </div>
    </div>
  );
}
