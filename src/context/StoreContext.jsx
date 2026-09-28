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
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const auth = useAuth();
  const currentUser = auth ? auth.currentUser : null;
  const isAuthLoading = auth ? (auth.loading || auth.initializing) : false;

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

  // Initial Cart load: রিফ্রেশের সাথে সাথে যাতে ইনস্ট্যান্ট ডাটা থাকে, তাই ইউজারের UID ভিত্তিক লোকালস্টোরেজ চেক করা হচ্ছে
  const [cart, setCart] = useState(() => {
    // Note: Initial render-এ currentUser সরাসরি পাওয়া না গেলে ব্রাউজার স্টোরেজ থেকে সেভড কার্ট তোলার চেষ্টা করা যেতে পারে
    try {
      const keys = Object.keys(localStorage);
      const userCartKey = keys.find(k => k.startsWith('dailyShopCart_'));
      if (userCartKey) {
        const saved = localStorage.getItem(userCartKey);
        if (saved) return JSON.parse(saved);
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

  // Sync Cart with Firestore based on User Authentication State
  useEffect(() => {
    if (isAuthLoading) return;

    if (currentUser) {
      // ইউজার লগইন থাকা অবস্থায় লোকালস্টোরেজ থেকে তার নিজের কার্ট তুলে দেওয়া যাতে রিফ্রেশে একচুলও ডাটা না হারায়
      const localKey = `dailyShopCart_${currentUser.uid}`;
      const savedLocalCart = localStorage.getItem(localKey);
      if (savedLocalCart) {
        try {
          setCart(JSON.parse(savedLocalCart));
        } catch (e) {
          console.error(e);
        }
      }

      // Firestore থেকে রিয়েল-টাইম সিঙ্ক
      const cartRef = doc(db, 'carts', currentUser.uid);
      const unsubscribe = onSnapshot(cartRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudItems = docSnap.data().items || [];
          setCart(cloudItems);
          localStorage.setItem(localKey, JSON.stringify(cloudItems));
        } else {
          // যদি ক্লাউডে না থাকে কিন্তু লোকালস্টোরেজে থাকে, ক্লাউডে সেভ করে দিবে
          if (savedLocalCart) {
            try {
              const parsed = JSON.parse(savedLocalCart);
              if (parsed.length > 0) {
                setDoc(cartRef, { items: parsed }, { merge: true });
              }
            } catch (err) {}
          }
        }
      }, (error) => {
        console.error("Error listening to cart changes:", error);
      });

      return () => unsubscribe();
    } else {
      // রিয়েল লগআউট করলে সব ক্লিয়ার হবে
      setCart([]);
      // লগআউটের সময় আগের সব ইউজারের লোকাল কার্ট কি পরিষ্কার করে দেওয়া ভালো
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('dailyShopCart_')) {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {}
    }
  }, [currentUser, isAuthLoading]);

  // Save cart changes to Firestore and LocalStorage whenever cart is modified
  useEffect(() => {
    if (loading || isAuthLoading) return;

    if (currentUser) {
      const localKey = `dailyShopCart_${currentUser.uid}`;
      localStorage.setItem(localKey, JSON.stringify(cart));

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
  }, [cart, currentUser, loading, isAuthLoading]);

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
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev;
      }
      return [...prev, { ...product, selected: true }];
    });
  };

  const toggleSelectItem = (index) => {
    setCart((prev) => prev.map((item, i) => {
      if (i === index) {
        return { ...item, selected: item.selected === undefined ? false : !item.selected };
      }
      return item;
    }));
  };

  const toggleSelectAll = (isSelected) => {
    setCart((prev) => prev.map((item) => ({ ...item, selected: isSelected })));
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
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
    const itemsToBuy = (items || cart).filter(item => item.selected !== false);
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
      selectedSubCategory, setSelectedSubCategory, searchQuery, setSearchQuery, cart,
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
