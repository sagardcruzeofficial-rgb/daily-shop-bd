import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct } = useContext(StoreContext);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-[#f57224] hover:shadow-lg transition duration-200 flex flex-col justify-between overflow-hidden group">
      <div onClick={() => setSelectedProduct(product)} className="cursor-pointer p-3">
        {/* Image */}
        <div className="w-full h-48 flex items-center justify-center bg-gray-50 mb-3 rounded overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-h-full object-contain group-hover:scale-105 transition duration-300" 
          />
        </div>

        {/* Title */}
        <h3 className="font-medium text-gray-800 text-xs mb-1 line-clamp-2 group-hover:text-[#f57224] leading-relaxed">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-400 text-[10px] mb-2">
          ★★★★☆ <span className="text-gray-400 ml-1">(45)</span>
        </div>

        {/* Price Tag */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#f57224]">৳{product.price}</span>
          <span className="text-xs text-gray-400 line-through">৳{product.price + 200}</span>
        </div>
      </div>

      {/* Direct Add To Cart Button */}
      <div className="p-3 pt-0">
        <button 
          onClick={() => addToCart(product)}
          className="w-full bg-[#f57224] hover:bg-[#d95f19] text-white text-xs font-bold py-2 rounded transition flex items-center justify-center gap-1 shadow-sm"
        >
          <span>🛒</span> Add to Cart
        </button>
      </div>
    </div>
  );
}
