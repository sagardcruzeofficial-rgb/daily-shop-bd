import admin from 'firebase-admin';
import axios from 'axios';

// Vercel Environment Variables theke Firebase credentials load korbe
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
    })
  });
}

const db = admin.firestore();

// Apnar Facebook Page credentials
const PAGE_ACCESS_TOKEN = 'EAApyQMKnZA0wBShw3Pd0EM6dzByts3GiwnZCkoOUtB18tBhvm4l8TKRzZBFINPZAbj8PE25FSs1Vu4aV0Y0gXgX5mZB4WDYkVNGf0OZBQi5RO2nZAcIVdIkK02pm8SuZBFGsl5Uy1BadxMMpo5ulw7HsQIXbD0oPOkEaqPtsf7cuqZC2PYQ7lQu4ARNsVROAK7a0pdtxZAGL53jAc4oVhUrHlTNgOgUsxbYtCDDH5fpAZDZD';
const PAGE_ID = '61594581823761';

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection('products').get();

    if (snapshot.empty) {
      return res.status(200).json({ message: 'Kono product pawa jayni!' });
    }

    let postedCount = 0;

    for (const doc of snapshot.docs) {
      const product = doc.data();
      postedCount++;

      const title = product.title || 'Product Name';
      const price = product.price || '0';
      const description = product.description || '';
      const productUrl = product.productUrl || 'https://daily-shop-bd-live.vercel.app/';

      const message = `${title} | ৳ ${price}\n\n${description}\n\n🛒 Buy Now: ${productUrl}`;

      try {
        await axios.post(`https://graph.facebook.com/v18.0/${PAGE_ID}/feed`, {
          message: message,
          access_token: PAGE_ACCESS_TOKEN
        });

        // Rate limit avoid korar jonno 5 second delay
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (fbError) {
        console.error('FB Post Error:', fbError.response ? fbError.response.data : fbError.message);
      }
    }

    return res.status(200).json({ success: true, message: `${postedCount} ti product successful-bhabe Facebook-e post kora hoyeche!` });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
