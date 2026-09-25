import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import CartModal from './CartModal';

export default function Navbar() {
  const { cart, activeTab, setActiveTab, searchQuery, setSearchQuery } = useContext(StoreContext);
  const { currentUser, logout, loading: authLoading } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (activeTab !== 'Home') {
      setActiveTab('Home');
    }
  };

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <>
      <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100 font-sans">
        {/* Top Banner Bar */}
        <div className="bg-[#111827] text-gray-300 text-[11px] py-1.5 px-6 flex justify-between items-center">
          <span>🔥 Welcome to DailyShopBD - Official Online Store</span>
          <div className="flex gap-4 text-gray-400">
            <button onClick={() => setActiveTab('About Us')} className="hover:text-white">Help Center</button>
            <button onClick={() => setActiveTab('Contact Us')} className="hover:text-white">Contact</button>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-[1300px] mx-auto px-6 py-3 flex items-center justify-between gap-6">
          
          {/* Top Left: Logo & Name (DailyShopBD) */}
          <div 
            onClick={() => {
              setActiveTab('Home');
              setSearchQuery('');
            }} 
            className="cursor-pointer flex items-center gap-2.5 select-none"
          >
            <div className="w-10 h-10 bg-[#f57224] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/30">
              D
            </div>
            <span className="text-2xl font-black text-[#f57224] tracking-tight">
              DailyShop<span className="text-gray-900">BD</span>
            </span>
          </div>

          {/* Center: Real-time Search Bar */}
          <div className="flex-1 max-w-xl hidden md:flex items-center rounded-lg overflow-hidden border-2 border-[#f57224] bg-gray-50 focus-within:bg-white">
            <input 
              type="text" 
              placeholder="Search products in DailyShopBD..." 
              value={searchQuery || ''}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 text-gray-800 text-xs outline-none bg-transparent"
            />
            <button 
              onClick={() => setActiveTab('Home')}
              className="bg-[#f57224] hover:bg-orange-600 px-5 py-2 text-white font-bold transition"
            >
              🔍
            </button>
          </div>

          {/* Top Right: Navigation, Cart & Auth */}
          <div className="flex items-center gap-5 text-xs font-semibold text-gray-700">
            <nav className="hidden lg:flex gap-4 items-center">
              <button onClick={() => setActiveTab('Home')} className={`hover:text-[#f57224] ${activeTab === 'Home' && 'text-[#f57224] font-bold'}`}>Home</button>
              <button onClick={() => setActiveTab('About Us')} className={`hover:text-[#f57224] ${activeTab === 'About Us' && 'text-[#f57224] font-bold'}`}>About Us</button>
              <button onClick={() => setActiveTab('Privacy Policy')} className={`hover:text-[#f57224] ${activeTab === 'Privacy Policy' && 'text-[#f57224] font-bold'}`}>Privacy Policy</button>
              <button onClick={() => setActiveTab('Contact Us')} className={`hover:text-[#f57224] ${activeTab === 'Contact Us' && 'text-[#f57224] font-bold'}`}>Contact Us</button>
            </nav>

            {/* Auth Section with Loading Guard */}
            {!authLoading && (
              currentUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-gray-800 font-bold hidden xl:inline">
                    👤 {currentUser.displayName || currentUser.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveTab('Login')} 
                    className="text-[#f57224] border border-[#f57224] px-3 py-1.5 rounded-lg hover:bg-orange-50 transition"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setActiveTab('Register')} 
                    className="bg-[#f57224] text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition"
                  >
                    Register
                  </button>
                </div>
              )
            )}

            {/* Cart Widget Click opens Slide-over Modal */}
            <div 
              onClick={() => setIsCartOpen(true)} 
              className="cursor-pointer bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-orange-100 transition"
            >
              <span className="text-xl">🛒</span>
              <span className="bg-[#f57224] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Only Visible on Small Screens) */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center rounded-lg overflow-hidden border-2 border-[#f57224] bg-gray-50">
            <input 
              type="text" 
              placeholder="Search products in DailyShopBD..." 
              value={searchQuery || ''}
              onChange={handleSearchChange}
              className="w-full px-3 py-1.5 text-gray-800 text-xs outline-none bg-transparent"
            />
            <button 
              onClick={() => setActiveTab('Home')}
              className="bg-[#f57224] px-4 py-1.5 text-white font-bold text-xs"
            >
              🔍
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer Component */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
