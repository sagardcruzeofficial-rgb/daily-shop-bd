import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Navbar() {
  const { cart, activeTab, setActiveTab, setViewMode, viewMode } = useContext(StoreContext);

  return (
    <header className="bg-white sticky top-0 z-40 shadow-md font-sans">
      {/* Top Banner Bar */}
      <div className="bg-[#111827] text-gray-300 text-xs py-1.5 px-4 flex justify-between items-center">
        <span>🔥 Welcome to DailyShop BD - Fast Delivery Across Bangladesh!</span>
        <button 
          onClick={() => setViewMode(viewMode === 'visitor' ? 'admin' : 'visitor')}
          className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold px-2.5 py-0.5 rounded transition"
        >
          {viewMode === 'visitor' ? 'Switch to Admin Panel' : 'Switch to Visitor View'}
        </button>
      </div>

      {/* Main Header */}
      <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Logo and Name */}
        <div 
          onClick={() => { setActiveTab('Home'); setViewMode('visitor'); }} 
          className="cursor-pointer flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-[#f57224] rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-lg border border-orange-400">
            D
          </div>
          <span className="text-2xl font-black text-[#f57224] tracking-tight">
            DailyShop<span className="text-gray-900">.bd</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:flex items-center rounded-lg overflow-hidden border-2 border-[#f57224] bg-gray-50 shadow-inner">
          <input 
            type="text" 
            placeholder="Search in DailyShop BD..." 
            className="w-full px-4 py-2 text-gray-800 text-sm outline-none bg-transparent"
          />
          <button className="bg-[#f57224] hover:bg-orange-600 px-5 py-2.5 text-white font-bold transition">
            🔍
          </button>
        </div>

        {/* Main Menu Links & Cart */}
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-700">
          <nav className="hidden lg:flex gap-5">
            <button onClick={() => setActiveTab('Home')} className={`hover:text-[#f57224] ${activeTab === 'Home' && 'text-[#f57224]'}`}>Home</button>
            <button onClick={() => setActiveTab('About Us')} className={`hover:text-[#f57224] ${activeTab === 'About Us' && 'text-[#f57224]'}`}>About Us</button>
            <button onClick={() => setActiveTab('Privacy Policy')} className={`hover:text-[#f57224] ${activeTab === 'Privacy Policy' && 'text-[#f57224]'}`}>Privacy Policy</button>
            <button onClick={() => setActiveTab('Contact Us')} className={`hover:text-[#f57224] ${activeTab === 'Contact Us' && 'text-[#f57224]'}`}>Contact Us</button>
          </nav>

          {/* Cart Icon */}
          <div 
            onClick={() => setActiveTab('Home')} 
            className="relative cursor-pointer bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-lg flex items-center gap-2"
          >
            <span className="text-2xl">🛒</span>
            <span className="bg-[#f57224] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
