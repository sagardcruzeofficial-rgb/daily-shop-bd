import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Package, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminView() {
  const { products, addProduct, editProduct, deleteProduct, orders } = useStore();

  const [form, setForm] = useState({
    id: null,
    title: '',
    price: '',
    cost: '',
    category: 'Fashion',
    image: '',
    description: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.image) {
      alert('দয়া করে সকল প্রয়োজনীয় তথ্য প্রদান করুন।');
      return;
    }

    if (isEditing) {
      editProduct(form);
      setIsEditing(false);
    } else {
      addProduct(form);
    }

    setForm({ id: null, title: '', price: '', cost: '', category: 'Fashion', image: '', description: '' });
  };

  const handleEditClick = (product) => {
    setForm(product);
    setIsEditing(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-lg shadow">
        <div>
          <h1 className="text-2xl font-bold text-amber-400">Admin Control Panel</h1>
          <p className="text-xs text-gray-400 mt-1">Manage your products, view orders & monitor shop analytics</p>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Total Sales</p>
            <p className="text-2xl font-extrabold text-gray-900">৳ {totalSales}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Total Orders</p>
            <p className="text-2xl font-extrabold text-gray-900">{totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Active Products</p>
            <p className="text-2xl font-extrabold text-gray-900">{products.length}</p>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Form */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          {isEditing ? <Edit2 className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-amber-500" />}
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border p-2 rounded text-sm outline-none focus:border-amber-500"
              placeholder="e.g. Mens Casual Shirt"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border p-2 rounded text-sm outline-none focus:border-amber-500"
            >
              <option value="Fashion">Fashion</option>
              <option value="Electronics">Electronics</option>
              <option value="Gadgets">Gadgets</option>
              <option value="Daily Deals">Daily Deals</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Selling Price (BDT) *</label>
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border p-2 rounded text-sm outline-none focus:border-amber-500"
              placeholder="1200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Buying Cost (BDT)</label>
            <input
              type="number"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              className="w-full border p-2 rounded text-sm outline-none focus:border-amber-500"
              placeholder="800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL *</label>
            <input
              type="url"
              required
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full border p-2 rounded text-sm outline-none focus:border-amber-500"
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea
              rows="2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border p-2 rounded text-sm outline-none focus:border-amber-500"
              placeholder="Short product description..."
            ></textarea>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-6 py-2 rounded transition text-sm"
            >
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setForm({ id: null, title: '', price: '', cost: '', category: 'Fashion', image: '', description: '' });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded transition text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <h2 className="text-lg font-bold text-gray-800 p-4 border-b">Manage Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Cost</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded" />
                    <span className="font-semibold text-gray-800 line-clamp-1">{item.title}</span>
                  </td>
                  <td className="p-3 text-gray-600">{item.category}</td>
                  <td className="p-3 font-bold text-gray-900">৳ {item.price}</td>
                  <td className="p-3 text-gray-500">৳ {item.cost || 0}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(item.id)}
                      className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
