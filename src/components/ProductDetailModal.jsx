import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState('');

  if (!selectedProduct) return null;

  const handleBuyNow = () => {
    const sizeText = selectedSize ? selectedSize : (selectedProduct.sizes?.[0] || 'Standard');
    const message = `Hello DailyShop BD! I want to buy this product:\n\n*Product:* ${selectedProduct.title}\n*Price:* ৳${selectedProduct.price}\n*Size:* ${sizeText}\n\nPlease confirm my order.`;
    const whatsappUrl = `https://wa.me/8801705507447?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 relative shadow-2xl border-2 border-orange-500 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white w-8 h-8 rounded-full font-bold transition flex items-center justify-center"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left Image */}
          <div className="bg-gray-50 p-4 rounded-xl border flex items-center justify-center">
            <img src={selectedProduct.image} alt={selectedProduct.title} className="max-h-72 object-contain rounded-md" />
          </div>

          {/* Right Details */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="bg-orange-100 text-[#f57224] text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                {selectedProduct.category}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2 mb-2">{selectedProduct.title}</h2>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-black text-[#f57224]">৳{selectedProduct.price}</span>
                <span className="text-sm text-gray-400 line-through">৳{selectedProduct.price + 300}</span>
              </div>
              <p className="text-gray-600 text-xs mb-4 leading-relaxed">{selectedProduct.description}</p>

              {/* Size Select */}
              {selectedProduct.sizes && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 text-xs mb-2">Select Size:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 border rounded-md text-xs font-bold transition ${
                          selectedSize === sz ? 'bg-[#f57224] text-white border-[#f57224]' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t">
              <button 
                onClick={() => addToCart(selectedProduct, selectedSize)}
                className="flex-1 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold text-xs transition"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-[#f57224] hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/30"
              >
                <span>⚡</span> Buy Now (WhatsApp)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
