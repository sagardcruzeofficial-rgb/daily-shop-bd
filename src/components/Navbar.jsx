import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Navbar() {
  const { cart, categories, setActiveTab, setIsAdminOpen } = useContext(StoreContext);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 
          onClick={() => setActiveTab('Home')} 
          className="text-2xl font-bold text-blue-600 cursor-pointer"
        >
          Daily Shop BD
        </h1>

        {/* Main Navigation Menu */}
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <button onClick={() => setActiveTab('Home')} className="hover:text-blue-600">Home</button>
          <button onClick={() => setActiveTab('About Us')} className="hover:text-blue-600">About Us</button>
          <button onClick={() => setActiveTab('Privacy Policy')} className="hover:text-blue-600">Privacy Policy</button>
          <button onClick={() => setActiveTab('Contact Us')} className="hover:text-blue-600">Contact Us</button>
        </nav>

        {/* Cart & Hidden Admin Action */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <span className="text-xl">🛒</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </div>
          {/* Secret Admin Button for Master Control */}
          <button 
            onClick={() => setIsAdminOpen(true)} 
            className="text-xs text-gray-300 hover:text-gray-500"
            title="Secret Admin Access"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Vertical Category Bar */}
      <div className="bg-gray-100 border-t border-b">
        <div className="max-w-7xl mx-auto px-4 relative">
          <button 
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="bg-blue-600 text-white px-4 py-2 font-medium flex items-center gap-2"
          >
            ☰ All Categories
          </button>

          {/* Vertical Sub-menu Overlay */}
          {showCategoryMenu && (
            <div className="absolute top-full left-4 w-64 bg-white shadow-xl border z-50 rounded-b-md">
              <ul className="py-2">
                {categories.map((cat, idx) => (
                  <li 
                    key={idx} 
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer font-medium text-gray-700 flex justify-between"
                  >
                    <span>{cat}</span>
                    <span className="text-gray-400">›</span>
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
