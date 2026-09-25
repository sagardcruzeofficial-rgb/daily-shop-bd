import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Footer() {
  const { footerLinks, setActiveTab } = useContext(StoreContext);

  return (
    <footer className="bg-[#111827] text-white font-sans mt-16 border-t-4 border-[#f57224]">
      <div className="max-w-[1300px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        <div>
          <h3 className="text-xl font-black text-[#f57224] mb-3">DailyShop.bd</h3>
          <p className="text-gray-400 leading-relaxed">Top online shopping destination in Bangladesh with high quality products.</p>
        </div>

        {/* Dynamic Admin-Controlled Footer Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3 border-b border-gray-800 pb-2">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            {footerLinks.map((link) => (
              <li key={link.id}>
                <button onClick={() => setActiveTab('Home')} className="hover:text-[#f57224] transition">
                  {link.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3 border-b border-gray-800 pb-2">Customer Care</h4>
          <p className="text-gray-400 mb-1">Helpline: +880 1705507447</p>
          <p className="text-gray-400">WhatsApp Support 24/7</p>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3 border-b border-gray-800 pb-2">Accepted Payment</h4>
          <p className="text-gray-400">Bkash, Rocket, Nagad, Cash on Delivery</p>
        </div>
      </div>

      <div className="bg-black py-5 text-center text-gray-400 border-t border-gray-800 text-xs">
        <p className="text-gray-300 font-bold text-sm">
          A Website Created by Sagar Anthony Dcruze
        </p>
        <p className="text-gray-500 text-[10px] mt-1">© 2026 DailyShopBD. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
