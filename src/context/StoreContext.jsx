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
      description: '100% Premium Cotton stylish t-shirt for daily use with maximum comfort.'
    },
    {
      id: 2,
      title: 'Wireless Bluetooth Headphone Bass Edition',
      price: 1250,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
      category: 'Electronics',
      sizes: ['Free Size'],
      description: 'High bass bluetooth headphone with 20 hours battery backup.'
    },
    {
      id: 3,
      title: 'Smart Watch Series 8 Ultra Fitness Tracker',
      price: 2100,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      category: 'Gadgets',
      sizes: ['Standard'],
      description: 'Waterproof smartwatch with heart rate sensor, sports tracking & Amoled display.'
    },
    {
      id: 4,
      title: 'Pro Running Sneakers Shoes for Men',
      price: 1850,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
      category: 'Fashion',
      sizes: ['40', '41', '42', '43'],
      description: 'Lightweight breathable mesh running shoes with anti-slip rubber sole.'
    }
  ];

  const [products, setProducts] = useState(() => {
    const local = localStorage.getItem('daily_shop_products');
    return local ? JSON.parse(local) : defaultProducts;
  });

  const [categories] = useState(['Fashion', 'Electronics', 'Gadgets', 'Home & Living']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [viewMode, setViewMode] = useState('visitor'); // 'visitor' or 'admin'

  useEffect(() => {
    localStorage.setItem('daily_shop_products', JSON.stringify(products));
  }, [products]);

  const addToCart = (product, size) => {
    setCart((prev) => [...prev, { ...product, selectedSize: size || product.sizes?.[0] || 'N/A', cartId: Date.now() }]);
  };

  const addProduct = (newProd) => {
    setProducts((prev) => [ { ...newProd, id: Date.now() }, ...prev ]);
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct?.id === id) setSelectedProduct(null);
  };

  return (
    <StoreContext.Provider value={{
      products, categories, selectedCategory, setSelectedCategory, cart,
      selectedProduct, setSelectedProduct, activeTab, setActiveTab,
      viewMode, setViewMode, addToCart, addProduct, deleteProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
};
