import React, { useContext, useState } from 'react';
import Navbar from './components/Navbar';
import CategorySidebar from './components/CategorySidebar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import AdminView from './components/AdminView';
import CheckoutPage from './components/CheckoutPage';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import { StoreContext } from './context/StoreContext';
import { auth } from './firebase'; 
import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from 'firebase/auth';

// Admin Firebase Authentication & Forgot Password Protected Wrapper
const AdminAuthWrapper = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    sessionStorage.getItem('adminAuth') === 'true'
  );
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage('');
    try {
      // Firebase auth diye login check kora
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage('Bhul Email othoba Password! Abar chesta korun.');
      setPasswordInput('');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    if (!resetEmail) {
      setErrorMessage("Doya kore apnar admin email-ti likhun!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccessMessage("Password reset link apnar gmail-e pathano hoyeche! Inbox ba spam folder check korun.");
      setError(false);
    } catch (err) {
      console.error(err);
      setErrorMessage("Ei email-ti firebase system-e pawa jayni!");
      setError(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    sessionStorage.removeItem('adminAuth');
    setIsAdminAuthenticated(false);
    setEmailInput('');
    setPasswordInput('');
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
        <div className="p-8 bg-white rounded-2xl shadow-md w-96 border border-gray-200">
          <h2 className="mb-6 text-xl font-black text-center text-gray-800 border-b pb-3">Admin Panel Security</h2>
          
          {!isForgotMode ? (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">Admin Gmail</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@gmail.com..."
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224] text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">Admin Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password..."
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224] text-sm"
                  required
                />
              </div>
              {error && <p className="mb-4 text-xs font-bold text-red-500">{errorMessage}</p>}
              <button
                type="submit"
                className="w-full py-2.5 font-bold text-white bg-[#f57224] rounded-xl hover:bg-orange-600 transition duration-200 text-sm shadow-sm mb-3"
              >
                Login to Admin
              </button>
              
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => { setIsForgotMode(true); setErrorMessage(''); setSuccessMessage(''); }}
                  className="text-xs text-[#f57224] font-bold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">Enter Admin Gmail</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@gmail.com..."
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f57224] text-sm"
                  required
                />
              </div>
              {errorMessage && <p className="mb-4 text-xs font-bold text-red-500">{errorMessage}</p>}
              {successMessage && <p className="mb-4 text-xs font-bold text-green-600">{successMessage}</p>}
              
              <button
                type="submit"
                className="w-full py-2.5 font-bold text-white bg-[#f57224] rounded-xl hover:bg-orange-600 transition duration-200 text-sm shadow-sm mb-3"
              >
                Send Reset Link
              </button>
              
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => { setIsForgotMode(false); setErrorMessage(''); setSuccessMessage(''); }}
                  className="text-xs text-gray-600 font-bold hover:underline cursor-pointer"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-black text-gray-800 uppercase tracking-wider">Admin Panel Connected (Firebase Secure)</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>🚪</span> Logout Admin
        </button>
      </div>

      {children}
    </div>
  );
};
