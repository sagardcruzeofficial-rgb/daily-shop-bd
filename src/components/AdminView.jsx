import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function AdminView() {
  const { 
    products, 
    addProduct, 
    deleteProduct, 
    orders, 
    deleteOrder, 
    footerLinks, 
    addFooterLink, 
    deleteFooterLink,
    categories,
    categoryData,
    addCategory,
    deleteCategory,
    addSubCategory,
    deleteSubCategory,
    supplierList,
    addSupplierSource,
    deleteSupplierSource
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState('Products');

  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productCategory, setProductCategory] = useState(categories[0] || 'Fashion');
  const [productSubCategory, setProductSubCategory] = useState('All');
  const [productSupplier, setProductSupplier] = useState(supplierList[0] || 'Daraz');
  const [supplierUrl, setSupplierUrl] = useState('');
  
  const [autoPostFB, setAutoPostFB] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const postToFacebookPage = async (productData) => {
    try {
      const response = await fetch('/api/post-facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Facebook post failed');
      return true;
    } catch (error) {
      console.error('Facebook posting error:', error);
      return false;
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !productPrice || !productImage) {
      alert("দয়া করে প্রয়োজনীয় ফিল্ডগুলো পূরণ করুন!");
      return;
    }

    setIsUploading(true);

    const newProductData = {
      name: productName,
      price: Number(productPrice),
      description: productDesc,
      image: productImage,
      category: productCategory,
      subCategory: productSubCategory,
      supplierName: productSupplier,
      supplierUrl: supplierUrl
    };

    try {
      await addProduct(newProductData);

      if (autoPostFB) {
        const posted = await postToFacebookPage(newProductData);
        alert(posted
          ? "প্রোডাক্ট সফলভাবে অ্যাড হয়েছে এবং ফেসবুক পেজেও পোস্ট করা হয়েছে! 🎉"
          : "প্রোডাক্ট অ্যাড হয়েছে, কিন্তু Facebook পোস্ট করা যায়নি। Server environment variables চেক করুন।");
      } else {
        alert("প্রোডাক্ট সফলভাবে অ্যাড হয়েছে!");
      }

      setProductName('');
      setProductPrice('');
      setProductDesc('');
      setProductImage('');
      setSupplierUrl('');
    } catch (error) {
      console.error("Error adding product:", error);
      alert("প্রোডাক্ট যোগ করতে সমস্যা হয়েছে।");
    } finally {
      setIsUploading(false);
    }
  };

  const currentCatObj = categoryData.find(c => c.name === productCategory);
  const subCategoriesList = currentCatObj ? currentCatObj.subCategories || [] : [];

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-3 mb-6 bg-white dark:bg-gray-900 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-sm">
        <button
          onClick={() => setActiveAdminTab('Products')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeAdminTab === 'Products'
              ? 'bg-[#f57224] text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          📦 Manage Products & Facebook Post
        </button>
        <button
          onClick={() => setActiveAdminTab('Orders')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeAdminTab === 'Orders'
              ? 'bg-[#f57224] text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          🛒 View Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('Categories')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeAdminTab === 'Categories'
              ? 'bg-[#f57224] text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          🏷️ Manage Categories
        </button>
      </div>

      {activeAdminTab === 'Products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-lg">
            <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-4 border-b-2 border-gray-100 dark:border-gray-800 pb-3">
              ➕ নতুন প্রোডাক্ট যোগ করুন
            </h2>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">প্রোডাক্টের নাম</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="নাম লিখুন..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:border-[#f57224] text-gray-800 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">দাম (টাকা)</label>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="যেমন: ৫০০"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:border-[#f57224] text-gray-800 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">ছবির লিংক (Image URL)</label>
                <input
                  type="url"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:border-[#f57224] text-gray-800 dark:text-gray-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">ক্যাটাগরি</label>
                  <select
                    value={productCategory}
                    onChange={(e) => {
                      setProductCategory(e.target.value);
                      setProductSubCategory('All');
                    }}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium focus:outline-none focus:border-[#f57224] text-gray-800 dark:text-gray-100"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">সাব-ক্যাটাগরি</label>
                  <select
                    value={productSubCategory}
                    onChange={(e) => setProductSubCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium focus:outline-none focus:border-[#f57224] text-gray-800 dark:text-gray-100"
                  >
                    <option value="All">All Sub-categories</option>
                    {subCategoriesList.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1">বিবরণ</label>
                <textarea
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="প্রোডাক্টের বিবরণ..."
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:border-[#f57224] text-gray-800 dark:text-gray-100"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-gray-800/80 rounded-xl border-2 border-orange-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  id="autoPostFB"
                  checked={autoPostFB}
                  onChange={(e) => setAutoPostFB(e.target.checked)}
                  className="w-4 h-4 accent-[#f57224] cursor-pointer"
                />
                <label htmlFor="autoPostFB" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
                  🚀 এক ক্লিকে ফেসবুক পেজেও পোস্ট করুন
                </label>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 font-bold text-white bg-[#f57224] hover:bg-orange-600 rounded-xl border-2 border-orange-600 transition text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                {isUploading ? 'আপলোড ও পোস্ট হচ্ছে...' : 'প্রোডাক্ট আপলোড করুন'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-lg">
            <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-4 border-b-2 border-gray-100 dark:border-gray-800 pb-3">
              📋 প্রজেক্টের সব প্রোডাক্ট ({products.length})
            </h2>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
              {products.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">কোনো প্রোডাক্ট নেই।</p>
              ) : (
                products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg border" />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{p.name}</h4>
                        <p className="text-xs text-[#f57224] font-bold">৳{p.price} | {p.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm("আপনি কি এই প্রোডাক্টটি ডিলিট করতে চান?")) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'Orders' && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-lg">
          <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-4 border-b-2 border-gray-100 dark:border-gray-800 pb-3">
            🛒 কাস্টমার অর্ডারসমূহ ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-10">কোনো অর্ডার পাওয়া যায়নি।</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">নাম: {order.customerName}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">ফোন: {order.phone} | ঠিকানা: {order.address}</p>
                    <p className="text-xs text-orange-600 font-bold mt-1">মোট দাম: ৳{order.totalAmount} ({order.date})</p>
                  </div>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Clear Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeAdminTab === 'Categories' && (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-lg">
          <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-4 border-b-2 border-gray-100 dark:border-gray-800 pb-3">
            🏷️ ক্যাটাগরি ও সাব-ক্যাটাগরি ম্যানেজমেন্ট
          </h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                id="newCatInput"
                placeholder="নতুন ক্যাটাগরির নাম..."
                className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:outline-none focus:border-[#f57224] text-gray-800 dark:text-gray-100"
              />
              <button
                onClick={() => {
                  const val = document.getElementById('newCatInput').value;
                  if (val) {
                    addCategory(val);
                    document.getElementById('newCatInput').value = '';
                  }
                }}
                className="bg-[#f57224] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{cat.name}</h3>
                    <button
                      onClick={() => deleteCategory(cat.name)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(cat.subCategories || []).map((sub) => (
                      <span key={sub} className="bg-orange-100 dark:bg-gray-700 text-orange-800 dark:text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        {sub}
                        <button onClick={() => deleteSubCategory(cat.name, sub)} className="hover:text-red-600">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-3">
                    <input
                      type="text"
                      placeholder="Sub-category..."
                      id={`sub_${cat.name}`}
                      className="w-full px-2 py-1 bg-white dark:bg-gray-900 border text-xs rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`sub_${cat.name}`);
                        if (input.value) {
                          addSubCategory(cat.name, input.value);
                          input.value = '';
                        }
                      }}
                      className="bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 rounded-lg text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
