import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function AdminView() {
  const { 
    products, addProduct, deleteProduct, 
    orders, deleteOrder, 
    footerLinks = [], addFooterLink, deleteFooterLink,
    categoryData = [], addCategory, deleteCategory, addSubCategory, deleteSubCategory 
  } = useContext(StoreContext);
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSubCat, setSelectedSubCat] = useState('');
  const [description, setDescription] = useState('');
  const [supplierUrl, setSupplierUrl] = useState('');
  const [supplierName, setSupplierName] = useState('DropShop'); // নতুন সাপ্লায়ার সিলেক্টর স্টেট
  const [sizesInput, setSizesInput] = useState('M, L, XL, XXL');
  const [isFetching, setIsFetching] = useState(false);

  // Category & Subcategory Inputs
  const [newCategoryName, setNewCategoryName] = useState('');
  const [targetCategoryForSub, setTargetCategoryForSub] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');

  const [footerTitle, setFooterTitle] = useState('');
  const [footerUrl, setFooterUrl] = useState('');

  // Default Select Initialization
  useEffect(() => {
    if (categoryData.length > 0) {
      if (!selectedCat) setSelectedCat(categoryData[0].name);
      if (!targetCategoryForSub) setTargetCategoryForSub(categoryData[0].name);
    }
  }, [categoryData]);

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

  const handleProductSubmit = (e) => {
    e.preventDefault();

    // Process comma-separated sizes into an array
    const parsedSizes = sizesInput
      ? sizesInput.split(',').map(s => s.trim()).filter(Boolean)
      : ['Standard'];

    addProduct({ 
      title, 
      price: Number(price), 
      image, 
      category: selectedCat || (categoryData[0] && categoryData[0].name) || 'Fashion', 
      subCategory: selectedSubCat,
      description, 
      sizes: parsedSizes,
      supplierName: supplierName, // কোন সাইটের প্রোডাক্ট তা সেভ হবে
      supplierUrl: supplierUrl.trim() // Secret supplier link
    });

    setTitle(''); setPrice(''); setImage(''); setDescription(''); setSupplierUrl(''); setSizesInput('M, L, XL, XXL');
    alert('Product Published Successfully with Supplier Tracker!');
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
          <p className="text-xs text-gray-400">Manage products, sub-categories, multi-suppliers, orders & footer links.</p>
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

      {/* 1. Customer Orders with Supplier Tracker */}
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
                  <th className="p-2 border">Product & Supplier Info</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Address</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => {
                  // অর্ডারের সাথে যুক্ত প্রোডাক্ট খুঁজে বের করা যাতে সাপ্লায়ার ইনফো পাওয়া যায়
                  const matchedProduct = products.find(p => p.title === ord.productTitle);
                  const supName = ord.supplierName || (matchedProduct ? matchedProduct.supplierName : 'DropShop');
                  const supUrl = ord.supplierUrl || (matchedProduct ? matchedProduct.supplierUrl : '');

                  return (
                    <tr key={ord.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 border text-gray-500">{ord.date}</td>
                      <td className="p-2 border">
                        <p className="font-bold text-gray-800">{ord.productTitle} ({ord.size})</p>
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
        
        {/* Publish Product Form */}
        <div className="bg-white p-5 rounded-2xl shadow border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 text-sm">➕ Publish New Product</h3>
          <form onSubmit={handleProductSubmit} className="space-y-3">
            <input type="text" placeholder="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            <input type="number" placeholder="Price BDT" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            
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
                <option value="DropShop">DropShop (BDSHOP)</option>
                <option value="Dropupseller">Dropupseller</option>
                <option value="DropshippingBD">DropshippingBD</option>
                <option value="Local Wholesale Market">Local Wholesale Market</option>
                <option value="Other Supplier">Other Supplier</option>
              </select>

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
            <button className="w-full bg-[#f57224] text-white font-bold py-2 rounded text-xs hover:bg-orange-600 transition shadow">Publish Product</button>
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

          {/* Active Categories and Subcategories Tree */}
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

        {/* Manage & Delete Products Section */}
        <div className="bg-white p-5 rounded-2xl shadow border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 text-sm">🗑️ Manage Products ({products.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {products.map((p) => (
              <div key={p.id} className="flex flex-col bg-gray-50 p-2 rounded border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate max-w-[140px] text-gray-700">{p.title}</span>
                  <button onClick={() => deleteProduct(p.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 text-[10px] rounded transition">Delete</button>
                </div>
                <div className="text-[10px] text-gray-500 flex flex-col gap-0.5">
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
