// 1. Fetch cart on load (LocalStorage for guests, or fallback)
  useEffect(() => {
    if (!currentUser) {
      const localCart = localStorage.getItem('dailyShopCart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (e) {
          setCart([]);
        }
      }
    }
  }, [currentUser]);

  // 2. Real-time sync cart with Firestore using onSnapshot when logged in
  useEffect(() => {
    if (!currentUser) return;

    const cartRef = doc(db, 'carts', currentUser.uid);
    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudItems = docSnap.data().items || [];
        setCart(cloudItems);
        // ক্লাউড ডেটা লোকালস্টোরেজেও সেভ করে রাখব ব্যাকআপের জন্য
        localStorage.setItem('dailyShopCart', JSON.stringify(cloudItems));
      } else {
        // ক্লাউডে না থাকলে লোকাল কার্ট থাকলে সেটা আপলোড করে দেবো
        const localCart = localStorage.getItem('dailyShopCart');
        if (localCart) {
          try {
            const parsedLocal = JSON.parse(localCart);
            if (parsedLocal.length > 0) {
              setCart(parsedLocal);
              setDoc(cartRef, { items: parsedLocal }, { merge: true });
            }
          } catch (e) {}
        }
      }
    }, (error) => {
      console.error("Error listening to cart changes:", error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 3. Save cart to LocalStorage & Firestore whenever cart changes
  useEffect(() => {
    if (loading) return;

    // সর্বদা লোকালস্টোরেজে সেভ করব যাতে রিফ্রেশ করলে মুছে না যায়
    localStorage.setItem('dailyShopCart', JSON.stringify(cart));

    const saveCartToCloud = async () => {
      if (currentUser) {
        try {
          const cartRef = doc(db, 'carts', currentUser.uid);
          await setDoc(cartRef, { items: cart }, { merge: true });
        } catch (error) {
          console.error("Error saving cart to Firestore:", error);
        }
      }
    };

    saveCartToCloud();
  }, [cart, currentUser, loading]);
