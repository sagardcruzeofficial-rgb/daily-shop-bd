import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Footer() {
  const { setActiveTab } = useContext(StoreContext);

  return (
    <footer className="bg-[#111827] text-gray-300 font-sans border-t border-gray-800 mt-12">
      <div className="max-w-[1300px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About Company */}
        <div>
          <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
            <span className="bg-[#f57224] text-white w-7 h-7 rounded-lg flex items-center justify-center text-sm">D</span>
            DailyShopBD
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            বাংলাদেশ থেকে সহজ ও নির্ভরযোগ্য কেনাকাটার অন্যতম সেরা বিশ্বস্ত অনলাইন শপ।
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => { setActiveTab('Home'); window.scrollTo(0, 0); }} className="hover:text-[#f57224] transition">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('About Us'); window.scrollTo(0, 0); }} className="hover:text-[#f57224] transition font-semibold text-orange-400">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('Privacy Policy'); window.scrollTo(0, 0); }} className="hover:text-[#f57224] transition">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('Contact Us'); window.scrollTo(0, 0); }} className="hover:text-[#f57224] transition">
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Support</h4>
          <p className="text-xs text-gray-400">Email: support@dailyshopbd.com</p>
          <p className="text-xs text-gray-400 mt-1">Phone: +880 1705-507447</p>
        </div>

      </div>

      <div className="border-t border-gray-800 text-center py-4 text-[11px] text-gray-500">
        © {new Date().getFullYear()} DailyShopBD. All rights reserved.
      </div>
    </footer>
  );
}
