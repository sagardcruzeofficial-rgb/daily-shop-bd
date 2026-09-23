import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import StoreView from './components/StoreView';
import AdminView from './components/AdminView';
import CartModal from './components/CartModal';

function MainContent() {
  const { viewMode } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header / Navbar */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'store' ? <StoreView /> : <AdminView />}
      </main>

      {/* Shopping Cart Drawer / Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-xs border-t border-gray-800">
        <p>© {new Date().getFullYear()} Daily Shop BD. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
