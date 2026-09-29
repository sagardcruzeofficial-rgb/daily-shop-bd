{/* 🏢 Select Supplier Source */}
<div className="mb-3">
  <label className="block text-xs font-bold mb-1">🏢 Select Supplier Source:</label>
  <select 
    value={
      ['Daraz', 'AliExpress', 'Alibaba', 'Local Wholesale'].includes(productData.supplierName) 
        ? productData.supplierName 
        : (productData.supplierName ? 'Other' : 'Daraz')
    } 
    onChange={(e) => {
      const selectedVal = e.target.value;
      if (selectedVal === 'Other') {
        setProductData({...productData, supplierName: ''});
      } else {
        setProductData({...productData, supplierName: selectedVal});
      }
    }}
    className="w-full p-2 border rounded-xl text-xs bg-white font-medium mb-2"
  >
    <option value="Daraz">Daraz</option>
    <option value="AliExpress">AliExpress</option>
    <option value="Alibaba">Alibaba</option>
    <option value="Local Wholesale">Local Wholesale</option>
    <option value="Other">➕ Add New / Custom Supplier</option>
  </select>

  {/* যদি ফিক্সড অপশনগুলোর বাইরে অন্য কিছু হয় বা 'Other' সিলেক্ট করা হয়, তবে কাস্টম লেখার ইনপুট আসবে */}
  {(!['Daraz', 'AliExpress', 'Alibaba', 'Local Wholesale'].includes(productData.supplierName)) && (
    <input 
      type="text" 
      placeholder="Type new dropshipping site name (e.g. AjkerDeal, BDStall)..." 
      value={productData.supplierName || ''} 
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
