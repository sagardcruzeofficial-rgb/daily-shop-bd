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
    const dark = savedTheme === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    setIsDarkMode(dark);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    setIsDarkMode(nextDark);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (activeTab !== 'Home') setActiveTab('Home');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = ['Home', 'About Us', 'Privacy Policy', 'Contact Us'];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 font-sans shadow-[0_4px_18px_rgba(15,23,42,.08)] backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex min-h-8 items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-4 py-1.5 text-[10px] text-slate-300 sm:px-6 lg:px-8">
          <marqusee><div className="min-w-0 flex-1 truncate">Welcome to DailyShopBD — Official Online Store</div></marqusee>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3 px-3 py-3 sm:gap-5 sm:px-5 lg:px-8">
          <button
            type="button"
            onClick={() => { setActiveTab('Home'); setSearchQuery(''); }}
            className="group flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-left shadow-[0_3px_0_rgba(203,213,225,.7),0_6px_14px_rgba(15,23,42,.08)] transition hover:border-orange-300 hover:shadow-[0_3px_0_rgba(253,186,116,.7),0_8px_18px_rgba(15,23,42,.1)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_3px_0_rgba(15,23,42,.8),0_6px_14px_rgba(0,0,0,.24)]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-[#f57224] transition group-hover:bg-orange-100 dark:bg-orange-950/40">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-2-2z" /></svg>
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-lg font-black tracking-tight text-slate-900 dark:text-white">Daily<span className="text-[#f57224]">Shop</span>BD</span>
              <span className="mt-1 block text-[8px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">Trusted online shopping</span>
            </span>
          </button>

          <div className="hidden min-w-0 flex-1 items-center rounded-xl border border-slate-300 bg-slate-50 shadow-inner transition focus-within:border-[#f57224] focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100/70 md:flex dark:border-slate-700 dark:bg-slate-900 dark:focus-within:bg-slate-950 dark:focus-within:ring-orange-950/40">
            <input type="text" placeholder="Search products in DailyShopBD..." value={searchQuery || ''} onChange={handleSearchChange} className="min-w-0 flex-1 bg-transparent px-4 py-3 text-xs text-slate-800 outline-none dark:text-slate-100" />
            <button type="button" onClick={() => setActiveTab('Home')} aria-label="Search" className="m-1 rounded-lg bg-[#f57224] px-4 py-2.5 text-white transition hover:bg-orange-600 active:scale-95">🔍</button>
          </div>

          <nav className="hidden shrink-0 items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <button key={item} type="button" onClick={() => setActiveTab(item)} className={`rounded-lg px-2.5 py-2 text-[11px] font-semibold transition hover:bg-orange-50 hover:text-[#f57224] dark:hover:bg-slate-800 ${activeTab === item ? 'bg-orange-50 text-[#f57224] dark:bg-orange-950/30' : 'text-slate-600 dark:text-slate-300'}`}>{item}</button>
            ))}
          </nav>

          {!authLoading && (currentUser ? (
            <div className="hidden items-center gap-2 lg:flex">
              <span className="max-w-[130px] truncate text-[11px] font-semibold text-slate-600 dark:text-slate-300">👤 {currentUser.displayName || currentUser.email}</span>
              <button type="button" onClick={handleLogout} className="rounded-lg border border-red-200 px-2.5 py-2 text-[11px] font-bold text-red-600 transition hover:bg-red-50 dark:border-red-900/70 dark:hover:bg-red-950/30">Logout</button>
            </div>
          ) : (
            <div className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 lg:flex dark:border-slate-700 dark:bg-slate-900">
              <button type="button" onClick={() => setActiveTab('Login')} className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-white hover:text-[#f57224] dark:text-slate-300 dark:hover:bg-slate-800">Login</button>
              <button type="button" onClick={() => setActiveTab('Register')} className="rounded-lg bg-[#f57224] px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-orange-600">Register</button>
            </div>
          ))}

          <button type="button" onClick={() => setIsCartOpen(true)} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-[#f57224] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><span>🛒</span><span className="rounded-full bg-[#f57224] px-1.5 py-0.5 text-[10px] text-white">{cart.length}</span></button>
          <button type="button" onClick={toggleDarkMode} className="hidden rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm shadow-sm transition hover:border-orange-300 md:block dark:border-slate-700 dark:bg-slate-900" title="Toggle Dark/Light Mode">{isDarkMode ? '☀️' : '🌙'}</button>
        </div>

        <div className="px-3 pb-3 md:hidden">
          <div className="flex items-center overflow-hidden rounded-lg border border-slate-300 bg-slate-50 focus-within:border-[#f57224] dark:border-slate-700 dark:bg-slate-900">
            <input type="text" placeholder="Search products..." value={searchQuery || ''} onChange={handleSearchChange} className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs outline-none dark:text-slate-100" />
            <button type="button" onClick={() => setActiveTab('Home')} className="bg-[#f57224] px-3 py-2 text-xs text-white">🔍</button>
          </div>
          <div className="mt-2 flex gap-1 overflow-x-auto xl:hidden">
            {navItems.map((item) => <button key={item} type="button" onClick={() => setActiveTab(item)} className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${activeTab === item ? 'bg-orange-50 text-[#f57224]' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{item}</button>)}
            {!authLoading && !currentUser && <><button type="button" onClick={() => setActiveTab('Login')} className="whitespace-nowrap rounded-md bg-slate-100 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">Login</button><button type="button" onClick={() => setActiveTab('Register')} className="whitespace-nowrap rounded-md bg-[#f57224] px-2.5 py-1.5 text-[10px] font-semibold text-white">Register</button></>}
          </div>
        </div>
      </header>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
