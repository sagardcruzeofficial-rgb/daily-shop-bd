import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function CheckoutPage() {
  const { checkoutItems, addOrder, setActiveTab, clearCart } = useContext(StoreContext);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, bkash, nagad, rocket
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [selectedSizes, setSelectedSizes] = useState(
    checkoutItems.reduce((acc, item, idx) => ({ ...acc, [idx]: item.selectedSize || (item.sizes ? item.sizes[0] : 'Free Size') }), {})
  );

  const totalPrice = checkoutItems.reduce((sum, item) => sum + item.price, 0);

  const handleSizeChange = (idx, size) => {
    setSelectedSizes((prev) => ({ ...prev, [idx]: size }));
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();

    if (checkoutItems.length === 0) {
      alert('আপনার অর্ডার তালিকায় কোনো প্রোডাক্ট নেই!');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (!trxId || !senderPhone)) {
      alert('অনুগ্রহ করে Sender Mobile Number এবং Transaction ID (TrxID) প্রদান করুন।');
      return;
    }

    const itemDetails = checkoutItems.map((item, idx) => `- ${item.title} (Size: ${selectedSizes[idx]}): ৳${item.price}`).join('\n');

    // Admin Panel Order Push with Supplier Info
    checkoutItems.forEach((item, idx) => {
      addOrder({
        productTitle: item.title,
        price: item.price,
        size: selectedSizes[idx],
        supplierName: item.supplierName || 'DropShop', // সাপ্লায়ারের নাম যুক্ত করা হলো
        supplierUrl: item.supplierUrl || '',           // সাপ্লায়ারের লিঙ্ক যুক্ত করা হলো
        customerName,
        phone,
        address,
        paymentMethod: paymentMethod.toUpperCase(),
        trxId: paymentMethod !== 'cod' ? trxId : 'N/A',
        senderPhone: paymentMethod !== 'cod' ? senderPhone : 'N/A'
      });
    });

    // WhatsApp Message Creation
    const message = `🛍️ *NEW ORDER CONFIRMED - DailyShopBD*\n\n` +
      `*Order Items:*\n${itemDetails}\n\n` +
      `*Total Amount:* ৳${totalPrice}\n` +
      `*Payment Method:* ${paymentMethod.toUpperCase()}\n` +
      (paymentMethod !== 'cod' ? `*Sender Mobile:* ${senderPhone}\n*TrxID:* ${trxId}\n` : '') +
      `\n👤 *Customer Details:*\n` +
      `*Name:* ${customerName}\n` +
      `*Phone:* ${phone}\n` +
      `*Address:* ${address}`;

    alert('অর্ডার সফলভাবে সম্পন্ন হয়েছে! এডমিন প্যানেলে জমা হয়েছে।');
    
    // Clear Cart & Redirect to Home
    clearCart();
    window.open(`https://wa.me/8801705507447?text=${encodeURIComponent(message)}`, '_blank');
    setActiveTab('Home');
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white p-8 rounded-2xl shadow text-center">
        <p className="text-4xl mb-3">🛒</p>
        <h2 className="text-xl font-bold text-gray-800">অর্ডারের জন্য কোনো প্রোডাক্ট সিলেক্ট করা নেই!</h2>
        <button onClick={() => setActiveTab('Home')} className="mt-4 bg-[#f57224] text-white px-6 py-2 rounded-lg font-bold">
          কেনাকাটা করুন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 font-sans">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Top Title */}
        <div className="bg-[#111827] text-white p-5 flex justify-between items-center">
          <h1 className="text-lg font-black tracking-wide flex items-center gap-2">
            🛍️ DailyShopBD - Checkout & Payment
          </h1>
          <button onClick={() => setActiveTab('Home')} className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300">
            ← Back to Shop
          </button>
        </div>

        <form onSubmit={handleConfirmOrder} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Side: Product Summary & Size Selector */}
          <div className="space-y-5">
            <h2 className="text-sm font-black text-gray-900 uppercase border-b pb-2">1. Selected Products</h2>
            
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg bg-white border" />
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-gray-800">{item.title}</h3>
                    <p className="text-[10px] text-orange-600 font-semibold">Supplier: {item.supplierName || 'DropShop'}</p>
                    <p className="text-xs font-black text-[#f57224] mt-1">৳{item.price}</p>
                    
                    {/* Size Selector */}
                    {item.sizes && item.sizes.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[11px] text-gray-500 font-bold">Select Size:</span>
                        <div className="flex gap-1">
                          {item.sizes.map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => handleSizeChange(idx, sz)}
                              className={`text-[10px] px-2 py-0.5 rounded border transition font-bold ${
                                selectedSizes[idx] === sz
                                  ? 'bg-[#f57224] text-white border-[#f57224]'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Total Card */}
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700">Total Payable Amount:</span>
              <span className="text-xl font-black text-[#f57224]">৳{totalPrice}</span>
            </div>

            {/* Delivery Info */}
            <h2 className="text-sm font-black text-gray-900 uppercase border-b pb-2 pt-2">2. Delivery Address</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Full Name (আপনার নাম)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="w-full text-xs p-3 border border-gray-300 rounded-lg outline-none focus:border-[#f57224]" />
              <input type="tel" placeholder="Mobile Number (মোবাইল নম্বর)" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full text-xs p-3 border border-gray-300 rounded-lg outline-none focus:border-[#f57224]" />
              <textarea placeholder="Full Delivery Address (সম্পূর্ণ ঠিকানা)" value={address} onChange={(e) => setAddress(e.target.value)} required rows={3} className="w-full text-xs p-3 border border-gray-300 rounded-lg outline-none focus:border-[#f57224]"></textarea>
            </div>
          </div>

          {/* Right Side: Real Payment Gateway Options */}
          <div className="space-y-5">
            <h2 className="text-sm font-black text-gray-900 uppercase border-b pb-2">3. Payment Option</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Cash on Delivery */}
              <label className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'cod' ? 'border-[#f57224] bg-orange-50/50 shadow-sm' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                <span className="text-2xl">💵</span>
                <span className="text-xs font-bold text-gray-800">Cash on Delivery</span>
              </label>

              {/* bKash */}
              <label className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50/50 shadow-sm' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name="payment" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="hidden" />
                <span className="text-xs font-black text-pink-600 bg-pink-100 px-2 py-0.5 rounded">bKash</span>
                <span className="text-xs font-bold text-gray-800">বিকাশ সেন্ড মানি</span>
              </label>

              {/* Nagad */}
              <label className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-50/50 shadow-sm' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name="payment" value="nagad" checked={paymentMethod === 'nagad'} onChange={() => setPaymentMethod('nagad')} className="hidden" />
                <span className="text-xs font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded">Nagad</span>
                <span className="text-xs font-bold text-gray-800">নগদ সেন্ড মানি</span>
              </label>

              {/* Rocket */}
              <label className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'rocket' ? 'border-purple-500 bg-purple-50/50 shadow-sm' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name="payment" value="rocket" checked={paymentMethod === 'rocket'} onChange={() => setPaymentMethod('rocket')} className="hidden" />
                <span className="text-xs font-black text-purple-600 bg-purple-100 px-2 py-0.5 rounded">Rocket</span>
                <span className="text-xs font-bold text-gray-800">রকেট সেন্ড মানি</span>
              </label>
            </div>

            {/* Payment Number & TrxID Input Box (If Mobile Banking Selected) */}
            {paymentMethod !== 'cod' && (
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-[11px] text-amber-800">
                  ⚠️ অনুগ্রহ করে আমাদের <strong>{paymentMethod.toUpperCase()} Personal Number: <span className="underline font-bold text-black">01705507447</span></strong> এ মোট <strong>৳{totalPrice}</strong> টাকা Send Money করুন এবং নিচের ঘরে তথ্য দিন।
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">আপনার {paymentMethod.toUpperCase()} নম্বর (Sender Mobile):</label>
                  <input type="tel" placeholder="e.g. 017XXXXXXXX" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} required className="w-full text-xs p-2.5 border rounded-lg outline-none" />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Transaction ID (TrxID):</label>
                  <input type="text" placeholder="e.g. 9J283KLS" value={trxId} onChange={(e) => setTrxId(e.target.value)} required className="w-full text-xs p-2.5 border rounded-lg outline-none font-mono uppercase" />
                </div>
              </div>
            )}

            {/* Confirm Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#f57224] hover:bg-orange-600 text-white font-black text-sm py-3.5 rounded-xl shadow-lg transition"
            >
              Confirm Order (৳{totalPrice})
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
