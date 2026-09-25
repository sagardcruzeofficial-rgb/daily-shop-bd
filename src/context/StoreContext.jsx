import React, { createContext, useState } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Home'); // Home, Checkout, About Us, etc.
  const [checkoutItems, setCheckoutItems] = useState([]); // Items sent to checkout page
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [categories, setCategories] = useState(['Men', 'Women', 'Electronics', 'Kids']);
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Premium Men T-Shirt',
      category: 'Men',
      price: 450,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      sizes: ['M', 'L', 'XL', 'XXL'],
      description: 'High quality 100% combed cotton t-shirt.'
    },
    {
      id: 2,
      title: 'Casual Stylish Shirt',
      category: 'Men',
      price: 850,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
      sizes: ['M', 'L', 'XL'],
      description: 'Comfortable casual cotton shirt for summer.'
    }
  ]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const addOrder = (order) => {
    setOrders((prev) => [{ ...order, id: Date.now(), date: new Date().toLocaleString() }, ...prev]);
  };

  // Direct Buy Now Trigger
  const startCheckout = (items) => {
    setCheckoutItems(items);
    setActiveTab('Checkout');
  };

  return (
    <StoreContext.Provider value={{
      products, setProducts,
      categories, setCategories,
      cart, addToCart, removeFromCart, clearCart,
      orders, addOrder,
      selectedProduct, setSelectedProduct,
      activeTab, setActiveTab,
      checkoutItems, startCheckout
    }}>
      {children}
    </StoreContext.Provider>
  );
};
