import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct, startCheckout } = useContext(StoreContext);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
        <img src={product.image} alt={product.title} className="w-full h-44 object-cover" />
        <div className="p-3">
          <h3 className="text-xs font-bold text-gray-800 line-clamp-1">{product.title}</h3>
          <p className="text-sm font-black text-[#f57224] mt-1">৳{product.price}</p>
        </div>
      </div>

      <div className="p-3 pt-0 grid grid-cols-2 gap-2">
        <button 
          onClick={() => addToCart(product)}
          className="bg-orange-50 border border-orange-200 text-[#f57224] text-[11px] font-bold py-2 rounded-lg hover:bg-orange-100"
        >
          Add to Cart
        </button>
        <button 
          onClick={() => startCheckout([product])}
          className="bg-[#f57224] text-white text-[11px] font-bold py-2 rounded-lg hover:bg-orange-600 shadow-sm"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
