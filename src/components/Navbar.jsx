import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Navbar() {
  const { cart, categories, setActiveTab, setIsAdminOpen } = useContext(StoreContext);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [selectedCat, setSelectedCat] = useState('All');

  return (
    <header className="bg-[#131921] text-white sticky top-0 z-50 font-sans">
      {/* Top Search & Nav Bar */}
      <div className="max-w-[1500px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('Home')} 
          className="flex items-center gap-1 cursor-pointer border border-transparent hover:border-white p-1 rounded"
        >
          <span className="text-2xl font-black tracking-tight text-white">daily shop<span className="text-[#febd69]">.bd</span></span>
        </div>

        {/* Amazon-Style Search Bar */}
        <div className="flex-1 max-w-3xl hidden md:flex items-center rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#febd69]">
          <select 
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-[#f3f3f3] text-gray-700 text-xs px-3 py-2.5 border-r border-gray-300 outline-none cursor-pointer"
          >
            <option>All Categories</option>
            {categories.map((cat, i) => <option key={i}>{cat}</option>)}
          </select>

          <input 
            type="text" 
            placeholder="Search Daily Shop BD..." 
            className="w-full px-3 py-2 text-gray-800 text-sm outline-none"
          />

          <button className="bg-[#febd69] hover:bg-[#f3a847] px-5 py-2.5 text-gray-900 font-bold transition">
            🔍
          </button>
        </div>

        {/* Right Menu Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <button 
            onClick={() => setActiveTab('Home')} 
            className="hidden lg:block border border-transparent hover:border-white p-1.5 rounded leading-tight text-left"
          >
            <span className="text-xs text-gray-300 block">Hello, Welcome</span>
            <span className="font-bold">Home</span>
          </button>

          <button 
            onClick={() => setActiveTab('About Us')} 
            className="hidden lg:block border border-transparent hover:border-white p-1.5 rounded"
          >
            About Us
          </button>

          {/* Cart Icon */}
          <div className="flex items-center border border-transparent hover:border-white p-1.5 rounded cursor-pointer relative">
            <span className="text-3xl">🛒</span>
            <span className="text-[#febd69] font-extrabold text-base ml-1">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 left-4 bg-[#f08804] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </div>

          {/* Hidden Admin Access */}
          <button 
            onClick={() => setIsAdminOpen(true)} 
            className="text-gray-400 hover:text-[#febd69] text-xs p-1"
            title="Admin Access"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Secondary Bar (Vertical Menu Bar & Links) */}
      <div className="bg-[#232f3e] px-4 py-1.5 text-xs font-semibold flex items-center gap-6 relative">
        <button 
          onClick={() => setShowCategoryMenu(!showCategoryMenu)}
          className="flex items-center gap-2 border border-transparent hover:border-white px-2 py-1 rounded cursor-pointer font-bold text-sm text-[#febd69]"
        >
          <span>☰</span> All Categories
        </button>

        <div className="hidden md:flex items-center gap-6 text-gray-200">
          <button onClick={() => setActiveTab('Home')} className="hover:text-[#febd69]">Today's Deals</button>
          <button onClick={() => setActiveTab('Contact Us')} className="hover:text-[#febd69]">Customer Service</button>
          <button onClick={() => setActiveTab('Privacy Policy')} className="hover:text-[#febd69]">Privacy & Policy</button>
        </div>

        {/* Amazon Vertical Sidebar Dropdown */}
        {showCategoryMenu && (
          <div className="absolute top-full left-0 w-72 bg-white text-gray-900 shadow-2xl border-r border-b border-gray-300 z-50 text-sm font-medium">
            <div className="bg-[#232f3e] text-white px-4 py-3 font-bold text-base flex justify-between items-center">
              <span>Shop By Department</span>
              <button onClick={() => setShowCategoryMenu(false)} className="text-sm">✕</button>
            </div>
            <ul className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {categories.map((cat, idx) => (
                <li 
                  key={idx} 
                  className="px-5 py-3 hover:bg-gray-100 hover:text-[#e47911] cursor-pointer flex justify-between items-center transition"
                >
                  <span>{cat}</span>
                  <span className="text-gray-400 text-xs">›</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
