import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const defaultProducts = [
    {
      id: '1',
      title: 'Premium Men Casual T-Shirt',
      price: 490,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
      category: 'Fashion',
      subCategory: 'T-Shirts',
      sizes: ['M', 'L', 'XL', 'XXL'],
      description: '100% Premium Cotton stylish t-shirt for daily use.',
      supplierUrl: 'https://supplier-website.com/item/tshirt-101',
      inStock: true
    },
    {
      id: '2',
      title: 'Wireless Bluetooth Headphone Bass Edition',
      price: 1250,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
      category: 'Electronics',
      subCategory: 'Audio',
      sizes: ['Standard'],
      description: 'High bass bluetooth headphone with long battery life.',
      supplierUrl: 'https://supplier-website.com/item/headphone-202',
      inStock: true
    }
  ];

  const defaultFooterLinks = [
    { id: '1', title: 'About Us', url: '#about' },
    { id: '2', title: 'Privacy Policy', url: '#privacy' },
    { id: '3', title: 'Contact Us', url: '#contact' },
    { id: '4', title: 'Terms & Conditions', url: '#terms' }
  ];

  const defaultCategoryData = [
    { name: 'Fashion', subCategories: ['T-Shirts', 'Shoes', 'Pants'] },
    { name: 'Electronics', subCategories: ['Audio', 'Laptops', 'Mobile Accessories'] },
    { name: 'Gadgets', subCategories: ['Smart Wearables', 'Drones', 'Gimbal'] }
  ];

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [footerLinks, setFooterLinks] = useState(defaultFooterLinks);
  const [categoryData, setCategoryData] = useState(defaultCategoryData);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firebase Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        if (!prodSnap.empty) {
          const prodList = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProducts(prodList);
        } else {
          setProducts(defaultProducts);
        }

        const orderSnap = await getDocs(collection(db, 'orders'));
        if (!orderSnap.empty) {
          const orderList = orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(orderList);
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = categoryData.map(c => c.name);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  // Firebase Database Operation for Add Product
  const addProduct = async (newProd) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...newProd,
        createdAt: new Date().toISOString()
      });
      setProducts((prev) => [{ ...newProd, id: docRef.id }, ...prev]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Firebase Database Operation for Delete Product
  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Automated Stock Scraper Call
  const checkAndUpdateStock = async (productId, supplierUrl) => {
    if (!supplierUrl) return;
    try {
      const res = await fetch(`/api/check-stock?url=${encodeURIComponent(supplierUrl)}`);
      const data = await res.json();
      if (data && typeof data.inStock === 'boolean') {
        const prodRef = doc(db, 'products', productId);
        await updateDoc(prodRef, { inStock: data.inStock });

        setProducts(prev => prev.map(p => p.id === productId ? { ...p, inStock: data.inStock } : p));
      }
    } catch (err) {
      console.error("Stock check failed:", err);
    }
  };

  const addOrder = async (orderData) => {
    try {
      const newOrder = { ...orderData, date: new Date().toLocaleString() };
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      setOrders((prev) => [{ ...newOrder, id: docRef.id }, ...prev]);
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await deleteDoc(doc(db, 'orders', id));
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const addFooterLink = (link) => {
    setFooterLinks((prev) => [...prev, { ...link, id: Date.now().toString() }]);
  };

  const deleteFooterLink = (id) => {
    setFooterLinks((prev) => prev.filter((f) => f.id !== id));
  };

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

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      orders, footerLinks, checkoutItems, loading, startCheckout,
      addToCart, removeFromCart, clearCart, addProduct, deleteProduct,
      addOrder, deleteOrder, addFooterLink, deleteFooterLink,
      addCategory, deleteCategory, addSubCategory, deleteSubCategory,
      checkAndUpdateStock
    }}>
      {children}
    </StoreContext.Provider>
  );
};
