// Fetch cart from Firebase strictly based on the logged-in user
  useEffect(() => {
    const fetchUserCart = async () => {
      if (currentUser) {
        try {
          const cartRef = doc(db, 'carts', currentUser.uid);
          const cartSnap = await getDoc(cartRef);
          
          if (cartSnap.exists()) {
            // ইউজারের ফায়ারবেসে কার্ট থাকলে সেটাই সেট হবে
            setCart(cartSnap.data().items || []);
          } else {
            // যদি ক্লাউডে কার্ট না থাকে (নতুন ইউজার), তবে কার্ট খালি থাকবে
            setCart([]);
          }
        } catch (error) {
          console.error("Error fetching cart from Firestore:", error);
          setCart([]);
        }
      } else {
        // ইউজার লগআউট করা থাকলে বা গেস্ট হলে কার্ট খালি থাকবে
        setCart([]);
      }
    };

    fetchUserCart();
  }, [currentUser]);

  // Save cart to Firestore automatically whenever cart changes and user is logged in
  useEffect(() => {
    if (loading) return; 
    
    const saveCartToCloud = async () => {
      if (currentUser) {
        try {
          const cartRef = doc(db, 'carts', currentUser.uid);
          // ইউজারের নিজস্ব UID-এর আন্ডারে সরাসরি কার্ট আইটেমগুলো সেভ হবে
          await setDoc(cartRef, { items: cart }, { merge: true });
        } catch (error) {
          console.error("Error saving cart to Firestore:", error);
        }
      }
    };

    saveCartToCloud();
  }, [cart, currentUser, loading]);
