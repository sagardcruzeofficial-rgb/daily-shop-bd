import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import CartModal from './CartModal';

export default function Navbar() {
  const { cart, activeTab, setActiveTab, searchQuery, setSearchQuery } = useContext(StoreContext);
  const { currentUser, logout, loading: authLoading } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

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
      <header className="sticky top-0 z-40 border-b border-white/70 dark:border-slate-700/70 bg-white/70 dark:bg-slate-950/75 backdrop-blur-2xl shadow-[0_12px_35px_rgba(30,41,59,0.12)] font-sans transition-colors duration-300">
        {/* Top Banner Bar */}
        <div className="bg-slate-950/95 text-slate-300 text-[10px] py-1.5 px-3 sm:px-6 flex justify-between items-center border-b border-white/10">
          <marquee>
            <span>🔥 Welcome to DailyShopBD - Official Online Store &bull; Premium Quality Guaranteed</span>
          </marquee>
          <div className="flex gap-4 text-gray-400 font-semibold">
            <button onClick={() => setActiveTab('About Us')} className="hover:text-white transition">Help Center</button>
            <button onClick={() => setActiveTab('Contact Us')} className="hover:text-white transition">Contact</button>
          </div>
        </div>

        {/* Main Header */}
        <div className="w-full px-3 sm:px-5 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-5">
          
          {/* Updated Logo Design */}
          <div 
            onClick={() => {
              setActiveTab('Home');
              setSearchQuery('');
            }} 
            className="crystal-surface cursor-pointer flex items-center gap-3 select-none group rounded-2xl border-2 border-white/90 px-3 py-2 shadow-[0_8px_0_rgba(203,213,225,.75),0_14px_28px_rgba(15,23,42,.16),inset_0_1px_0_rgba(255,255,255,.95)] dark:border-slate-600 dark:shadow-[0_8px_0_rgba(15,23,42,.9),0_14px_28px_rgba(0,0,0,.35),inset_0_1px_0_rgba(255,255,255,.12)]"
          >
            {/* Red Shopping Cart Icon */}
            <div className="crystal-surface crystal-shimmer text-[#f57224] w-10 h-10 rounded-xl flex items-center justify-center border border-orange-200/80 transform group-hover:-translate-y-0.5 group-hover:scale-105 transition-transform">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.60 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>

            {/* Brand Name & Tagline */}
            <div className="flex flex-col">
              <div className="text-lg md:text-2xl font-black tracking-tight flex items-center">
                <span className="text-gray-900 dark:text-gray-100">Daily</span>
                <span className="text-[#f57224] mx-0.5">Shop</span>
                <span className="text-gray-900 dark:text-gray-100">BD</span>
              </div>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 font-semibold tracking-wide">
                Your Trusted Online Shopping Partner
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center rounded-2xl overflow-hidden border-2 border-slate-400 bg-white/90 shadow-[0_5px_0_rgba(203,213,225,.85),0_10px_20px_rgba(15,23,42,.12),inset_0_1px_0_rgba(255,255,255,.95)] dark:border-slate-500 dark:bg-slate-900/90 dark:shadow-[0_5px_0_rgba(15,23,42,.9),0_10px_20px_rgba(0,0,0,.3)] focus-within:border-[#f57224] focus-within:ring-4 focus-within:ring-orange-100/70 dark:focus-within:ring-orange-950/40 transition-all">
            <input 
              type="text" 
              placeholder="Search products in DailyShopBD..." 
              value={searchQuery || ''}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 text-gray-800 dark:text-gray-100 text-xs outline-none bg-transparent font-medium"
            />
            <button 
              onClick={() => setActiveTab('Home')}
              className="bg-[#f57224] hover:bg-orange-600 px-5 py-2.5 text-white font-black transition border-l border-orange-600 shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_4px_12px_rgba(245,114,36,.28)]"
            >
              🔍
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <nav className="hidden xl:flex gap-2 items-center">
              {['Home', 'About Us', 'Privacy Policy', 'Contact Us'].map((item) => (
                <button key={item} onClick={() => setActiveTab(item)} className={`crystal-surface px-3 py-2 rounded-xl transition-all hover:-translate-y-0.5 hover:text-[#f57224] active:translate-y-0 ${activeTab === item ? 'text-[#f57224] font-black ring-2 ring-orange-200/70 dark:ring-orange-700/50' : ''}`}>{item}</button>
              ))}
            </nav>

            {/* Auth Buttons */}
            {!authLoading && (
              currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-800 dark:text-gray-200 font-bold hidden xl:inline">
                    👤 {currentUser.displayName || currentUser.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-2 rounded-xl border border-red-400 hover:bg-red-600 transition shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_5px_12px_rgba(239,68,68,.25)] font-bold active:translate-y-[1px]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveTab('Login')} 
                    className="crystal-surface text-[#f57224] border border-orange-300/70 px-3 py-2 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 transition font-bold active:translate-y-[1px]"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setActiveTab('Register')} 
                    className="bg-[#f57224] text-white px-3 py-2 rounded-xl border border-orange-500 hover:bg-orange-600 transition font-bold shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_5px_12px_rgba(245,114,36,.28)] active:translate-y-[1px]"
                  >
                    Register
                  </button>
                </div>
              )
            )}

            {/* Cart Button */}
            <div 
              onClick={() => setIsCartOpen(true)} 
              className="crystal-surface cursor-pointer border-orange-200 dark:border-gray-700 px-3 py-2 rounded-xl flex items-center gap-2 hover:border-[#f57224] dark:hover:border-[#f57224] transition active:translate-y-[1px]"
            >
              <span className="text-base">🛒</span>
              <span className="bg-[#f57224] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                {cart.length}
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="crystal-surface p-2 rounded-xl text-gray-800 dark:text-yellow-400 font-bold transition hover:border-[#f57224] cursor-pointer active:translate-y-[1px]"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <input 
              type="text" 
              placeholder="Search products in DailyShopBD..." 
              value={searchQuery || ''}
              onChange={handleSearchChange}
              className="w-full px-3 py-1.5 text-gray-800 dark:text-gray-100 text-xs outline-none bg-transparent"
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

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
