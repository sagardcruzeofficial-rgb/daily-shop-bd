import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const defaultProducts = [
    {
      id: 1,
      title: 'Premium Men Casual T-Shirt',
      price: 490,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
      category: 'Fashion',
      subCategory: 'T-Shirts',
      sizes: ['M', 'L', 'XL', 'XXL'],
      description: '100% Premium Cotton stylish t-shirt for daily use.',
      supplierUrl: 'https://supplier-website.com/item/tshirt-101' // 👈 Hidden from visitors
    },
    {
      id: 2,
      title: 'Wireless Bluetooth Headphone Bass Edition',
      price: 1250,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
      category: 'Electronics',
      subCategory: 'Audio',
      sizes: ['Standard'],
      description: 'High bass bluetooth headphone with long battery life.',
      supplierUrl: 'https://supplier-website.com/item/headphone-202' // 👈 Hidden from visitors
    },
    {
      id: 3,
      title: 'Smart Watch Series 8 Ultra Fitness Tracker',
      price: 2100,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      category: 'Gadgets',
      subCategory: 'Smart Wearables',
      sizes: ['Standard'],
      description: 'Waterproof smartwatch with health sensors.',
      supplierUrl: 'https://supplier-website.com/item/watch-303' // 👈 Hidden from visitors
    },
    {
      id: 4,
      title: 'Pro Running Sneakers Shoes for Men',
      price: 1850,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
      category: 'Fashion',
      subCategory: 'Shoes',
      sizes: ['40', '41', '42', '43'],
      description: 'Lightweight breathable mesh running shoes.',
      supplierUrl: 'https://supplier-website.com/item/shoes-404' // 👈 Hidden from visitors
    }
  ];

  const defaultFooterLinks = [
    { id: 1, title: 'About Us', url: '#about' },
    { id: 2, title: 'Privacy Policy', url: '#privacy' },
    { id: 3, title: 'Contact Us', url: '#contact' },
    { id: 4, title: 'Terms & Conditions', url: '#terms' }
  ];

  const defaultCategoryData = [
    { name: 'Fashion', subCategories: ['T-Shirts', 'Shoes', 'Pants'] },
    { name: 'Electronics', subCategories: ['Audio', 'Laptops', 'Mobile Accessories'] },
    { name: 'Gadgets', subCategories: ['Smart Wearables', 'Drones', 'Gimbal'] }
  ];

  const [products, setProducts] = useState(() => {
    try {
      const local = localStorage.getItem('daily_shop_products');
      return local ? JSON.parse(local) : defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const local = localStorage.getItem('daily_shop_orders');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  const [footerLinks, setFooterLinks] = useState(() => {
    try {
      const local = localStorage.getItem('daily_shop_footer');
      return local ? JSON.parse(local) : defaultFooterLinks;
    } catch {
      return defaultFooterLinks;
    }
  });

  const [categoryData, setCategoryData] = useState(() => {
    try {
      const local = localStorage.getItem('daily_shop_category_data');
      return local ? JSON.parse(local) : defaultCategoryData;
    } catch {
      return defaultCategoryData;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [checkoutItems, setCheckoutItems] = useState([]);

  useEffect(() => {
    localStorage.setItem('daily_shop_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('daily_shop_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('daily_shop_footer', JSON.stringify(footerLinks));
  }, [footerLinks]);

  useEffect(() => {
    localStorage.setItem('daily_shop_category_data', JSON.stringify(categoryData));
  }, [categoryData]);

  // Derive categories for simple selection
  const categories = categoryData.map(c => c.name);

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

  // Category & Sub-category Management
  const addCategory = (categoryName) => {
    if (!categoryName) return;
    if (!categoryData.some(c => c.name.toLowerCase() === categoryName.toLowerCase())) {
      setCategoryData((prev) => [...prev, { name: categoryName, subCategories: [] }]);
    }
  };

  const deleteCategory = (categoryName) => {
    setCategoryData((prev) => prev.filter((c) => c.name !== categoryName));
  };

  const addSubCategory = (categoryName, subCategoryName) => {
    if (!categoryName || !subCategoryName) return;
    setCategoryData((prev) =>
      prev.map((c) => {
        if (c.name === categoryName) {
          const subList = c.subCategories || [];
          if (!subList.includes(subCategoryName)) {
            return { ...c, subCategories: [...subList, subCategoryName] };
          }
        }
        return c;
      })
    );
  };

  const deleteSubCategory = (categoryName, subCategoryName) => {
    setCategoryData((prev) =>
      prev.map((c) => {
        if (c.name === categoryName) {
          return {
            ...c,
            subCategories: (c.subCategories || []).filter((s) => s !== subCategoryName)
          };
        }
        return c;
      })
    );
  };

  const startCheckout = (items) => {
    setCheckoutItems(items);
    setActiveTab('Checkout');
  };

  // Filtered Products Search & Category Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSubCategory = selectedSubCategory === 'All' || p.subCategory === selectedSubCategory;

    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  return (
    <StoreContext.Provider value={{
      products, filteredProducts, categories, categoryData, selectedCategory, setSelectedCategory,
      selectedSubCategory, setSelectedSubCategory, searchQuery, setSearchQuery, cart,
      selectedProduct, setSelectedProduct, activeTab, setActiveTab,
      orders, footerLinks, checkoutItems, startCheckout,
      addToCart, removeFromCart, clearCart, addProduct, deleteProduct,
      addOrder, deleteOrder, addFooterLink, deleteFooterLink,
      addCategory, deleteCategory, addSubCategory, deleteSubCategory
    }}>
      {children}
    </StoreContext.Provider>
  );
};
