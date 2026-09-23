import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function AdminView() {
  const { isAdminOpen, setIsAdminOpen, addProduct, addCategory } = useContext(StoreContext);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [newCatName, setNewCatName] = useState('');

  if (!isAdminOpen) return null;

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    addProduct({ title, price: Number(price), image, category, description, sizes: ['M', 'L', 'XL'] });
    setTitle(''); setPrice(''); setImage(''); setDescription('');
    alert('Product Published!');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    addCategory(newCatName);
    setNewCatName('');
    alert('New Vertical Category Added!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={() => setIsAdminOpen(false)} className="absolute top-4 right-4 text-xl font-bold">✕</button>
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Blogger-Style Admin Control Panel</h2>

        {/* Add Category Section */}
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Add New Vertical Category</h3>
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Category Name" 
              value={newCatName} 
              onChange={(e) => setNewCatName(e.target.value)} 
              className="border p-2 rounded flex-1"
              required 
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded">Add Category</button>
          </form>
        </div>

        {/* Add Product Section */}
        <form onSubmit={handleSubmitProduct} className="space-y-3">
          <h3 className="font-semibold">Publish New Product</h3>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="number" placeholder="Price (BDT)" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded" required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" required />
          <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">Publish Product</button>
        </form>
      </div>
    </div>
  );
}
