import React, { useState } from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, placeOrder } = useStore();
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const deliveryCharge = cart.length > 0 ? 60 : 0;
  const total = subtotal + deliveryCharge;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address) {
      alert('দয়া করে সকল তথ্য (নাম, ফোন নম্বর ও ঠিকানা) সঠিকভাবে লিখুন।');
      return;
    }
    placeOrder(customer);
    setCustomer({ name: '', phone: '', address: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-xl">
        
        {/* Header */}
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-lg">Shopping Cart ({cart.length})</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items List & Checkout */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              Your cart is empty. Add items to cart to order.
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50">
                    <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-800 truncate">{item.title}</h4>
                      <p className="text-sm font-bold text-gray-900">৳ {item.price}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="border-t pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>৳ {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge:</span>
                  <span>৳ {deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2">
                  <span>Total:</span>
                  <span>৳ {total}</span>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmitOrder} className="border-t pt-4 space-y-3">
                <h3 className="font-bold text-sm text-gray-800">Customer Shipping Details</h3>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full border rounded px-3 py-1.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full border rounded px-3 py-1.5 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Address</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Enter full delivery address"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full border rounded px-3 py-1.5 text-sm outline-none focus:border-amber-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded text-sm transition flex items-center justify-center gap-2"
                >
                  Order via WhatsApp
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
