import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState('');

  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-80 object-cover rounded-md border" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.title}</h2>
              <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded font-semibold">
                {selectedProduct.category}
              </span>
              <p className="text-3xl font-bold text-blue-600 my-4">৳ {selectedProduct.price}</p>
              <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

              {/* Size Selection */}
              {selectedProduct.sizes && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Select Size:</h4>
                  <div className="flex gap-3">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded font-medium ${
                          selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  addToCart(selectedProduct, selectedSize);
                  alert('Added to cart!');
                }}
                className="flex-1 bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => alert(`Buying ${selectedProduct.title} (${selectedSize})`)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
