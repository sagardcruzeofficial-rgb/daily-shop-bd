import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { setSelectedProduct } = useContext(StoreContext);

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="bg-white rounded-lg shadow border p-4 cursor-pointer hover:shadow-lg transition flex flex-col justify-between"
    >
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-md mb-3" />
      <div>
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <p className="text-xl font-bold text-blue-600">৳ {product.price}</p>
      </div>
      <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">
        View & Buy
      </button>
    </div>
  );
}
