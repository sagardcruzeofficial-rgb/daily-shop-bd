import React, { createContext, useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import {  
  collection,  
  getDocs,  
  addDoc,  
  deleteDoc,  
  doc,  
  updateDoc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const auth = useAuth();
  const currentUser = auth ? auth.currentUser : null;
  const authLoading = auth ? auth.loading : false;

  const defaultProducts = [];

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
  
  // LocalStorage ba Session theke initial cart tule ana jate refresh korlei 0 na hoy
  const [cart, setCart] = useState(() => {
    try {
      const savedUser = localStorage.getItem('dailyshop_last_uid');
      if (savedUser) {
        const localData = localStorage.getItem(`dailyshop_cart_${savedUser}`);
        return localData ? JSON.parse(localData) : [];
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const isInitialSync = useRef(true);

  // Fetch initial products, orders & categories from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        if (!prodSnap.empty) {
          const prodList = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProducts(prodList);
        }

        const orderSnap = await getDocs(collection(db, 'orders'));
        if (!orderSnap.empty) {
          const orderList = orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(orderList);
        }

        const catDocRef = doc(db, 'settings', 'categories');
        const catSnap = await getDoc(catDocRef);
        if (catSnap.exists() && catSnap.data()?.list) {
          setCategoryData(catSnap.data().list);
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync Cart based on Auth State securely
  useEffect(() => {
    if (authLoading) return;

    const syncCartWithFirebase = async () => {
      if (currentUser) {
        localStorage.setItem('dailyshop_last_uid', currentUser.uid);
        try {
          const cartRef = doc(db, 'carts', currentUser.uid);
          const docSnap = await getDoc(cartRef);
          
          if (docSnap.exists() && Array.isArray(docSnap.data().items)) {
            const cloudItems = docSnap.data().items;
            if (cloudItems.length > 0) {
              setCart(cloudItems);
              localStorage.setItem(`dailyshop_cart_${currentUser.uid}`, JSON.stringify(cloudItems));
            } else {
              // Cloud-e khali thakle local storage check korbo
              const localSaved = localStorage.getItem(`dailyshop_cart_${currentUser.uid}`);
              if (localSaved) {
                const parsedLocal = JSON.parse(localSaved);
                setCart(parsedLocal);
                await setDoc(cartRef, { items: parsedLocal }, { merge: true });
              }
            }
          } else {
            const localSaved = localStorage.getItem(`dailyshop_cart_${currentUser.uid}`);
            if (localSaved) {
              const parsedLocal = JSON.parse(localSaved);
              setCart(parsedLocal);
              await setDoc(cartRef, { items: parsedLocal }, { merge: true });
            } else {
              await setDoc(cartRef, { items: [] }, { merge: true });
            }
          }
        } catch (err) {
          console.error("Cart sync error:", err);
        }
      } else {
        localStorage.removeItem('dailyshop_last_uid');
        setCart([]);
      }
      
      setTimeout(() => {
        isInitialSync.current = false;
      }, 500);
    };

    syncCartWithFirebase();
  }, [currentUser, authLoading]);

  // Save Cart to Firestore & LocalStorage
  useEffect(() => {
    if (authLoading || isInitialSync.current || !currentUser) return;

    const saveCartToCloud = async () => {
      try {
        localStorage.setItem(`dailyshop_cart_${currentUser.uid}`, JSON.stringify(cart));
        const cartRef = doc(db, 'carts', currentUser.uid);
        await setDoc(cartRef, { items: cart }, { merge: true });
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    };

    saveCartToCloud();
  }, [cart, currentUser, authLoading]);

  const saveCategoriesToFirebase = async (updatedCategories) => {
    try {
      const catRef = doc(db, 'settings', 'categories');
      await setDoc(catRef, { list: updatedCategories }, { merge: true });
    } catch (error) {
      console.error("Error saving categories:", error);
    }
  };

  const categories = categoryData.map(c => c.name);

  const addToCart = (product) => {
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.some((item) => item.id === product.id);
      if (exists) {
        return safePrev;
      }
      return [...safePrev, { ...product, selected: true }];
    });
  };

  const toggleSelectItem = (index) => {
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.map((item, i) => {
        if (i === index) {
          return { ...item, selected: item.selected === undefined ? false : !item.selected };
        }
        return item;
      });
    });
  };

  const toggleSelectAll = (isSelected) => {
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.map((item) => ({ ...item, selected: isSelected }));
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter((_, i) => i !== index);
    });
  };

  const clearCart = () => setCart([]);

  const addProduct = async (newProd) => {
    try {
      const productWithSupplier = {
        ...newProd,
        supplierName: newProd.supplierName || 'General Supplier',
        supplierUrl: newProd.supplierUrl || '',
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'products'), productWithSupplier);
      setProducts((prev) => [{ ...productWithSupplier, id: docRef.id }, ...prev]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

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
    setOrders((prev) => prev.filter((o) => o.id !== id));
    try {
      await deleteDoc(doc(db, 'orders', id));
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

  const addCategory = async (categoryName) => {
    if (!categoryName) return;
    if (!categoryData.some(c => c.name.toLowerCase() === categoryName.toLowerCase())) {
      const updated = [...categoryData, { name: categoryName, subCategories: [] }];
      setCategoryData(updated);
      await saveCategoriesToFirebase(updated);
    }
  };

  const deleteCategory = async (categoryName) => {
    const updated = categoryData.filter((c) => c.name !== categoryName);
    setCategoryData(updated);
    await saveCategoriesToFirebase(updated);
  };

  const addSubCategory = async (categoryName, subCategoryName) => {
    if (!categoryName || !subCategoryName) return;
    const updated = categoryData.map((c) => {
      if (c.name === categoryName) {
        const subList = c.subCategories || [];
        if (!subList.includes(subCategoryName)) {
          return { ...c, subCategories: [...subList, subCategoryName] };
        }
      }
      return c;
    });
    setCategoryData(updated);
    await saveCategoriesToFirebase(updated);
  };

  const deleteSubCategory = async (categoryName, subCategoryName) => {
    const updated = categoryData.map((c) => {
      if (c.name === categoryName) {
        return {
          ...c,
          subCategories: (c.subCategories || []).filter((s) => s !== subCategoryName)
        };
      }
      return c;
    });
    setCategoryData(updated);
    await saveCategoriesToFirebase(updated);
  };

  const startCheckout = (items) => {
    const safeCart = Array.isArray(cart) ? cart : [];
    const itemsToBuy = (items || safeCart).filter(item => item.selected !== false);
    if (itemsToBuy.length === 0) {
      alert("doya kore kompokhokhe ekti product select korun!");
      return;
    }
    setCheckoutItems(itemsToBuy);
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
      selectedSubCategory, setSelectedSubCategory, searchQuery, setSearchQuery, cart: Array.isArray(cart) ? cart : [],
      selectedProduct, setSelectedProduct, activeTab, setActiveTab,
      orders, footerLinks, checkoutItems, loading, startCheckout,
      addToCart, removeFromCart, clearCart, addProduct, deleteProduct,
      addOrder, deleteOrder, addFooterLink, deleteFooterLink,
      addCategory, deleteCategory, addSubCategory, deleteSubCategory,
      checkAndUpdateStock, toggleSelectItem, toggleSelectAll
    }}>
      {children}
    </StoreContext.Provider>
  );
};
