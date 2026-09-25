import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct, startCheckout } = useContext(StoreContext);

  if (!product) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group">
      <div className="cursor-pointer relative" onClick={() => setSelectedProduct && setSelectedProduct(product)}>
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-44 object-cover group-hover:scale-105 transition duration-300" 
        />
        
        {/* Sub-Category Badge */}
        {product.subCategory && (
          <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
            {product.subCategory}
          </span>
        )}

        <div className="p-3">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">
            {product.category}
          </span>
          <h3 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-[#f57224] transition">
            {product.title}
          </h3>
          <p className="text-sm font-black text-[#f57224] mt-1">৳{product.price}</p>
        </div>
      </div>

      <div className="p-3 pt-0 grid grid-cols-2 gap-2">
        <button 
          onClick={() => addToCart && addToCart(product)}
          className="bg-orange-50 border border-orange-200 text-[#f57224] text-[11px] font-bold py-2 rounded-lg hover:bg-orange-100 transition"
        >
          Add to Cart
        </button>
        <button 
          onClick={() => startCheckout && startCheckout([product])}
          className="bg-[#f57224] text-white text-[11px] font-bold py-2 rounded-lg hover:bg-orange-600 shadow-sm transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
