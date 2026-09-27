import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function CartModal({ isOpen, onClose }) {
  const { 
    cart, 
    removeFromCart, 
    startCheckout, 
    toggleSelectItem, 
    toggleSelectAll 
  } = useContext(StoreContext);

  if (!isOpen) return null;

  const selectedItems = cart.filter(item => item.selected !== false);
  const totalPrice = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);
  const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      alert("দয়া করে চেকআউট করার জন্য কমপক্ষে একটি প্রোডাক্ট টিকমার্ক করুন!");
      return;
    }
    startCheckout(selectedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end transition-opacity">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-l-2 border-gray-200 dark:border-gray-800 transition-colors">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center border-b-2 border-gray-100 dark:border-gray-800 pb-4 mb-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>🛒</span> Shopping Cart ({cart.length})
            </h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-black text-xl p-1">✕</button>
          </div>

          {/* Select All Checkbox */}
          {cart.length > 0 && (
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 mb-3 text-xs font-bold text-gray-700 dark:text-gray-300">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="w-4 h-4 accent-[#f57224] cursor-pointer rounded"
                />
                <span>Select All ({selectedItems.length}/{cart.length})</span>
              </label>
            </div>
          )}

          {/* Cart Item List */}
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <p className="text-5xl mb-3">🛍️</p>
              <p className="text-sm font-bold">Your cart is empty!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 p-3 rounded-xl border-2 items-center justify-between transition-all ${
                    item.selected !== false 
                      ? 'bg-orange-50/50 dark:bg-gray-800/80 border-orange-200 dark:border-gray-700 shadow-sm' 
                      : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 opacity-60'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={item.selected !== false}
                    onChange={() => toggleSelectItem(idx)}
                    className="w-4 h-4 accent-[#f57224] cursor-pointer rounded"
                  />

                  <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg p-1 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-1">{item.title}</h4>
                    <p className="text-xs font-black text-[#f57224]">৳{item.price}</p>
                  </div>

                  <button 
                    onClick={() => removeFromCart(idx)} 
                    className="text-red-500 text-xs font-bold p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Action */}
        {cart.length > 0 && (
          <div className="border-t-2 border-gray-100 dark:border-gray-800 pt-4 mt-4">
            <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
              <span>Selected Products:</span>
              <span>{selectedItems.length} items</span>
            </div>

            <div className="flex justify-between font-black text-gray-900 dark:text-gray-100 mb-4 text-sm">
              <span>Total Price:</span>
              <span className="text-[#f57224] text-lg">৳{totalPrice}</span>
            </div>

            <button 
              onClick={handleProceedToCheckout} 
              disabled={selectedItems.length === 0}
              className={`w-full text-white text-xs font-bold py-3.5 rounded-xl border-2 transition-all shadow-lg active:translate-y-[1px] ${
                selectedItems.length > 0 
                  ? 'bg-[#f57224] border-orange-600 hover:bg-orange-600 cursor-pointer shadow-[0_4px_15px_rgba(245,114,36,0.3)]' 
                  : 'bg-gray-300 dark:bg-gray-800 border-gray-300 dark:border-gray-700 cursor-not-allowed opacity-60'
              }`}
            >
              Proceed to Checkout ({selectedItems.length}) →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
