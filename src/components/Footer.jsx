import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

export default function Footer() {
  const { setActiveTab } = useContext(StoreContext);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">Daily Shop BD</h3>
          <p className="text-sm text-gray-400">Your trusted online e-commerce platform for quality products.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => setActiveTab('Home')} className="hover:text-white">Home</button></li>
            <li><button onClick={() => setActiveTab('About Us')} className="hover:text-white">About Us</button></li>
            <li><button onClick={() => setActiveTab('Privacy Policy')} className="hover:text-white">Privacy Policy</button></li>
            <li><button onClick={() => setActiveTab('Contact Us')} className="hover:text-white">Contact Us</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Customer Support</h4>
          <p className="text-sm text-gray-400">Email: support@dailyshopbd.com</p>
          <p className="text-sm text-gray-400">Phone: +880 1234 567890</p>
        </div>
      </div>

      <div className="bg-gray-950 py-4 text-center border-t border-gray-800 text-sm">
        <p className="text-gray-400 font-medium">A Website Created by Sagar Anthony Dcruze</p>
      </div>
    </footer>
  );
}
