import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Footer() {
  const { setActiveTab } = useContext(StoreContext);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#131921] text-white text-sm font-sans mt-16">
      {/* Back To Top Bar */}
      <button 
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] py-3 text-center text-xs font-bold tracking-wide transition"
      >
        Back to top
      </button>

      {/* Footer Main Navigation Links */}
      <div className="bg-[#232f3e] border-b border-gray-700">
        <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-white mb-3 text-base">Get to Know Us</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => setActiveTab('About Us')} className="hover:underline">About Daily Shop BD</button></li>
              <li><button onClick={() => setActiveTab('Home')} className="hover:underline">Careers</button></li>
              <li><button onClick={() => setActiveTab('Privacy Policy')} className="hover:underline">Privacy Policy</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-base">Make Money with Us</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => setActiveTab('Home')} className="hover:underline">Sell on Daily Shop BD</button></li>
              <li><button onClick={() => setActiveTab('Home')} className="hover:underline">Become an Affiliate</button></li>
              <li><button onClick={() => setActiveTab('Home')} className="hover:underline">Advertise Your Products</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-base">Payment Products</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><span className="text-gray-400">bKash / Nagad Accepted</span></li>
              <li><span className="text-gray-400">Cash on Delivery</span></li>
              <li><span className="text-gray-400">Shop with Points</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-base">Let Us Help You</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => setActiveTab('Contact Us')} className="hover:underline">Help & Support</button></li>
              <li><button onClick={() => setActiveTab('Home')} className="hover:underline">Shipping Rates & Policies</button></li>
              <li><button onClick={() => setActiveTab('Contact Us')} className="hover:underline">Returns & Replacements</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright & Credit Line */}
      <div className="bg-[#131921] py-8 text-center text-xs text-gray-400 space-y-2">
        <div className="flex justify-center gap-4 mb-2">
          <button onClick={() => setActiveTab('Privacy Policy')} className="hover:underline">Conditions of Use</button>
          <button onClick={() => setActiveTab('Privacy Policy')} className="hover:underline">Privacy Notice</button>
        </div>
        <p className="text-gray-300 font-semibold text-sm">
          A Website Created by Sagar Anthony Dcruze
        </p>
        <p className="text-gray-500">© 2026, DailyShopBD.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
}
