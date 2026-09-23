import React, { createContext, useState } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: 'Premium Cotton T-Shirt',
      price: 490,
      image: 'https://via.placeholder.com/300',
      category: 'Fashion',
      description: 'High quality 100% cotton casual t-shirt.',
      sizes: ['M', 'L', 'XL', 'XXL']
    }
  ]);

  const [categories, setCategories] = useState(['Fashion', 'Electronics', 'Gadgets', 'Groceries']);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const addToCart = (product, size) => {
    setCart((prev) => [...prev, { ...product, selectedSize: size, cartId: Date.now() }]);
  };

  const addProduct = (newProduct) => {
    setProducts((prev) => [...prev, { ...newProduct, id: Date.now() }]);
  };

  const addCategory = (categoryName) => {
    if (categoryName && !categories.includes(categoryName)) {
      setCategories((prev) => [...prev, categoryName]);
    }
  };

  return (
    <StoreContext.Provider value={{
      products, categories, cart, selectedProduct, activeTab, isAdminOpen,
      setSelectedProduct, setActiveTab, setIsAdminOpen, addToCart, addProduct, addCategory
    }}>
      {children}
    </StoreContext.Provider>
  );
};
