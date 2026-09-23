import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addOrder } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (!selectedProduct) return null;

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const sizeVal = selectedSize || selectedProduct.sizes?.[0] || 'Standard';

    // 1. Save to Web Admin Panel
    const newOrder = {
      productTitle: selectedProduct.title,
      price: selectedProduct.price,
      size: sizeVal,
      customerName,
      phone,
      address
    };
    addOrder(newOrder);

    // 2. Format WhatsApp Message with full Address
    const whatsappMsg = `📦 *NEW ORDER CONFIRMED!*\n\n*Product:* ${selectedProduct.title}\n*Price:* ৳${selectedProduct.price}\n*Size:* ${sizeVal}\n\n👤 *Customer Details:*\n*Name:* ${customerName}\n*Phone:* ${phone}\n*Delivery Address:* ${address}\n\nPlease deliver this product as soon as possible.`;

    const whatsappUrl = `https://wa.me/8801705507447?text=${encodeURIComponent(whatsappMsg)}`;
    
    alert('Your order has been recorded! Redirecting to WhatsApp to send details.');
    window.open(whatsappUrl, '_blank');
    
    // Reset Modal
    setSelectedProduct(null);
    setShowCheckout(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl border-2 border-orange-500 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => { setSelectedProduct(null); setShowCheckout(false); }}
          className="absolute top-4 right-4 bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white w-8 h-8 rounded-full font-bold transition flex items-center justify-center"
        >
          ✕
        </button>

        {!showCheckout ? (
          /* Product Details Step */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-gray-50 p-4 rounded-xl border flex items-center justify-center">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="max-h-64 object-contain" />
            </div>

            <div>
              <span className="bg-orange-100 text-[#f57224] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                {selectedProduct.category}
              </span>
              <h2 className="text-lg font-bold text-gray-900 mt-2 mb-2">{selectedProduct.title}</h2>
              <div className="text-2xl font-black text-[#f57224] mb-3">৳{selectedProduct.price}</div>
              <p className="text-gray-600 text-xs mb-4 leading-relaxed">{selectedProduct.description}</p>

              {/* Size Option */}
              {selectedProduct.sizes && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 text-xs mb-2">Select Size:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1 border rounded-md text-xs font-bold transition ${
                          selectedSize === sz ? 'bg-[#f57224] text-white border-[#f57224]' : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-[#f57224] hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-xs transition shadow-lg shadow-orange-500/30"
              >
                Proceed to Buy / Order Now
              </button>
            </div>
          </div>
        ) : (
          /* Customer Order Form (Address Step) */
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Confirm Order Address</h3>
            <p className="text-xs text-gray-500 mb-4">Please enter your delivery details to place the order.</p>

            <form onSubmit={handleOrderSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700">Your Full Name</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  required 
                  placeholder="e.g. Rahim Ahmed"
                  className="w-full border p-2 text-xs rounded-lg mt-1 outline-none focus:border-[#f57224]" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  placeholder="017XXXXXXXX"
                  className="w-full border p-2 text-xs rounded-lg mt-1 outline-none focus:border-[#f57224]" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Full Delivery Address (district, area, house no)</label>
                <textarea 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required 
                  rows={3}
                  placeholder="e.g. House 12, Road 5, Mirpur 10, Dhaka"
                  className="w-full border p-2 text-xs rounded-lg mt-1 outline-none focus:border-[#f57224]" 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowCheckout(false)} 
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg text-xs font-bold"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#f57224] hover:bg-orange-600 text-white py-2.5 rounded-lg text-xs font-bold shadow-lg"
                >
                  Confirm Order & Send WhatsApp
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
