import React from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, cart } = useStore();
  const isInCart = cart.some((item) => item.id === product.id);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
          <span className="absolute top-2 left-2 bg-amber-500 text-gray-900 text-xs font-bold px-2 py-0.5 rounded">
            {product.category}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 text-base line-clamp-2 mb-1">
            {product.title}
          </h3>
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="text-lg font-bold text-gray-900">
            ৳ {product.price}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={() => addToCart(product)}
          className={`w-full py-2 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 transition ${
            isInCart
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-amber-400 hover:bg-amber-500 text-gray-900'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
