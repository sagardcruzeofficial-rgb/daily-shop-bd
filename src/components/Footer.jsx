import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Footer() {
  const { footerLinks, setActiveTab } = useContext(StoreContext);

  const handleLinkClick = (title) => {
    setActiveTab(title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111827] text-white font-sans mt-16 border-t-4 border-[#f57224]">
      <div className="max-w-[1300px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        
        {/* Brand & Short Description */}
        <div>
          <h3 className="text-xl font-black text-[#f57224] mb-3">DailyShopBD</h3>
          <p className="text-gray-400 leading-relaxed">
            Top online shopping destination in Bangladesh with high quality products.
          </p>
        </div>

        {/* Dynamic Admin-Controlled Footer Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3 border-b border-gray-800 pb-2">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            {footerLinks && footerLinks.length > 0 ? (
              footerLinks.map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => handleLinkClick(link.title)} 
                    className="hover:text-[#f57224] transition text-left"
                  >
                    {link.title}
                  </button>
                </li>
              ))
            ) : (
              <>
                <li>
                  <button onClick={() => handleLinkClick('Home')} className="hover:text-[#f57224] transition">Home</button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('About Us')} className="hover:text-[#f57224] transition">About Us</button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('Privacy Policy')} className="hover:text-[#f57224] transition">Privacy Policy</button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('Contact Us')} className="hover:text-[#f57224] transition">Contact Us</button>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3 border-b border-gray-800 pb-2">Customer Care</h4>
          <p className="text-gray-400 mb-1">Helpline: +880 1705507447</p>
          <p className="text-gray-400">WhatsApp Support 24/7</p>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3 border-b border-gray-800 pb-2">Accepted Payment</h4>
          <p className="text-gray-400">Bkash, Rocket, Nagad, Cash on Delivery</p>
        </div>

      </div>

      {/* Footer Bottom Credit Section */}
      <div className="bg-black py-5 text-center text-gray-400 border-t border-gray-800 text-xs">
        <p className="text-gray-300 font-bold text-sm">
          A Website Created by Sagar Anthony Dcruze
        </p>
        <p className="text-gray-500 text-[10px] mt-1">
          © {new Date().getFullYear()} DailyShopBD. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
