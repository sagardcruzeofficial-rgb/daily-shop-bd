import React, { createContext, useState, useEffect } from 'react';
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
  const authLoading = auth ? (auth.loading || auth.initializing) : false;

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
  
  // সেফ কার্ট ইনিশিয়ালাইজেশন (সর্বদা অ্যারে নিশ্চিত করা হয়েছে)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('dailyShop_secure_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial products, orders & categories from Firebase
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

  // Sync Cart with Firestore based on Auth State
  useEffect(() => {
    if (authLoading) return;

    if (currentUser) {
      const cartRef = doc(db, 'carts', currentUser.uid);
      
      getDoc(cartRef).then((docSnap) => {
        if (docSnap.exists()) {
          const cloudItems = docSnap.data().items || [];
          const validItems = Array.isArray(cloudItems) ? cloudItems : [];
          setCart(validItems);
          localStorage.setItem('dailyShop_secure_cart', JSON.stringify(validItems));
        } else {
          const localCart = localStorage.getItem('dailyShop_secure_cart');
          if (localCart) {
            try {
              const parsed = JSON.parse(localCart);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setDoc(cartRef, { items: parsed }, { merge: true });
                setCart(parsed);
              }
            } catch (e) {}
          }
        }
      }).catch(err => {
        console.error("Cart fetch error:", err);
      });
    } else {
      // ইউজার লগআউট থাকলে কার্ট একদম ফাঁকা হয়ে যাবে
      setCart([]);
      try {
        localStorage.removeItem('dailyShop_secure_cart');
      } catch (e) {}
    }
  }, [currentUser, authLoading]);

  // Save cart changes
  useEffect(() => {
    if (loading || authLoading) return;

    if (currentUser && Array.isArray(cart)) {
      try {
        localStorage.setItem('dailyShop_secure_cart', JSON.stringify(cart));
      } catch (e) {}
      
      const saveCartToCloud = async () => {
        try {
          const cartRef = doc(db, 'carts', currentUser.uid);
          await setDoc(cartRef, { items: cart }, { merge: true });
        } catch (error) {
          console.error("Error saving cart to Firestore:", error);
        }
      };
      saveCartToCloud();
    }
  }, [cart, currentUser, loading, authLoading]);

  const saveCategoriesToFirebase = async (updatedCategories) => {
    try {
      const catRef = doc(db, 'settings', 'categories');
      await setDoc(catRef, { list: updatedCategories }, { merge: true });
    } catch (error) {
      console.error("Error saving categories to Firebase:", error);
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
      const docRef = await addDoc(collection(db, 'products'), {
        ...newProd,
        createdAt: new Date().toISOString()
      });
      setProducts((prev) => [{ ...newProd, id: docRef.id }, ...prev]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error("Error deleting product from Firebase:", error);
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
      console.error("Error deleting order from Firebase:", error);
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
