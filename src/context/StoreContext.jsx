import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

const initialProductsData = [
  {
    id: 1,
    title: 'Men Premium Formal Shirt',
    price: 1250,
    cost: 750,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
    description: 'High quality breathable cotton shirt.'
  },
  {
    id: 2,
    title: 'Professional Hair Trimmer',
    price: 1450,
    cost: 850,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500',
    description: 'Rechargeable cordless trimmer.'
  }
];

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : initialProductsData;
  });

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [viewMode, setViewMode] = useState('store'); // 'store' or 'admin'

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const addProduct = (newProd) => {
    setProducts((prev) => [{ ...newProd, id: Date.now() }, ...prev]);
  };

  const editProduct = (updatedProd) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const placeOrder = (customerDetails) => {
    const newOrder = {
      id: Date.now(),
      customer: customerDetails,
      items: cart,
      total: cart.reduce((sum, item) => sum + Number(item.price), 0) + 60,
      date: new Date().toLocaleDateString('bn-BD'),
      status: 'Pending'
    };

    setOrders((prev) => [newOrder, ...prev]);

    const adminWhatsApp = '8801705507447';
    let itemSummary = cart.map(item => `- ${item.title}: ${item.price} TK`).join('%0A');
    let totalPrice = newOrder.total;

    const message = `🛒 *New Order Received - Daily Shop BD*%0A%0A` +
      `👤 *Customer Name:* ${customerDetails.name}%0A` +
      `📞 *Phone:* ${customerDetails.phone}%0A` +
      `📍 *Address:* ${customerDetails.address}%0A%0A` +
      `📦 *Items Ordered:*%0A${itemSummary}%0A%0A` +
      `💰 *Total Amount (inc. Delivery):* ${totalPrice} TK`;

    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
  };

  return (
    <StoreContext.Provider value={{
      products, addProduct, editProduct, deleteProduct,
      cart, addToCart, removeFromCart, clearCart,
      orders, placeOrder,
      viewMode, setViewMode
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
