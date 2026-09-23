import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Navbar() {
  const { cart, categories, setActiveTab, setIsAdminOpen, selectedCategory, setSelectedCategory } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="bg-white text-gray-800 sticky top-0 z-50 shadow-md font-sans">
      {/* Top Mini Bar */}
      <div className="bg-[#f5f5f5] text-[11px] text-gray-600 border-b border-gray-200 py-1">
        <div className="max-w-[1300px] mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('Home')} className="hover:text-[#f57224]">SAVE MORE ON APP</button>
            <button onClick={() => setActiveTab('Contact Us')} className="hover:text-[#f57224]">HELP & SUPPORT</button>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('About Us')} className="hover:text-[#f57224]">ABOUT US</button>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-[#f57224] flex items-center gap-1 font-semibold">
              ⚙️ ADMIN
            </button>
          </div>
        </div>
      </div>

      {/* Main Daraz Header Bar */}
      <div className="bg-white py-3 border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-4 flex items-center justify-between gap-6">
          
          {/* Daraz Style Logo */}
          <div 
            onClick={() => setActiveTab('Home')} 
            className="cursor-pointer flex items-center gap-1"
          >
            <span className="text-3xl font-black text-[#f57224] tracking-tight">daily shop<span className="text-gray-800">.bd</span></span>
          </div>

          {/* Daraz Search Bar */}
          <div className="flex-1 max-w-2xl flex items-center rounded-lg overflow-hidden border-2 border-[#f57224] bg-gray-50">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in Daily Shop BD..." 
              className="w-full px-4 py-2 text-gray-800 text-sm outline-none bg-transparent"
            />
            <button className="bg-[#f57224] hover:bg-[#d95f19] px-6 py-2.5 text-white font-bold transition">
              🔍
            </button>
          </div>

          {/* Cart Section */}
          <div 
            onClick={() => setActiveTab('Home')} 
            className="flex items-center gap-2 cursor-pointer bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg border border-orange-200 transition relative"
          >
            <span className="text-2xl">🛒</span>
            <div className="text-left">
              <span className="text-[10px] text-gray-500 block leading-none">Your Cart</span>
              <span className="font-bold text-[#f57224] text-sm">{cart.length} Items</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
