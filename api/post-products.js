import admin from 'firebase-admin';
import axios from 'axios';

// Firebase Admin SDK Initialization with filled credentials
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "daily-shop-bd",
      clientEmail: "firebase-adminsdk-fbsvc@daily-shop-bd.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC/5K0l7NtgxwPm\n/G+jUtksKBELCeLZG7YJ3yfjYTvhucZS2RuqjirOSWU6o7YfhcBH7yezGHlUKfkp\nRtPtqPWPly4MRdLKItuSHqC38kaYHgi9bEgRgjP/w58PZ49EsQUjXD++kgZJiQ6W\nXzqCMseiwQv/wyggGPSUiZwg9MCaSIxvRthJ86Xh80SW5nv5joUZrCWRc+YjIdTx\nUshXlIALBL4z80K21uD2ml+r3SeQ3APTrgc14VCwb8TfAT16J2HaotQpqpdS1SNH\nvJxeqMLhi8Q2QNhDccZLjwMKz5cGMQnUdwsx5ptQKqzbBJEQ1S1WCyj26vb1b+8e\nTozgYI5vAgMBAAECggEAF58rT11aXg3xpYgSqAzFTiG6g1zar3YxUQLG8r8f83f+\neWlfdf3dOBqh2veXLkc1NcWzYeET4m/uS437/agMXnoyQXGA8sAavmCF0U8CMKyV\nz9eaAYnBI+1tUaSiZsbRxpoPAMMSAhBcmtcrKSbeG2NfOkNIV7cquHQ+I3JtmTA5\nDyWwcZBCmI/c+SjmBsXauQhXL0NTdqj1M5neJMzMXOkU3lfjs5p5ZzOMyuwzvRnp\nOAtpSFVJ+JeRtAiRkDDsFrCfhn1x4ExfxEc94FUOnMF4jp7eNLqvwHilxdgVyl9C\n8yKh1lN9xfwizZG6SK8NFJyZoXAfaXojBC+wI3q95QKBgQD8N1eH/fvdNqbnZZN3\nOAL4vcLJ+wBqCGHLcprPGpiEiglSPvGqLOxZQTDdnDjnSofPL4phZyhnIo+y3sxo\nN5nb1gxyLpT1UyX1aXGc4iL1CU2Z3cHHqFh5LVBYbCr54dEVlHbUjibHRzwsTqq7\nbrWu3zX+1Lc0h+YEd85SvcZQjQKBgQDCxai47QS9znV86IjYsLsVVbzUnHra9/E+\nCq/8Myo+Lrvedx29rntjPiHPJ85Om6sH4lyxIM+32XHCdeynqxhf/8X1W5FABIgJ\nDdfukh5b0h2pYgS19aZ2eeQICiwbNzjdmLCdKvtWxcXwbf9/Vxjqwt+QqMlZoQHF\AXR1wThR6wKBgHfgIeVMDWK18Bw5Rh6664aoQqXXe/npo/mbrgLThDwyk32Y1yno\nEinV91DNSKp93RDXarEi46wpXB1LEeJS0vkOwnmetEPp0jfTdyF2xeCrHEwOf2TT\nGcH2jKKKPt7nuoXEO7qJGdtLe0kf1rwhQY8tHi/RkIYSNXxYKSNgeZqdAoGAcXyO\nJMIl4xprJo6vPeMr/vBoCFHs261gaU/83qxJTtYYLTWmpKEHz/mh5XxCH1dgvkVM\n0QBXR75xJGdlrwRoPXdgtufVqEF7qhrg2GdXPRUep1UvfX5Wse2vymdy76Crh6Ky\nNcGXlSXDgaX2GxJ6uD832KggOhMwXsPMQdiFomUCgYB3Z1Dc4cPScjGYBhB3vXw2\nZlj/BvDFPC79e2FdjEQRfB987/UWr1OaFWWNJ0nQuo6ng0CorGK4W7Y4fLCgzXt4\nDyHzPH4RqKpORknxTOTleD68wk/HG3PcbG+FmFZFS9kZ6umfO39edhhL1HXCUqHP\nXdxnvbKDyPmfqOrP6EpNJQ==\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n')
    })
  });
}

const db = admin.firestore();

// Facebook Credentials (Filled)
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

        // 5 second delay to avoid Facebook rate limits
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
