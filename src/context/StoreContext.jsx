{/* 🏢 Select Supplier Source */}
<div className="mb-3">
  <label className="block text-xs font-bold mb-1">🏢 Select Supplier Source:</label>
  <select 
    value={productData.supplierName || 'Daraz'} 
    onChange={(e) => setProductData({...productData, supplierName: e.target.value})}
    className="w-full p-2 border rounded-xl text-xs bg-white font-medium mb-2"
  >
    <option value="Daraz">Daraz</option>
    <option value="AliExpress">AliExpress</option>
    <option value="Alibaba">Alibaba</option>
    <option value="Local Wholesale">Local Wholesale</option>
    <option value="Other">Other / Custom</option>
  </select>

  {/* যদি অপশনে না থাকে, তবে নিজে নাম লিখে দেওয়ার জন্য কাস্টম ইনপุต */}
  {productData.supplierName === 'Other' && (
    <input 
      type="text" 
      placeholder="Type custom supplier name..." 
      onChange={(e) => setProductData({...productData, supplierName: e.target.value})}
      className="w-full p-2 border rounded-xl text-xs mt-1"
    />
  )}
</div>

{/* Supplier Product Link */}
<div className="mb-3">
  <label className="block text-xs font-bold mb-1">🔗 Supplier Product Link (URL):</label>
  <input 
    type="url" 
    placeholder="https://www.daraz.com.bd/products/..." 
    value={productData.supplierUrl || ''} 
    onChange={(e) => setProductData({...productData, supplierUrl: e.target.value})}
    className="w-full p-2 border rounded-xl text-xs"
  />
</div>
