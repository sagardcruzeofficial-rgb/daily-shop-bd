import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Navbar() {
  const { cart, categories, setActiveTab, setIsAdminOpen } = useContext(StoreContext);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="md:hidden text-gray-700 text-xl"
          >
            ☰
          </button>
          <h1 
            onClick={() => setActiveTab('Home')} 
            className="text-2xl font-black text-blue-600 cursor-pointer tracking-tight"
          >
            DailyShop<span className="text-orange-500">BD</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-gray-600 font-medium text-sm">
          <button onClick={() => setActiveTab('Home')} className="hover:text-blue-600 transition">Home</button>
          <button onClick={() => setActiveTab('About Us')} className="hover:text-blue-600 transition">About Us</button>
          <button onClick={() => setActiveTab('Privacy Policy')} className="hover:text-blue-600 transition">Privacy Policy</button>
          <button onClick={() => setActiveTab('Contact Us')} className="hover:text-blue-600 transition">Contact Us</button>
        </nav>

        {/* Cart & Controls */}
        <div className="flex items-center space-x-5">
          <div className="relative cursor-pointer">
            <span className="text-2xl">🛍️</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsAdminOpen(true)} 
            className="text-gray-400 hover:text-blue-600 transition"
            title="Admin Panel"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Category Subbar */}
      <div className="bg-slate-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center relative">
          <button 
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 font-semibold flex items-center gap-2 transition"
          >
            <span>☰</span> All Categories
          </button>

          <div className="hidden md:flex items-center space-x-6 px-6 text-gray-300 font-medium">
            {categories.slice(0, 5).map((cat, i) => (
              <span key={i} className="hover:text-white cursor-pointer transition">{cat}</span>
            ))}
          </div>

          {/* Dropdown Menu */}
          {showCategoryMenu && (
            <div className="absolute top-full left-4 w-64 bg-white text-gray-800 shadow-2xl rounded-b-lg border border-gray-100 z-50 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {categories.map((cat, idx) => (
                  <li 
                    key={idx} 
                    className="px-5 py-3 hover:bg-blue-50 hover:text-blue-600 cursor-pointer font-medium flex justify-between items-center transition"
                  >
                    <span>{cat}</span>
                    <span className="text-gray-400 text-xs">›</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
