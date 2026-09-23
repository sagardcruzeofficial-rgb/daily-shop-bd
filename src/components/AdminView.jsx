import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function AdminView() {
  const { products, addProduct, deleteProduct, setViewMode } = useContext(StoreContext);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({
      title,
      price: Number(price),
      image,
      category,
      description,
      sizes: ['M', 'L', 'XL']
    });
    setTitle(''); setPrice(''); setImage(''); setDescription('');
    alert('Product Published Successfully!');
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow border">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Admin Control Panel</h2>
          <p className="text-xs text-gray-500">Manage, add or delete products on your website</p>
        </div>
        <button 
          onClick={() => setViewMode('visitor')} 
          className="bg-[#f57224] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition"
        >
          ← Back to Visitor View
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Publish New Product</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600">Product Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border p-2 text-xs rounded mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">Price (BDT)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full border p-2 text-xs rounded mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">Image URL</label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required className="w-full border p-2 text-xs rounded mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 text-xs rounded mt-1">
                <option>Fashion</option>
                <option>Electronics</option>
                <option>Gadgets</option>
                <option>Home & Living</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border p-2 text-xs rounded mt-1" rows={3}></textarea>
            </div>
            <button className="w-full bg-[#f57224] text-white font-bold py-2.5 rounded-lg text-xs hover:bg-orange-600 transition shadow">
              Publish Product
            </button>
          </form>
        </div>

        {/* Existing Product List with Delete Action */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Active Products ({products.length})</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.title} className="w-12 h-12 object-contain rounded bg-white p-1" />
                  <div>
                    <h4 className="font-bold text-xs text-gray-800 line-clamp-1">{p.title}</h4>
                    <span className="text-[10px] text-gray-500">৳{p.price} | {p.category}</span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
