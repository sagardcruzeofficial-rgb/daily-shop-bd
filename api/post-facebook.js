import axios from 'axios';

const GRAPH_VERSION = process.env.FB_GRAPH_VERSION || 'v26.0';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { FB_PAGE_ID, FB_ACCESS_TOKEN } = process.env;
  if (!FB_PAGE_ID || !FB_ACCESS_TOKEN) {
    return res.status(503).json({ success: false, message: 'Facebook server configuration is missing' });
  }

  const { name, price, description, image, productUrl } = req.body || {};
  if (!name || price === undefined || !productUrl) {
    return res.status(400).json({ success: false, message: 'Product name, price, and product URL are required' });
  }

  let parsedProductUrl;
  try {
    parsedProductUrl = new URL(productUrl);
    if (!['http:', 'https:'].includes(parsedProductUrl.protocol)) throw new Error('Invalid protocol');
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid product URL' });
  }

  const message = `🔥 নতুন প্রোডাক্ট এসে গেছে! 🔥\n\n📌 ${name}\n💰 দাম: ৳${price}\n📝 ${description || 'খুব শীঘ্রই অর্ডার করুন।'}\n\n🛒 BUY NOW / অর্ডার করতে এখানে ক্লিক করুন:\n${parsedProductUrl.toString()}`;
  const isPublicImageUrl = typeof image === 'string' && /^https?:\/\//i.test(image);

  try {
    const endpoint = isPublicImageUrl ? `${FB_PAGE_ID}/photos` : `${FB_PAGE_ID}/feed`;
    const payload = {
      message,
      access_token: FB_ACCESS_TOKEN,
      ...(isPublicImageUrl ? { url: image } : { link: parsedProductUrl.toString() })
    };

    const { data } = await axios.post(
      `https://graph.facebook.com/${GRAPH_VERSION}/${endpoint}`,
      new URLSearchParams(payload).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const postId = data?.post_id || data?.id;
    if (!postId) return res.status(502).json({ success: false, message: 'Facebook rejected the post' });

    return res.status(200).json({ success: true, id: postId, postUrl: `https://www.facebook.com/${postId}` });
  } catch (error) {
    const message = error.response?.data?.error?.message || 'Facebook request failed';
    return res.status(502).json({ success: false, message });
  }
}
