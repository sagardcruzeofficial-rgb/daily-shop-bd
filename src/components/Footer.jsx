import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Footer() {
  const { setActiveTab } = useContext(StoreContext);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#131921] text-white text-xs font-sans mt-16 border-t-4 border-[#f57224]">
      {/* Back to top */}
      <button 
        onClick={scrollToTop}
        className="w-full bg-[#232f3e] hover:bg-[#37475a] py-3 text-center text-xs font-bold tracking-wider text-gray-200 transition"
      >
        BACK TO TOP
      </button>

      {/* Amazon Footer Links */}
      <div className="max-w-[1300px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-white text-sm mb-4 border-b border-gray-700 pb-2">Customer Care</h4>
          <ul className="space-y-2 text-gray-400">
            <li><button onClick={() => setActiveTab('Contact Us')} className="hover:text-[#f57224] transition">Help Center</button></li>
            <li><button onClick={() => setActiveTab('Contact Us')} className="hover:text-[#f57224] transition">How to Buy</button></li>
            <li><button onClick={() => setActiveTab('Contact Us')} className="hover:text-[#f57224] transition">Returns & Refunds</button></li>
            <li><button onClick={() => setActiveTab('Contact Us')} className="hover:text-[#f57224] transition">Contact Us</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-4 border-b border-gray-700 pb-2">Daily Shop BD</h4>
          <ul className="space-y-2 text-gray-400">
            <li><button onClick={() => setActiveTab('About Us')} className="hover:text-[#f57224] transition">About Daily Shop BD</button></li>
            <li><button onClick={() => setActiveTab('Privacy Policy')} className="hover:text-[#f57224] transition">Terms & Conditions</button></li>
            <li><button onClick={() => setActiveTab('Privacy Policy')} className="hover:text-[#f57224] transition">Privacy Policy</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-4 border-b border-gray-700 pb-2">Payment Methods</h4>
          <p className="text-gray-400 mb-2 leading-relaxed">We support bKash, Nagad, Rocket, Credit/Debit Cards, and Cash on Delivery across Bangladesh.</p>
          <div className="flex gap-2 text-lg">
            <span className="bg-gray-800 px-2 py-1 rounded">💳</span>
            <span className="bg-gray-800 px-2 py-1 rounded">📱</span>
            <span className="bg-gray-800 px-2 py-1 rounded">💵</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-4 border-b border-gray-700 pb-2">Verified & Secure</h4>
          <p className="text-gray-400 mb-2">100% Authentic Products & Trusted Delivery.</p>
        </div>
      </div>

      {/* Credit Section */}
      <div className="bg-[#0f1111] py-6 text-center text-gray-400 border-t border-gray-800 space-y-2">
        <p className="text-sm font-semibold text-gray-200">
          A Website Created by Sagar Anthony Dcruze
        </p>
        <p className="text-[11px] text-gray-500">
          © 2026 DailyShopBD.com — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
