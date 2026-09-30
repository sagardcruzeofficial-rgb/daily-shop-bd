import React, { useContext, useState, useEffect, useRef } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function AdminView() {
  const { 
    products, addProduct, updateProduct, deleteProduct, 
    orders, deleteOrder, 
    footerLinks = [], addFooterLink, deleteFooterLink,
    categoryData = [], addCategory, deleteCategory, addSubCategory, deleteSubCategory,
    supplierList = [], addSupplierSource, deleteSupplierSource,
    chats = [], sendChatMessage, deleteChat 
  } = useContext(StoreContext);
  
  // Form States & Editing States
  const [editingProductId, setEditingProductId] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  
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

  // 💬 Live Chat Admin Selection State
  const [activeChatId, setActiveChatId] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Default Select Initialization
  useEffect(() => {
    if (categoryData.length > 0) {
      if (!selectedCat) setSelectedCat(categoryData[0].name);
      if (!targetCategoryForSub) setTargetCategoryForSub(categoryData[0].name);
    }
  }, [categoryData]);

  useEffect(() => {
    if (supplierList.length > 0 && !supplierName) {
      setSupplierName(supplierList[0]);
    }
  }, [supplierList]);

  // Select first chat by default if available
  useEffect(() => {
    if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, [chats]);

  const handleBarcodeChange = (val) => {
    setBarcode(val);
    setSku(val);
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
      setEditingProductId(existingProduct.id);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImage(reader.result); };
      reader.readAsDataURL(file);
    }
  };

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
      if (data.success && data.sizes) {
        setSizesInput(data.sizes.join(', '));
        alert(`সফলভাবে সাইজ পাওয়া গেছে: ${data.sizes.join(', ')}`);
      } else {
        alert('কোনো সাইজ পাওয়া যায়নি!');
      }
    } catch (err) {
      alert('সাপ্লায়ার সাইটে কানেক্ট করা যায়নি!');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddNewSupplier = () => {
    if (!newSupplierInput.trim()) return;
    addSupplierSource(newSupplierInput.trim());
    setSupplierName(newSupplierInput.trim());
    setNewSupplierInput('');
  };

  const handleDeleteSupplier = (supToDelete) => {
    if (supplierList.length <= 1) {
      alert('কমপক্ষে একটি সাপ্লায়ার থাকা বাধ্যতামূলক!');
      return;
    }
    deleteSupplierSource(supToDelete);
  };

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

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setTitle(''); setPrice(''); setSku(''); setBarcode(''); setImage(''); setDescription(''); setSupplierUrl(''); setSizesInput('M, L, XL, XXL');
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const parsedSizes = sizesInput ? sizesInput.split(',').map(s => s.trim()).filter(Boolean) : ['Standard'];
    const productData = { 
      title, price: Number(price), sku: sku.trim() || 'N/A', barcode: barcode.trim() || sku.trim() || 'N/A',
      image, category: selectedCat || 'Fashion', subCategory: selectedSubCat, description, sizes: parsedSizes,
      supplierName: supplierName || 'DropShop', supplierUrl: supplierUrl.trim() 
    };

    if (editingProductId) {
      updateProduct(editingProductId, productData);
      alert('Product Updated Successfully!');
      setEditingProductId(null);
    } else {
      addProduct(productData);
      alert('Product Published Successfully!');
    }
    setTitle(''); setPrice(''); setSku(''); setBarcode(''); setImage(''); setDescription(''); setSupplierUrl('');
  };

  // Send Admin Reply to Customer Chat
  const handleSendAdminReply = (e) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !activeChatId) return;
    sendChatMessage(activeChatId, 'admin', adminReplyText.trim());
    setAdminReplyText('');
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8 font-sans">
      {/* Header Bar */}
      <div className="bg-gray-900 text-white p-6 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
        <div>
          <h2 className="text-2xl font-black text-orange-500">DailyShop BD - Master Admin Panel</h2>
          <p className="text-xs text-gray-400">Barcode Scanner, Live Visitor Chat Support & Inventory Control.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition">
            👁️ Visit Live Store
          </a>
        </div>
      </div>

      {/* 💬 LIVE CHAT SUPPORT CENTER FOR ADMIN (নতুন যুক্ত করা হলো) */}
      <div className="bg-white p-6 rounded-2xl shadow border border-purple-200 mb-8">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
            💬 Visitor Live Chat Support <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-mono">{chats.length} Active Chats</span>
          </h3>
        </div>

        {chats.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center">No visitor chat messages yet. When visitors chat from the website, they will appear here instantly.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px]">
            {/* Left: Chat Sessions List */}
            <div className="border rounded-xl overflow-y-auto bg-gray-50 p-2 space-y-2">
              {chats.map(chat => {
                const lastMsg = chat.messages[chat.messages.length - 1];
                return (
                  <div 
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`p-3 rounded-xl cursor-pointer transition border ${
                      activeChatId === chat.id ? 'bg-purple-600 text-white border-purple-700 shadow' : 'bg-white text-gray-800 border-gray-200 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs">{chat.customerName}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${activeChatId === chat.id ? 'text-white hover:bg-purple-700' : 'text-red-500 hover:bg-red-50'}`}
                      >
                        ✕
                      </button>
                    </div>
                    <p className={`text-[11px] truncate mt-1 ${activeChatId === chat.id ? 'text-purple-100' : 'text-gray-500'}`}>
                      {lastMsg ? `${lastMsg.sender === 'admin' ? 'You: ' : ''}${lastMsg.text}` : 'No messages'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Active Chat Conversation Box */}
            <div className="md:col-span-2 border rounded-xl flex flex-col bg-gray-50 overflow-hidden">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-white p-3 border-b flex justify-between items-center text-xs font-bold text-gray-800">
                    <span>Chatting with: <span className="text-purple-600">{activeChat.customerName}</span></span>
                    <span className="text-[10px] text-gray-400 font-mono">ID: {activeChat.id}</span>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {activeChat.messages.map((m, idx) => (
                      <div key={idx} className={`flex flex-col ${m.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                          m.sender === 'admin' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                        }`}>
                          <p>{m.text}</p>
                        </div>
                        <span className="text-[9px] text-gray-400 mt-0.5 px-1">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendAdminReply} className="p-3 bg-white border-t flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type your reply as Admin..." 
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="flex-1 border p-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow">
                      Send Reply 🚀
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-400">
                  Select a chat conversation from the left to reply.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* বাকি অর্ডার, প্রোডাক্ট এডিট ও অন্যান্য সেকশন আগের মতোই থাকবে */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Product Publishing / Barcode Form */}
        <div className="bg-white p-5 rounded-2xl shadow border">
          <h3 className="font-bold text-gray-800 text-sm mb-3">📷 Barcode Scan & Publish</h3>
          <form onSubmit={handleProductSubmit} className="space-y-3">
            <input type="text" placeholder="Scan Barcode / SKU" value={barcode} onChange={(e) => handleBarcodeChange(e.target.value)} className="w-full border p-2 text-xs rounded font-mono font-bold bg-purple-50" />
            <input type="text" placeholder="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            <div className="flex gap-2">
              <input type="number" placeholder="Price BDT" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-1/2 border p-2 text-xs rounded" />
              <input type="text" placeholder="SKU Code" value={sku} onChange={(e) => setSku(e.target.value)} className="w-1/2 border p-2 text-xs rounded font-mono font-bold" />
            </div>
            <input type="url" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border p-2 text-xs rounded" rows={3}></textarea>
            <button className="w-full bg-[#f57224] text-white font-bold py-2 rounded text-xs hover:bg-orange-600">Publish Product</button>
          </form>
        </div>

        {/* Manage Products Section */}
        <div className="bg-white p-5 rounded-2xl shadow border md:col-span-3">
          <h3 className="font-bold text-gray-800 mb-3 border-b pb-2 text-sm">📦 Manage Products ({products.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
            {products.map((p) => (
              <div key={p.id} className="bg-gray-50 p-3 rounded-xl border flex flex-col justify-between">
                <div>
                  <p className="font-bold text-xs text-gray-800">{p.title}</p>
                  <p className="text-[10px] text-orange-600 font-bold mt-1">৳{p.price}</p>
                  <p className="text-[10px] text-purple-700 font-mono">SKU: {p.sku}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEditClick(p)} className="flex-1 bg-blue-600 text-white text-[10px] py-1 rounded font-bold">Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="flex-1 bg-red-500 text-white text-[10px] py-1 rounded font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
