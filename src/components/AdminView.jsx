import React, { useContext, useState, useEffect, useRef } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function AdminView() {
  const { 
    products, addProduct, updateProduct, deleteProduct, 
    orders, deleteOrder, 
    footerLinks = [], addFooterLink, deleteFooterLink,
    categoryData = [], addCategory, deleteCategory, addSubCategory, deleteSubCategory,
    supplierList = [], addSupplierSource, deleteSupplierSource 
  } = useContext(StoreContext);
  
  // Form States & Editing States
  const [editingProductId, setEditingProductId] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState(''); // Barcode State
  
  // Image Input States
  const [imageInputType, setImageInputType] = useState('url');
  const [image, setImage] = useState(''); 

  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSubCat, setSelectedSubCat] = useState('');
  const [description, setDescription] = useState('');
  const [supplierUrl, setSupplierUrl] = useState('');
  const [supplierName, setSupplierName] = useState('DropShop');
  const [newSupplierInput, setNewSupplierInput] = useState('');
  const [sizesInput, setSizesInput] = useState('M, L, XL, XXL');
  const [isFetching, setIsFetching] = useState(false);

  // Category & Subcategory Inputs
  const [newCategoryName, setNewCategoryName] = useState('');
  const [targetCategoryForSub, setTargetCategoryForSub] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');

  const [footerTitle, setFooterTitle] = useState('');
  const [footerUrl, setFooterUrl] = useState('');

  const barcodeInputRef = useRef(null);

  // Default Select Initialization
  useEffect(() => {
    if (categoryData.length > 0) {
      if (!selectedCat) setSelectedCat(categoryData[0].name);
      if (!targetCategoryForSub) setTargetCategoryForSub(categoryData[0].name);
    }
  }, [categoryData]);

  // Set default supplier if available
  useEffect(() => {
    if (supplierList.length > 0 && !supplierName) {
      setSupplierName(supplierList[0]);
    }
  }, [supplierList]);

  // Handle Barcode / SKU Scan or Lookup (যদি আগে থেকেই কোনো প্রোডাক্ট এই SKU/Barcode দিয়ে সেভ করা থাকে, তবে তার ডাটা অটো ফিলআপ হয়ে যাবে)
  const handleBarcodeChange = (val) => {
    setBarcode(val);
    setSku(val); // সাধারণত SKU এবং Barcode একই রাখা হয়

    // ডাটাবেজে যদি এই SKU বা Barcode ওয়ালা কোনো প্রোডাক্ট আগে থেকেই থাকে, তবে অটো ফিলআপ করে দিবে
    const existingProduct = products.find(p => p.sku === val || p.barcode === val);
    if (existingProduct) {
      setTitle(existingProduct.title || '');
      setPrice(existingProduct.price ? existingProduct.price.toString() : '');
      setImage(existingProduct.image || '');
      if (existingProduct.category) setSelectedCat(existingProduct.category);
      if (existingProduct.subCategory) setSelectedSubCat(existingProduct.subCategory);
      setDescription(existingProduct.description || '');
      setSupplierUrl(existingProduct.supplierUrl || '');
      if (existingProduct.supplierName) setSupplierName(existingProduct.supplierName);
      if (existingProduct.sizes) {
        setSizesInput(Array.isArray(existingProduct.sizes) ? existingProduct.sizes.join(', ') : existingProduct.sizes);
      }
      setEditingProductId(existingProduct.id); // স্বয়ংক্রয়ভাবে এডিট মোডে নিয়ে যাবে
    }
  };

  // Handle Image File Upload (PC/Mobile)
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔄 Check Stock & Auto Fetch Sizes via API
  const handleCheckStock = async () => {
    if (!supplierUrl) {
      alert('অনুগ্রহ করে প্রথমে Hidden Supplier Link-টি দিন!');
      return;
    }

    setIsFetching(true);
    try {
      const res = await fetch('/api/check-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: supplierUrl }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.sizes && data.sizes.length > 0) {
          setSizesInput(data.sizes.join(', '));
          alert(`সফলভাবে সাইজ পাওয়া গেছে: ${data.sizes.join(', ')}`);
        } else {
          alert('কোনো সাইজ পাওয়া যায়নি বা প্রোডাক্ট আউট অফ স্টক!');
        }
      } else {
        alert('স্টক ডাটা আনা সম্ভব হয়নি। লিঙ্কটি সঠিক কি না তা দেখুন।');
      }
    } catch (err) {
      console.error(err);
      alert('সাপ্লায়ার সাইটে কানেক্ট করা যায়নি!');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddNewSupplier = () => {
    if (!newSupplierInput.trim()) {
      alert('দয়া করে সাপ্লায়ারের নাম লিখুন!');
      return;
    }
    const formattedName = newSupplierInput.trim();
    addSupplierSource(formattedName);
    setSupplierName(formattedName);
    setNewSupplierInput('');
    alert('Supplier Added Successfully!');
  };

  const handleDeleteSupplier = (supToDelete) => {
    if (supplierList.length <= 1) {
      alert('কমপক্ষে একটি সাপ্লায়ার থাকা বাধ্যতামূলক!');
      return;
    }
    if (window.confirm(`Are you sure you want to delete supplier "${supToDelete}"?`)) {
      deleteSupplierSource(supToDelete);
      if (supplierName === supToDelete) {
        const remaining = supplierList.filter(s => s !== supToDelete);
        setSupplierName(remaining[0] || '');
      }
    }
  };

  // ✏️ Load Product Data into Form for Editing
  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setTitle(product.title || '');
    setPrice(product.price ? product.price.toString() : '');
    setSku(product.sku || '');
    setBarcode(product.barcode || product.sku || '');
    setImage(product.image || '');
    if (product.category) setSelectedCat(product.category);
    if (product.subCategory) setSelectedSubCat(product.subCategory);
    setDescription(product.description || '');
    setSupplierUrl(product.supplierUrl || '');
    if (product.supplierName) setSupplierName(product.supplierName);
    if (product.sizes) {
      setSizesInput(Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes);
    }
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Cancel Edit Mode
  const handleCancelEdit = () => {
    setEditingProductId(null);
    setTitle('');
    setPrice('');
    setSku('');
    setBarcode('');
    setImage('');
    setDescription('');
    setSupplierUrl('');
    setSizesInput('M, L, XL, XXL');
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();

    const parsedSizes = sizesInput
      ? sizesInput.split(',').map(s => s.trim()).filter(Boolean)
      : ['Standard'];

    const productData = { 
      title, 
      price: Number(price), 
      sku: sku.trim() || 'N/A', 
      barcode: barcode.trim() || sku.trim() || 'N/A',
      image, 
      category: selectedCat || (categoryData[0] && categoryData[0].name) || 'Fashion', 
      subCategory: selectedSubCat,
      description, 
      sizes: parsedSizes,
      supplierName: supplierName || 'DropShop', 
      supplierUrl: supplierUrl.trim() 
    };

    if (editingProductId) {
      if (typeof updateProduct === 'function') {
        updateProduct(editingProductId, productData);
      }
      alert('Product Updated Successfully!');
      setEditingProductId(null);
    } else {
      addProduct(productData);
      alert('Product Published Successfully with Barcode Scanner & SKU Tracker!');
    }

    setTitle(''); setPrice(''); setSku(''); setBarcode(''); setImage(''); setDescription(''); setSupplierUrl(''); setSizesInput('M, L, XL, XXL');
  };

  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim());
    setNewCategoryName('');
    alert('Main Category Added!');
  };

  const handleAddSubCategorySubmit = (e) => {
    e.preventDefault();
    const currentTargetCat = targetCategoryForSub || (categoryData[0] && categoryData[0].name);
    if (!newSubCategoryName.trim() || !currentTargetCat) {
      alert('Please select a main category first!');
      return;
    }
    addSubCategory(currentTargetCat, newSubCategoryName.trim());
    setNewSubCategoryName('');
    alert(`Sub-Category added under "${currentTargetCat}"!`);
  };

  const handleFooterSubmit = (e) => {
    e.preventDefault();
    addFooterLink({ title: footerTitle, url: footerUrl });
    setFooterTitle(''); setFooterUrl('');
    alert('Footer Link Added!');
  };

  const activeSubCategories = categoryData.find(c => c.name === selectedCat)?.subCategories || [];

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8 font-sans">
      {/* Header Bar */}
      <div className="bg-gray-900 text-white p-6 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
        <div>
          <h2 className="text-2xl font-black text-orange-500">DailyShop BD - Master Admin Panel</h2>
          <p className="text-xs text-gray-400">Barcode Scanner Integration, SKU tracking, multi-suppliers, orders & inventory management.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <a 
            href={typeof window !== 'undefined' ? window.location.origin.replace('admin.', '') : '/'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            👁️ Visit Live Store
          </a>
          <a href="/" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition shadow">
            Exit Admin Mode
          </a>
        </div>
      </div>

      {/* 1. Customer Orders with Barcode & SKU Tracker */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 mb-8">
        <h3 className="font-bold text-gray-800 text-base mb-4 border-b pb-2">📦 Customer Website Orders ({orders ? orders.length : 0})</h3>
        {!orders || orders.length === 0 ? (
          <p className="text-xs text-gray-400 py-4">No orders received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Product, Barcode & Supplier</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Payment Details</th>
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Address</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => {
                  const matchedProduct = products.find(p => p.title === ord.productTitle);
                  const supName = ord.supplierName || (matchedProduct ? matchedProduct.supplierName : 'DropShop');
                  const supUrl = ord.supplierUrl || (matchedProduct ? matchedProduct.supplierUrl : '');
                  const productBarcode = ord.barcode || ord.sku || (matchedProduct ? (matchedProduct.barcode || matchedProduct.sku) : 'N/A');

                  return (
                    <tr key={ord.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 border text-gray-500">{ord.date}</td>
                      <td className="p-2 border">
                        <p className="font-bold text-gray-800">{ord.productTitle} ({ord.size})</p>
                        <div className="mt-1 space-y-1">
                          <span className="inline-block bg-purple-50 text-purple-800 font-mono font-bold px-1.5 py-0.5 rounded border border-purple-200 text-[10px]">
                            📷 Barcode / SKU: {productBarcode}
                          </span>
                        </div>
                        <div className="mt-1 bg-orange-50 p-1.5 rounded border border-orange-200 inline-block">
                          <span className="text-[10px] font-bold text-orange-800">📦 Supplier: {supName}</span>
                          {supUrl ? (
                            <div>
                              <a href={supUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 underline font-semibold hover:text-blue-800 block">
                                🔗 Order from Supplier
                              </a>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400 block italic">No link saved</span>
                          )}
                        </div>
                      </td>
                      <td className="p-2 border font-bold text-orange-600">৳{ord.price}</td>
                      
                      <td className="p-2 border">
                        <span className={`inline-block px-2 py-0.5 rounded font-black text-[10px] ${
                          ord.paymentMethod === 'COD' ? 'bg-gray-200 text-gray-800' : 'bg-pink-100 text-pink-700'
                        }`}>
                          {ord.paymentMethod || 'COD'}
                        </span>
                        {ord.paymentMethod && ord.paymentMethod !== 'COD' && (
                          <div className="mt-1 space-y-0.5 text-[10px] font-mono">
                            <p><strong>Sender:</strong> {ord.senderPhone}</p>
                            <p><strong>TrxID:</strong> <span className="text-orange-600 font-bold">{ord.trxId}</span></p>
                          </div>
                        )}
                      </td>

                      <td className="p-2 border font-semibold">{ord.customerName}</td>
                      <td className="p-2 border text-blue-600">{ord.phone}</td>
                      <td className="p-2 border max-w-xs">{ord.address}</td>
                      <td className="p-2 border">
                        <button onClick={() => deleteOrder(ord.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-[10px] transition">Clear</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Management Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Barcode Scanner & Publish / Edit Product Form */}
        <div className={`bg-white p-5 rounded-2xl shadow border ${editingProductId ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h3 className="font-bold text-gray-800 text-sm">
              {editingProductId ? '✏️ Edit / Scan Product' : '📷 Barcode Scan & Publish'}
            </h3>
            {editingProductId && (
              <button 
                type="button" 
                onClick={handleCancelEdit} 
                className="text-[10px] bg-gray-200 hover:bg-gray-300 font-bold px-2 py-0.5 rounded text-gray-700"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleProductSubmit} className="space-y-3">
            {/* Barcode Scanner Input Field */}
            <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 space-y-1">
              <label className="block text-[11px] font-bold text-purple-900">📷 Scan Barcode or Enter SKU:</label>
              <input 
                ref={barcodeInputRef}
                type="text" 
                placeholder="Scan barcode here (Auto-Fill)" 
                value={barcode} 
                onChange={(e) => handleBarcodeChange(e.target.value)} 
                className="w-full border border-purple-300 p-2 text-xs rounded bg-white font-mono font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400" 
              />
              <p className="text-[9px] text-purple-600">💡 স্ক্যান করার সাথে সাথে যদি আগে থেকে সেভ করা থাকে তবে ফিল্ডগুলো অটো ফিলআপ হয়ে যাবে।</p>
            </div>

            <input type="text" placeholder="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            
            <div className="flex gap-2">
              <input type="number" placeholder="Price BDT" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-1/2 border p-2 text-xs rounded" />
              <input type="text" placeholder="SKU Code" value={sku} onChange={(e) => setSku(e.target.value)} className="w-1/2 border p-2 text-xs rounded font-mono font-bold bg-blue-50/50 border-blue-200" />
            </div>
            
            {/* Image Input Section */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-600">Product Image Source:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setImageInputType('url')}
                  className={`flex-1 py-1 text-[10px] font-bold rounded border transition ${
                    imageInputType === 'url' ? 'bg-orange-500 text-white border-orange-600' : 'bg-gray-100 text-gray-600 border-gray-300'
                  }`}
                >
                  🔗 Image Link
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputType('file')}
                  className={`flex-1 py-1 text-[10px] font-bold rounded border transition ${
                    imageInputType === 'file' ? 'bg-orange-500 text-white border-orange-600' : 'bg-gray-100 text-gray-600 border-gray-300'
                  }`}
                >
                  📁 Upload File
                </button>
              </div>

              {imageInputType === 'url' ? (
                <input 
                  type="url" 
                  placeholder="https://example.com/image.jpg" 
                  value={image.startsWith('data:') ? '' : image} 
                  onChange={(e) => setImage(e.target.value)} 
                  required 
                  className="w-full border p-2 text-xs rounded" 
                />
              ) : (
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageFileChange} 
                  required={!image} 
                  className="w-full border p-1 text-[11px] rounded bg-gray-50 cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-orange-500 file:text-white" 
                />
              )}

              {image && (
                <div className="flex items-center gap-2 mt-1">
                  <img src={image} alt="Preview" className="w-8 h-8 object-cover rounded border" />
                  <span className="text-[10px] text-green-600 font-bold">✓ Image Ready</span>
                </div>
              )}
            </div>

            {/* Category Dropdown */}
            <label className="block text-[11px] font-bold text-gray-600">Main Category:</label>
            <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="w-full border p-2 text-xs rounded font-medium text-gray-700">
              {categoryData.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            {/* Sub Category Dropdown */}
            <label className="block text-[11px] font-bold text-gray-600">Sub-Category:</label>
            <select value={selectedSubCat} onChange={(e) => setSelectedSubCat(e.target.value)} className="w-full border p-2 text-xs rounded font-medium text-gray-700">
              <option value="">None / Select Sub-Category</option>
              {activeSubCategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>

            {/* Supplier Selection & Hidden Link */}
            <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-200 space-y-2">
              <label className="block text-[10px] font-bold text-orange-800 uppercase">🏢 Select Supplier Source:</label>
              <select 
                value={supplierName} 
                onChange={(e) => setSupplierName(e.target.value)}
                className="w-full border border-orange-300 p-1.5 text-xs rounded bg-white font-semibold text-gray-700"
              >
                {supplierList && supplierList.map((sup, index) => (
                  <option key={index} value={sup}>{sup}</option>
                ))}
              </select>

              {/* Add & Manage Suppliers Section */}
              <div className="mt-2 space-y-1.5 border-t border-orange-200 pt-2">
                <span className="text-[10px] font-bold text-orange-900 block">Manage Suppliers (Add / Delete):</span>
                <div className="flex gap-1.5">
                  <input 
                    type="text" 
                    placeholder="New supplier name" 
                    value={newSupplierInput}
                    onChange={(e) => setNewSupplierInput(e.target.value)}
                    className="w-full border border-orange-300 p-1 text-[11px] rounded bg-white"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddNewSupplier}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded text-[11px] whitespace-nowrap shadow"
                  >
                    + Add
                  </button>
                </div>

                <div className="max-h-24 overflow-y-auto space-y-1 bg-white p-1.5 rounded border border-orange-200">
                  {supplierList.map((sup) => (
                    <div key={sup} className="flex justify-between items-center text-[10px] bg-gray-50 px-1.5 py-0.5 rounded">
                      <span className="font-semibold text-gray-700">{sup}</span>
                      <button 
                        type="button"
                        onClick={() => handleDeleteSupplier(sup)}
                        className="text-red-500 hover:text-red-700 font-bold px-1"
                        title="Delete Supplier"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="block text-[10px] font-bold text-orange-800 uppercase mt-1">🔒 Hidden Supplier Link:</label>
              <input 
                type="url" 
                placeholder="https://supplier-site.com/product-link" 
                value={supplierUrl} 
                onChange={(e) => setSupplierUrl(e.target.value)} 
                className="w-full border border-orange-300 p-1.5 text-xs rounded bg-white focus:outline-none" 
              />
              <button
                type="button"
                onClick={handleCheckStock}
                disabled={isFetching}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 rounded text-[11px] transition shadow flex items-center justify-center gap-1"
              >
                {isFetching ? '⏳ Checking Stock & Sizes...' : '🔍 Check Stock & Auto-Fetch Sizes'}
              </button>
            </div>

            {/* Sizes Input */}
            <label className="block text-[11px] font-bold text-gray-600">Available Sizes (Comma Separated):</label>
            <input 
              type="text" 
              placeholder="e.g. M, L, XL, XXL or 40, 41, 42" 
              value={sizesInput} 
              onChange={(e) => setSizesInput(e.target.value)} 
              className="w-full border p-2 text-xs rounded bg-emerald-50/40 font-semibold text-emerald-800 border-emerald-300" 
            />

            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border p-2 text-xs rounded" rows={3}></textarea>
            
            <button className={`w-full font-bold py-2 rounded text-xs text-white transition shadow ${
              editingProductId ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#f57224] hover:bg-orange-600'
            }`}>
              {editingProductId ? '💾 Update Scanned Product' : 'Publish Product'}
            </button>
          </form>
        </div>

        {/* Category & Sub-Category Manager */}
        <div className="bg-white p-5 rounded-2xl shadow border border-gray-200 space-y-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-2 border-b pb-1 text-sm">📁 Add Main Category</h3>
            <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
              <input type="text" placeholder="Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required className="flex-1 border p-1.5 text-xs rounded" />
              <button className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded text-xs hover:bg-blue-700">Add</button>
            </form>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-2 border-b pb-1 text-sm">📂 Add Sub-Category</h3>
            <form onSubmit={handleAddSubCategorySubmit} className="space-y-2">
              <select value={targetCategoryForSub} onChange={(e) => setTargetCategoryForSub(e.target.value)} className="w-full border p-1.5 text-xs rounded">
                {categoryData.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <input type="text" placeholder="Sub-Category Name" value={newSubCategoryName} onChange={(e) => setNewSubCategoryName(e.target.value)} required className="flex-1 border p-1.5 text-xs rounded" />
                <button className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded text-xs hover:bg-emerald-700">Add</button>
              </div>
            </form>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 border-t pt-2">
            <h4 className="text-[11px] font-bold text-gray-500 uppercase">Active Category Structure:</h4>
            {categoryData.map((c) => (
              <div key={c.name} className="bg-gray-50 p-2 rounded border text-xs">
                <div className="flex justify-between items-center font-bold text-gray-800">
                  <span>{c.name}</span>
                  <button onClick={() => deleteCategory(c.name)} className="text-red-500 hover:text-red-700 font-bold px-1" title="Delete Main Category">✕</button>
                </div>
                <div className="pl-3 mt-1 space-y-1 border-l-2 border-orange-400">
                  {(c.subCategories || []).length === 0 ? (
                    <span className="text-[10px] text-gray-400 italic">No sub-categories</span>
                  ) : (
                    (c.subCategories || []).map((sub) => (
                      <div key={sub} className="flex justify-between items-center text-[11px] text-gray-600">
                        <span>• {sub}</span>
                        <button onClick={() => deleteSubCategory(c.name, sub)} className="text-red-400 hover:text-red-600 font-bold px-1" title="Delete Sub-Category">✕</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Footer Link Manager */}
        <div className="bg-white p-5 rounded-2xl shadow border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 text-sm">⚙️ Dynamic Footer Manager</h3>
          <form onSubmit={handleFooterSubmit} className="space-y-3 mb-4">
            <input type="text" placeholder="Footer Link Name" value={footerTitle} onChange={(e) => setFooterTitle(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            <input type="text" placeholder="URL Target" value={footerUrl} onChange={(e) => setFooterUrl(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            <button className="w-full bg-gray-800 text-white font-bold py-2 rounded text-xs hover:bg-black transition">Add Footer Link</button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {footerLinks.map((fl) => (
              <div key={fl.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border text-xs">
                <span className="truncate max-w-[150px]">{fl.title}</span>
                <button onClick={() => deleteFooterLink(fl.id)} className="text-red-500 font-bold hover:text-red-700">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Manage, Edit & Delete Products Section */}
        <div className="bg-white p-5 rounded-2xl shadow border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 text-sm">🗑️ Manage Products ({products.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {products.map((p) => (
              <div key={p.id} className="flex flex-col bg-gray-50 p-2 rounded border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate max-w-[130px] text-gray-700">{p.title}</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEditClick(p)} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 text-[10px] rounded font-bold transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteProduct(p.id)} 
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 text-[10px] rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 flex flex-col gap-0.5">
                  <span><strong>Barcode/SKU:</strong> <span className="text-purple-700 font-mono font-bold">{p.barcode || p.sku || 'N/A'}</span></span>
                  <span><strong>Supplier:</strong> <span className="text-orange-600 font-bold">{p.supplierName || 'DropShop'}</span></span>
                  <span><strong>Sizes:</strong> {Array.isArray(p.sizes) ? p.sizes.join(', ') : 'Standard'}</span>
                  {p.supplierUrl ? (
                    <a href={p.supplierUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline truncate hover:text-blue-800">
                      🔗 Supplier Link
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">No supplier link added</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
