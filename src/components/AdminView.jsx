import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function AdminView() {
  const { products, addProduct, deleteProduct, orders, deleteOrder, footerLinks, addFooterLink, deleteFooterLink } = useContext(StoreContext);
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [description, setDescription] = useState('');

  const [footerTitle, setFooterTitle] = useState('');
  const [footerUrl, setFooterUrl] = useState('');

  const handleProductSubmit = (e) => {
    e.preventDefault();
    addProduct({ title, price: Number(price), image, category, description, sizes: ['M', 'L', 'XL'] });
    setTitle(''); setPrice(''); setImage(''); setDescription('');
    alert('Product Published!');
  };

  const handleFooterSubmit = (e) => {
    e.preventDefault();
    addFooterLink({ title: footerTitle, url: footerUrl });
    setFooterTitle(''); setFooterUrl('');
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8 font-sans">
      {/* Header Bar */}
      <div className="bg-gray-900 text-white p-6 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-center shadow-lg gap-4">
        <div>
          <h2 className="text-2xl font-black text-orange-500">DailyShop BD - Master Admin Panel</h2>
          <p className="text-xs text-gray-400">Control products, view customer orders & edit website footer sections.</p>
        </div>
        
        {/* Live Site Link & Exit Options */}
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

      {/* 1. Customer Orders Section */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 mb-8">
        <h3 className="font-bold text-gray-800 text-base mb-4 border-b pb-2 flex items-center justify-between">
          <span>📦 Customer Website Orders ({orders.length})</span>
        </h3>

        {orders.length === 0 ? (
          <p className="text-xs text-gray-400 py-4">No orders received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Address</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border text-gray-500">{ord.date}</td>
                    <td className="p-2 border font-bold text-gray-800">{ord.productTitle} ({ord.size})</td>
                    <td className="p-2 border font-bold text-orange-600">৳{ord.price}</td>
                    <td className="p-2 border font-semibold">{ord.customerName}</td>
                    <td className="p-2 border text-blue-600">{ord.phone}</td>
                    <td className="p-2 border max-w-xs">{ord.address}</td>
                    <td className="p-2 border">
                      <button onClick={() => deleteOrder(ord.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-[10px] transition">Clear</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Add Product & Footer Link Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">➕ Publish New Product</h3>
          <form onSubmit={handleProductSubmit} className="space-y-3">
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            <input type="number" placeholder="Price BDT" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 text-xs rounded">
              <option>Fashion</option>
              <option>Electronics</option>
              <option>Gadgets</option>
            </select>
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border p-2 text-xs rounded" rows={3}></textarea>
            <button className="w-full bg-[#f57224] text-white font-bold py-2 rounded text-xs hover:bg-orange-600 transition">Publish Product</button>
          </form>
        </div>

        {/* Dynamic Footer Link Manager */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">⚙️ Dynamic Footer Manager</h3>
          <form onSubmit={handleFooterSubmit} className="space-y-3 mb-4">
            <input type="text" placeholder="Footer Link Name" value={footerTitle} onChange={(e) => setFooterTitle(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            <input type="text" placeholder="URL Target" value={footerUrl} onChange={(e) => setFooterUrl(e.target.value)} required className="w-full border p-2 text-xs rounded" />
            <button className="w-full bg-gray-800 text-white font-bold py-2 rounded text-xs hover:bg-black transition">Add Footer Link</button>
          </form>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-600">Active Footer Links:</h4>
            {footerLinks.map((fl) => (
              <div key={fl.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border text-xs">
                <span>{fl.title}</span>
                <button onClick={() => deleteFooterLink(fl.id)} className="text-red-500 font-bold hover:text-red-700">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Products Delete Section */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">🗑️ Delete Products</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                <span className="text-xs font-bold truncate max-w-[180px]">{p.title}</span>
                <button onClick={() => deleteProduct(p.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-[10px] rounded transition">Delete</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
