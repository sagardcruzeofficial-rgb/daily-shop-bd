import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addOrder } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, bkash, nagad, rocket
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');

  if (!selectedProduct) return null;

  const handleClose = () => {
    window.history.pushState({}, '', '/');
    setSelectedProduct(null);
    setShowCheckout(false);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (!trxId || !senderPhone)) {
      alert('অনুগ্রহ করে সেন্ডার মোবাইল নম্বর এবং ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    const sizeVal = selectedSize || selectedProduct.sizes?.[0] || 'Standard';

    // 1. Save to Web Admin Panel with Payment & Supplier Info
    const newOrder = {
      productTitle: selectedProduct.title || selectedProduct.name,
      price: selectedProduct.price,
      size: sizeVal,
      supplierName: selectedProduct.supplierName || 'DropShop',
      supplierUrl: selectedProduct.supplierUrl || '',
      customerName,
      phone,
      address,
      paymentMethod: paymentMethod.toUpperCase(),
      trxId: paymentMethod !== 'cod' ? trxId : 'N/A',
      senderPhone: paymentMethod !== 'cod' ? senderPhone : 'N/A'
    };
    addOrder(newOrder);

    // 2. Format WhatsApp Message with Payment Details
    const whatsappMsg = `🛍️ *NEW ORDER CONFIRMED - DailyShopBD*\n\n` +
      `*Product:* ${selectedProduct.title || selectedProduct.name}\n` +
      `*Price:* ৳${selectedProduct.price}\n` +
      `*Size:* ${sizeVal}\n` +
      `*Supplier:* ${selectedProduct.supplierName || 'DropShop'}\n` +
      `*Payment Method:* ${paymentMethod.toUpperCase()}\n` +
      (paymentMethod !== 'cod' ? `*Sender Mobile:* ${senderPhone}\n*TrxID:* ${trxId}\n` : '') +
      `\n👤 *Customer Details:*\n` +
      `*Name:* ${customerName}\n` +
      `*Phone:* ${phone}\n` +
      `*Address:* ${address}`;

    const whatsappUrl = `https://wa.me/8801705507447?text=${encodeURIComponent(whatsappMsg)}`;
    
    alert('অর্ডার সফলভাবে সম্পন্ন হয়েছে! WhatsApp-এ রিডাইরেক্ট করা হচ্ছে।');
    window.open(whatsappUrl, '_blank');
    
    // Reset Modal
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl border-2 border-orange-500 overflow-hidden max-h-[90vh] overflow-y-auto transition-colors">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white w-8 h-8 rounded-full font-bold transition flex items-center justify-center cursor-pointer"
        >
          ✕
        </button>

        {!showCheckout ? (
          /* Product Details Step */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <img src={selectedProduct.image} alt={selectedProduct.title || selectedProduct.name} className="max-h-64 object-contain rounded-lg" />
            </div>

            <div>
              <span className="bg-orange-100 dark:bg-orange-950 text-[#f57224] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                {selectedProduct.category}
              </span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-2 mb-1">{selectedProduct.title || selectedProduct.name}</h2>
              <p className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold mb-2">Supplier: {selectedProduct.supplierName || 'DropShop'}</p>
              <div className="text-2xl font-black text-[#f57224] mb-3">৳{selectedProduct.price}</div>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-4 leading-relaxed">{selectedProduct.description}</p>

              {/* Size Option */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 dark:text-gray-300 text-xs mb-2">Select Size:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1 border rounded-md text-xs font-bold transition cursor-pointer ${
                          (selectedSize === sz || (!selectedSize && selectedProduct.sizes[0] === sz))
                            ? 'bg-[#f57224] text-white border-[#f57224]'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400'
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
                className="w-full bg-[#f57224] hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-xs transition shadow-lg shadow-orange-500/30 cursor-pointer active:translate-y-[1px]"
              >
                Proceed to Buy / Order Now
              </button>
            </div>
          </div>
        ) : (
          /* Customer Order Form & Payment Step */
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Confirm Order & Payment</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Provide your delivery address and payment info.</p>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  required 
                  placeholder="Your Full Name (আপনার নাম)"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2.5 text-xs rounded-lg outline-none focus:border-[#f57224]" 
                />
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  placeholder="Mobile Number (মোবাইল নম্বর)"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2.5 text-xs rounded-lg outline-none focus:border-[#f57224]" 
                />
                <textarea 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required 
                  rows={2}
                  placeholder="Full Delivery Address (সম্পূর্ণ ঠিকানা)"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2.5 text-xs rounded-lg outline-none focus:border-[#f57224]" 
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">Select Payment Method:</label>
                <div className="grid grid-cols-4 gap-2">
                  <label className={`cursor-pointer p-2 rounded-lg border text-center text-xs font-bold transition ${paymentMethod === 'cod' ? 'border-[#f57224] bg-orange-50 dark:bg-orange-950/40 text-[#f57224]' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <input type="radio" name="modalPayment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                    💵 COD
                  </label>
                  <label className={`cursor-pointer p-2 rounded-lg border text-center text-xs font-bold transition ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-600' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <input type="radio" name="modalPayment" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="hidden" />
                    <span className="text-pink-600">bKash</span>
                  </label>
                  <label className={`cursor-pointer p-2 rounded-lg border text-center text-xs font-bold transition ${paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <input type="radio" name="modalPayment" value="nagad" checked={paymentMethod === 'nagad'} onChange={() => setPaymentMethod('nagad')} className="hidden" />
                    <span className="text-orange-600">Nagad</span>
                  </label>
                  <label className={`cursor-pointer p-2 rounded-lg border text-center text-xs font-bold transition ${paymentMethod === 'rocket' ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-600' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <input type="radio" name="modalPayment" value="rocket" checked={paymentMethod === 'rocket'} onChange={() => setPaymentMethod('rocket')} className="hidden" />
                    <span className="text-purple-600">Rocket</span>
                  </label>
                </div>
              </div>

              {/* If Mobile Banking Selected */}
              {paymentMethod !== 'cod' && (
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl space-y-2">
                  <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 p-2 rounded border border-amber-200 dark:border-amber-800">
                    ⚠️ <strong>{paymentMethod.toUpperCase()} Personal Number: 01705507447</strong> e ৳{selectedProduct.price} taka Send Money korun.
                  </div>
                  <input 
                    type="tel" 
                    placeholder={`Sender ${paymentMethod.toUpperCase()} Number (e.g. 017XXXXXXXX)`} 
                    value={senderPhone} 
                    onChange={(e) => setSenderPhone(e.target.value)} 
                    required 
                    className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" 
                  />
                  <input 
                    type="text" 
                    placeholder="Transaction ID (TrxID) e.g. 9J283KLS" 
                    value={trxId} 
                    onChange={(e) => setTrxId(e.target.value)} 
                    required 
                    className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg outline-none font-mono uppercase bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" 
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowCheckout(false)} 
                  className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#f57224] hover:bg-orange-600 text-white py-2.5 rounded-lg text-xs font-bold shadow-lg cursor-pointer active:translate-y-[1px]"
                >
                  Confirm Order (৳{selectedProduct.price})
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
