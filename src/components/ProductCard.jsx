import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { setSelectedProduct } = useContext(StoreContext);

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="bg-white rounded border border-gray-200 p-4 hover:shadow-xl transition duration-300 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Image Container */}
        <div className="w-full h-56 flex items-center justify-center overflow-hidden bg-gray-50 mb-3 rounded">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-h-full object-contain group-hover:scale-105 transition duration-300" 
          />
        </div>

        {/* Category Badge */}
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-[#c45500] leading-snug">
          {product.title}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1 text-yellow-500 text-xs mb-2">
          ★★★★☆ <span className="text-gray-500 text-xs ml-1">(128)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xs text-gray-600">BDT</span>
          <span className="text-2xl font-bold text-gray-900">৳{product.price}</span>
          <span className="text-xs text-gray-400 line-through">৳{product.price + 250}</span>
        </div>
      </div>

      <button className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-gray-900 text-xs font-bold py-2 rounded-full border border-[#fcd200] transition shadow-sm">
        See Options & Buy
      </button>
    </div>
  );
}
