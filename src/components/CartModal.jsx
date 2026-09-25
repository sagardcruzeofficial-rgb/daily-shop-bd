import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, startCheckout } = useContext(StoreContext);

  if (!isOpen) return null;

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleProceedToCheckout = () => {
    startCheckout(cart);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span>🛒</span> Shopping Cart ({cart.length})
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black font-bold text-xl">✕</button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🛍️</p>
              <p className="text-sm">Your cart is empty!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 items-center justify-between">
                  <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded p-1" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.title}</h4>
                    <p className="text-xs font-black text-[#f57224]">৳{item.price}</p>
                  </div>
                  <button onClick={() => removeFromCart(idx)} className="text-red-500 text-xs font-bold px-2 py-1 hover:bg-red-50 rounded">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between font-black text-gray-900 mb-4">
              <span>Total Price:</span>
              <span className="text-[#f57224]">৳{totalPrice}</span>
            </div>
            <button 
              onClick={handleProceedToCheckout} 
              className="w-full bg-[#f57224] text-white text-xs font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600 transition"
            >
              Proceed to Checkout Page →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
