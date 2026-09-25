import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function CartModal({ isOpen, onClose }) {
  const { cart, addOrder } = useContext(StoreContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCartOrderSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderDetailsList = cart.map(item => `- ${item.title} (${item.selectedSize}): ৳${item.price}`).join('\n');

    // Add Order to Admin Panel
    cart.forEach(item => {
      addOrder({
        productTitle: item.title,
        price: item.price,
        size: item.selectedSize,
        customerName,
        phone,
        address
      });
    });

    const whatsappMsg = `📦 *NEW CART ORDER CONFIRMED!*\n\n*Items Ordered:*\n${orderDetailsList}\n\n*Total Amount:* ৳${totalPrice}\n\n👤 *Customer Details:*\n*Name:* ${customerName}\n*Phone:* ${phone}\n*Address:* ${address}`;

    const whatsappUrl = `https://wa.me/8801705507447?text=${encodeURIComponent(whatsappMsg)}`;
    alert('Order placed successfully! Redirecting to WhatsApp.');
    window.open(whatsappUrl, '_blank');
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
          ) : !showCheckout ? (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 items-center justify-between">
                  <img src={item.image} alt={item.title} className="w-12 h-12 object-contain bg-white rounded p-1" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-gray-500">Size: {item.selectedSize}</p>
                    <p className="text-xs font-black text-[#f57224]">৳{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCartOrderSubmit} className="space-y-3">
              <h3 className="font-bold text-xs text-gray-700 uppercase">Delivery Address Details</h3>
              <input type="text" placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="w-full border p-2 text-xs rounded" />
              <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full border p-2 text-xs rounded" />
              <textarea placeholder="Delivery Address (House, Road, Area, District)" value={address} onChange={(e) => setAddress(e.target.value)} required rows={3} className="w-full border p-2 text-xs rounded"></textarea>
              <button type="submit" className="w-full bg-[#f57224] text-white text-xs font-bold py-3 rounded-lg shadow-lg hover:bg-orange-600">Confirm Order (৳{totalPrice})</button>
            </form>
          )}
        </div>

        {cart.length > 0 && !showCheckout && (
          <div className="border-t pt-4">
            <div className="flex justify-between font-black text-gray-900 mb-4">
              <span>Total Price:</span>
              <span className="text-[#f57224]">৳{totalPrice}</span>
            </div>
            <button onClick={() => setShowCheckout(true)} className="w-full bg-[#f57224] text-white text-xs font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
