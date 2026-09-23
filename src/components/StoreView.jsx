import React from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';

export default function StoreView() {
  const { products } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Banner / Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-amber-900 text-white rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-4xl font-extrabold text-amber-400 mb-2">
            Welcome to Daily Shop BD
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Get best deals on premium products with fast home delivery across Bangladesh.
          </p>
        </div>
        <div className="bg-amber-500 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm uppercase tracking-wide shadow">
          Special Offers
        </div>
      </div>

      {/* Product Grid */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        Featured Products
      </h2>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium">
          No products found. Please add products from the Admin Panel.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
