import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { FB_PAGE_ID, FB_ACCESS_TOKEN } = process.env;
  if (!FB_PAGE_ID || !FB_ACCESS_TOKEN) {
    return res.status(503).json({
      success: false,
      message: 'Facebook server configuration is missing'
    });
  }

  const { name, price, description, image, productUrl } = req.body || {};
  if (!name || !price || !image || !productUrl) {
    return res.status(400).json({
      success: false,
      message: 'Product name, price, image, and product URL are required'
    });
  }

  let parsedProductUrl;
  try {
    parsedProductUrl = new URL(productUrl);
    if (!['http:', 'https:'].includes(parsedProductUrl.protocol)) throw new Error('Invalid protocol');
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid product URL' });
  }

  const message = `🔥 নতুন প্রোডাক্ট এসে গেছে! 🔥\n\n📌 ${name}\n💰 দাম: ৳${price}\n📝 ${description || 'খুব শীঘ্রই অর্ডার করুন।'}\n\n🛒 BUY NOW / অর্ডার করতে এখানে ক্লিক করুন:\n${parsedProductUrl.toString()}`;

  try {
    const { data } = await axios.post(
      `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/feed`,
      new URLSearchParams({
        message,
        link: parsedProductUrl.toString(),
        picture: image,
        access_token: FB_ACCESS_TOKEN
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (!data?.id) {
      return res.status(502).json({ success: false, message: 'Facebook rejected the post' });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    const message = error.response?.data?.error?.message || 'Facebook request failed';
    return res.status(502).json({ success: false, message });
  }
}

