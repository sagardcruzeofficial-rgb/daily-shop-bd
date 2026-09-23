import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { setSelectedProduct } = useContext(StoreContext);

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col justify-between group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-52 object-cover group-hover:scale-105 transition duration-500" 
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-700 px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 text-base mb-1 line-clamp-1 group-hover:text-blue-600 transition">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-black text-blue-600">৳ {product.price}</span>
            <span className="text-xs text-gray-400 line-through">৳ {product.price + 200}</span>
          </div>

          <button className="w-full bg-slate-900 group-hover:bg-blue-600 text-white text-sm py-2.5 rounded-lg font-semibold transition duration-300 shadow-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
