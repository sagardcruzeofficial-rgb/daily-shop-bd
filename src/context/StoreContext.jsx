// Fetch cart based on user login state (Firebase for logged in, LocalStorage for guest)
  useEffect(() => {
    const fetchUserCart = async () => {
      const localCart = localStorage.getItem('dailyShopCart');
      let parsedLocalCart = [];
      try {
        parsedLocalCart = localCart ? JSON.parse(localCart) : [];
      } catch (e) {
        parsedLocalCart = [];
      }

      if (currentUser) {
        try {
          const cartRef = doc(db, 'carts', currentUser.uid);
          const cartSnap = await getDoc(cartRef);
          
          if (cartSnap.exists()) {
            const cloudItems = cartSnap.data().items || [];
            // ক্লাউড কার্ট এবং লোকাল কার্ট মিলিয়ে ফেলুন যেন কোনোটা হারিয়ে না যায়
            const mergedCart = [...cloudItems];
            parsedLocalCart.forEach(localItem => {
              if (!mergedCart.some(item => item.id === localItem.id)) {
                mergedCart.push(localItem);
              }
            });
            setCart(mergedCart);
          } else {
            // যদি ক্লাউডে কার্ট না থাকে, তবে লোকাল কার্টটাই ক্লাউডে সেভ করে দিন
            setCart(parsedLocalCart);
          }
        } catch (error) {
          console.error("Error fetching cart from Firestore:", error);
          setCart(parsedLocalCart);
        }
      } else {
        setCart(parsedLocalCart);
      }
    };

    fetchUserCart();
  }, [currentUser]);
