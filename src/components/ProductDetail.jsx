import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function ProductDetail({ product, onBack }) {
  const { addOrder, addToCart, startCheckout } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Standard');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');

  if (!product) return null;

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (!trxId || !senderPhone)) {
      alert('অনুগ্রহ করে সেন্ডার মোবাইল নম্বর এবং ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    const newOrder = {
      productTitle: product.title || product.name,
      price: product.price,
      size: selectedSize,
      supplierName: product.supplierName || 'Daraz',
      supplierUrl: product.supplierUrl || '',
      customerName,
      phone,
      address,
      paymentMethod: paymentMethod.toUpperCase(),
      trxId: paymentMethod !== 'cod' ? trxId : 'N/A',
      senderPhone: paymentMethod !== 'cod' ? senderPhone : 'N/A'
    };

    addOrder(newOrder);

    const whatsappMsg = `🛍️ *NEW ORDER CONFIRMED - DailyShopBD*\n\n` +
      `*Product:* ${product.title || product.name}\n` +
      `*Price:* ৳${product.price}\n` +
      `*Size:* ${selectedSize}\n` +
      `*Supplier:* ${product.supplierName || 'Daraz'}\n` +
      `*Payment Method:* ${paymentMethod.toUpperCase()}\n` +
      (paymentMethod !== 'cod' ? `*Sender Mobile:* ${senderPhone}\n*TrxID:* ${trxId}\n` : '') +
      `\n👤 *Customer Details:*\n` +
      `*Name:* ${customerName}\n` +
      `*Phone:* ${phone}\n` +
      `*Address:* ${address}`;

    const whatsappUrl = `https://wa.me/8801705507447?text=${encodeURIComponent(whatsappMsg)}`;
    
    alert('অর্ডার সফলভাবে সম্পন্ন হয়েছে! WhatsApp-এ রিডাইরেক্ট করা হচ্ছে।');
    window.open(whatsappUrl, '_blank');
    if (onBack) onBack();
  };

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize });
    alert('কার্টে সফলভাবে প্রোডাক্টটি যোগ করা হয়েছে!');
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm max-w-4xl mx-auto">
      {onBack && (
        <button 
          onClick={onBack}
          className="mb-6 bg-gray-100 dark:bg-gray-800 hover:bg-[#f57224] hover:text-white text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
        >
          <span>←</span> Back to Products
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <img src={product.image} alt={product.title || product.name} className="max-h-80 object-contain rounded-lg" />
        </div>

        <div className="space-y-4">
          <div>
            <span className="bg-orange-100 dark:bg-orange-950 text-[#f57224] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
              {product.category || 'General'}
            </span>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100 mt-2">
              {product.title || product.name}
            </h1>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-1">
              Supplier: {product.supplierName || 'Daraz'}
            </p>
          </div>

          <div className="text-3xl font-black text-[#f57224]">৳{product.price}</div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {product.description || 'High quality product available at DailyShopBD with fast delivery across Bangladesh.'}
          </p>

          {/* Size Options */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Select Size:</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-1.5 border rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedSize === sz
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

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              Add to Cart
            </button>
          </div>

          {/* Order Form */}
          <form onSubmit={handleOrderSubmit} className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Direct Checkout</h3>
            
            <input 
              type="text" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
              required 
              placeholder="Your Full Name (আপনার নাম)"
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2.5 text-xs rounded-xl outline-none focus:border-[#f57224]" 
            />
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              placeholder="Mobile Number (মোবাইল নম্বর)"
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2.5 text-xs rounded-xl outline-none focus:border-[#f57224]" 
            />
            <textarea 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
              rows={2}
              placeholder="Full Delivery Address (সম্পূর্ণ ঠিকানা)"
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2.5 text-xs rounded-xl outline-none focus:border-[#f57224]" 
            />

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">Payment Method:</label>
              <div className="grid grid-cols-4 gap-2">
                {['cod', 'bkash', 'nagad', 'rocket'].map((method) => (
                  <label key={method} className={`cursor-pointer p-2 rounded-xl border text-center text-xs font-bold uppercase transition ${paymentMethod === method ? 'border-[#f57224] bg-orange-50 dark:bg-orange-950/40 text-[#f57224]' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <input type="radio" name="detailPayment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="hidden" />
                    {method === 'cod' ? '💵 COD' : method}
                  </label>
                ))}
              </div>
            </div>

            {paymentMethod !== 'cod' && (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl space-y-2">
                <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 p-2 rounded-lg border border-amber-200 dark:border-amber-800">
                  ⚠️ <strong>{paymentMethod.toUpperCase()} Personal Number: 01705507447</strong> e ৳{product.price} taka Send Money korun.
                </div>
                <input 
                  type="tel" 
                  placeholder={`Sender ${paymentMethod.toUpperCase()} Number`} 
                  value={senderPhone} 
                  onChange={(e) => setSenderPhone(e.target.value)} 
                  required 
                  className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" 
                />
                <input 
                  type="text" 
                  placeholder="Transaction ID (TrxID)" 
                  value={trxId} 
                  onChange={(e) => setTrxId(e.target.value)} 
                  required 
                  className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-mono uppercase bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" 
                />
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#f57224] hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-orange-500/30 transition cursor-pointer active:translate-y-[1px]"
            >
              Confirm Order (৳{product.price})
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
