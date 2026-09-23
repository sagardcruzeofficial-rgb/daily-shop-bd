import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const defaultProducts = [
    {
      id: 1,
      title: 'Daraz Exclusive Casual T-Shirt for Men',
      price: 490,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
      category: 'Fashion',
      sizes: ['M', 'L', 'XL', 'XXL'],
      description: '100% Premium Cotton stylish t-shirt for daily use.'
    },
    {
      id: 2,
      title: 'Wireless Bluetooth Headphone Bass Edition',
      price: 1250,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
      category: 'Electronics',
      sizes: ['Standard'],
      description: 'High bass bluetooth headphone with long battery life.'
    },
    {
      id: 3,
      title: 'Smart Watch Series 8 Ultra Fitness Tracker',
      price: 2100,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      category: 'Gadgets',
      sizes: ['Standard'],
      description: 'Waterproof smartwatch with health sensors.'
    },
    {
      id: 4,
      title: 'Pro Running Sneakers Shoes for Men',
      price: 1850,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
      category: 'Fashion',
      sizes: ['40', '41', '42', '43'],
      description: 'Lightweight breathable mesh running shoes.'
    }
  ];

  const defaultFooterLinks = [
    { id: 1, title: 'About Us', url: '#about' },
    { id: 2, title: 'Privacy Policy', url: '#privacy' },
    { id: 3, title: 'Contact Us', url: '#contact' },
    { id: 4, title: 'Terms & Conditions', url: '#terms' }
  ];

  const [products, setProducts] = useState(() => {
    const local = localStorage.getItem('daily_shop_products');
    return local ? JSON.parse(local) : defaultProducts;
  });

  const [orders, setOrders] = useState(() => {
    const local = localStorage.getItem('daily_shop_orders');
    return local ? JSON.parse(local) : [];
  });

  const [footerLinks, setFooterLinks] = useState(() => {
    const local = localStorage.getItem('daily_shop_footer');
    return local ? JSON.parse(local) : defaultFooterLinks;
  });

  const [categories] = useState(['Fashion', 'Electronics', 'Gadgets']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    localStorage.setItem('daily_shop_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('daily_shop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('daily_shop_footer', JSON.stringify(footerLinks));
  }, [footerLinks]);

  const addToCart = (product, size) => {
    setCart((prev) => [...prev, { ...product, selectedSize: size || product.sizes?.[0] || 'N/A', cartId: Date.now() }]);
  };

  const addProduct = (newProd) => {
    setProducts((prev) => [{ ...newProd, id: Date.now() }, ...prev]);
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addOrder = (orderData) => {
    setOrders((prev) => [{ ...orderData, id: Date.now(), date: new Date().toLocaleString() }, ...prev]);
  };

  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const addFooterLink = (link) => {
    setFooterLinks((prev) => [...prev, { ...link, id: Date.now() }]);
  };

  const deleteFooterLink = (id) => {
    setFooterLinks((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      products, categories, selectedCategory, setSelectedCategory, cart,
      selectedProduct, setSelectedProduct, activeTab, setActiveTab,
      orders, footerLinks, addToCart, addProduct, deleteProduct,
      addOrder, deleteOrder, addFooterLink, deleteFooterLink
    }}>
      {children}
    </StoreContext.Provider>
  );
};
