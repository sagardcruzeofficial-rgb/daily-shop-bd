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

  // শুধুমাত্র নির্বাচিত/টিকমার্ক করা প্রোডাক্টসমূহ
  const selectedItems = cart.filter(item => item.selected !== false);

  // শুধুমাত্র নির্বাচিত প্রোডাক্টগুলোর মোট দাম
  const totalPrice = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);

  // সবগুলো সিলেক্ট করা আছে কিনা চেক করা
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span>🛒</span> Shopping Cart ({cart.length})
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black font-bold text-xl">✕</button>
          </div>

          {/* Select All Checkbox */}
          {cart.length > 0 && (
            <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-100 mb-3 text-xs font-bold text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="w-4 h-4 accent-[#f57224] cursor-pointer"
                />
                <span>Select All ({selectedItems.length}/{cart.length})</span>
              </label>
            </div>
          )}

          {/* Cart Item List */}
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🛍️</p>
              <p className="text-sm">Your cart is empty!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 p-3 rounded-xl border items-center justify-between transition-all ${
                    item.selected !== false ? 'bg-orange-50/30 border-orange-200' : 'bg-gray-50 border-gray-100 opacity-60'
                  }`}
                >
                  {/* Tickmark Checkbox */}
                  <input 
                    type="checkbox" 
                    checked={item.selected !== false}
                    onChange={() => toggleSelectItem(idx)}
                    className="w-4 h-4 accent-[#f57224] cursor-pointer"
                  />

                  <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded p-1 border bg-white" />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.title}</h4>
                    <p className="text-xs font-black text-[#f57224]">৳{item.price}</p>
                  </div>

                  <button 
                    onClick={() => removeFromCart(idx)} 
                    className="text-red-500 text-xs font-bold px-2 py-1 hover:bg-red-50 rounded"
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
          <div className="border-t pt-4">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
              <span>Selected Products:</span>
              <span>{selectedItems.length} items</span>
            </div>

            <div className="flex justify-between font-black text-gray-900 mb-4">
              <span>Total Price:</span>
              <span className="text-[#f57224] text-lg">৳{totalPrice}</span>
            </div>

            <button 
              onClick={handleProceedToCheckout} 
              disabled={selectedItems.length === 0}
              className={`w-full text-white text-xs font-bold py-3 rounded-xl shadow-lg transition ${
                selectedItems.length > 0 
                  ? 'bg-[#f57224] hover:bg-orange-600 cursor-pointer' 
                  : 'bg-gray-300 cursor-not-allowed'
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
