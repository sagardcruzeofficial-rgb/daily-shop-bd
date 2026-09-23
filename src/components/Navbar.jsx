import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Navbar() {
  const { cart, activeTab, setActiveTab } = useContext(StoreContext);

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100 font-sans">
      {/* Top Banner Bar */}
      <div className="bg-[#111827] text-gray-300 text-[11px] py-1.5 px-6 flex justify-between items-center">
        <span>🔥 Welcome to DailyShop BD - Official Online Store</span>
        <div className="flex gap-4 text-gray-400">
          <button onClick={() => setActiveTab('About Us')} className="hover:text-white">Help Center</button>
          <button onClick={() => setActiveTab('Contact Us')} className="hover:text-white">Contact</button>
        </div>
      </div>

      {/* Main Header with perfect spacing */}
      <div className="max-w-[1300px] mx-auto px-6 py-3 flex items-center justify-between gap-6">
        
        {/* Top Left: Logo & Name */}
        <div 
          onClick={() => setActiveTab('Home')} 
          className="cursor-pointer flex items-center gap-2.5"
        >
          <div className="w-10 h-10 bg-[#f57224] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/30">
            D
          </div>
          <span className="text-2xl font-black text-[#f57224] tracking-tight">
            DailyShop<span className="text-gray-900">.bd</span>
          </span>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl hidden md:flex items-center rounded-lg overflow-hidden border-2 border-[#f57224] bg-gray-50">
          <input 
            type="text" 
            placeholder="Search products in DailyShop BD..." 
            className="w-full px-4 py-2 text-gray-800 text-xs outline-none bg-transparent"
          />
          <button className="bg-[#f57224] hover:bg-orange-600 px-5 py-2 text-white font-bold transition">
            🔍
          </button>
        </div>

        {/* Top Right: Cart Icon & Navigation */}
        <div className="flex items-center gap-6 text-xs font-semibold text-gray-700">
          <nav className="hidden lg:flex gap-5">
            <button onClick={() => setActiveTab('Home')} className={`hover:text-[#f57224] ${activeTab === 'Home' && 'text-[#f57224] font-bold'}`}>Home</button>
            <button onClick={() => setActiveTab('About Us')} className={`hover:text-[#f57224] ${activeTab === 'About Us' && 'text-[#f57224] font-bold'}`}>About Us</button>
            <button onClick={() => setActiveTab('Privacy Policy')} className={`hover:text-[#f57224] ${activeTab === 'Privacy Policy' && 'text-[#f57224] font-bold'}`}>Privacy Policy</button>
            <button onClick={() => setActiveTab('Contact Us')} className={`hover:text-[#f57224] ${activeTab === 'Contact Us' && 'text-[#f57224] font-bold'}`}>Contact Us</button>
          </nav>

          {/* Cart Widget Top Right */}
          <div 
            onClick={() => setActiveTab('Home')} 
            className="cursor-pointer bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-orange-100 transition"
          >
            <span className="text-xl">🛒</span>
            <span className="bg-[#f57224] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
