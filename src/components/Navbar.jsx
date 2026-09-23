import React from 'react';
import { ShoppingCart, Search, UserCheck, Store, Menu } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Navbar({ onOpenCart }) {
  const { cart, viewMode, setViewMode } = useStore();

  const handleAdminAccess = () => {
    if (viewMode === 'admin') {
      setViewMode('store');
    } else {
      const password = prompt('এডমিন প্যানেলে ঢুকতে সিক্রেট পাসওয়ার্ড দিন:');
      if (password === '1234') { // আপনার পছন্দমতো পাসওয়ার্ড দিতে পারেন
        setViewMode('admin');
      } else if (password !== null) {
        alert('ভুল পাসওয়ার্ড!');
      }
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Main Navigation Bar */}
      <div className="bg-gray-900 text-white px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewMode('store')}>
          <div className="bg-amber-500 text-gray-900 font-black text-xl px-2 py-0.5 rounded tracking-wider">
            DAILY
          </div>
          <span className="font-bold text-lg hidden sm:inline text-gray-100">Shop BD</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl flex items-center bg-white rounded-md overflow-hidden text-gray-800">
          <input 
            type="text" 
            placeholder="Search products in Daily Shop BD..." 
            className="w-full px-4 py-2 text-sm outline-none"
          />
          <button className="bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-gray-900 font-bold transition">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 text-sm font-semibold">
          
          {/* Protected Admin Switcher */}
          <button 
            onClick={handleAdminAccess}
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded border border-gray-700 text-amber-400 transition"
          >
            {viewMode === 'store' ? (
              <>
                <UserCheck className="w-4 h-4" />
                <span className="hidden md:inline">Admin Panel</span>
              </>
            ) : (
              <>
                <Store className="w-4 h-4" />
                <span className="hidden md:inline">Visitor Store</span>
              </>
            )}
          </button>

          {/* Cart Icon & Count */}
          <button 
            onClick={onOpenCart} 
            className="relative flex items-center gap-1 hover:text-amber-400 transition"
          >
            <div className="relative">
              <ShoppingCart className="w-7 h-7" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-500 text-gray-900 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="hidden sm:inline mt-2">Cart</span>
          </button>
        </div>
      </div>

      {/* Sub Header */}
      <div className="bg-gray-800 text-white text-xs px-4 py-2 flex items-center gap-6 overflow-x-auto whitespace-nowrap">
        <button className="flex items-center gap-1 font-bold hover:text-amber-400">
          <Menu className="w-4 h-4" /> All Categories
        </button>
        <span className="cursor-pointer hover:text-amber-400">Fashion</span>
        <span className="cursor-pointer hover:text-amber-400">Electronics</span>
        <span className="cursor-pointer hover:text-amber-400">Gadgets</span>
        <span className="cursor-pointer hover:text-amber-400">Daily Deals</span>
        <span className="cursor-pointer hover:text-amber-400 text-amber-400">Customer Support</span>
      </div>
    </header>
  );
}
