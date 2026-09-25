import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({ success: false, message: 'URL required' });
  }

  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const $ = cheerio.load(data);

    let sizes = [];

    $('.size-option, .product-size, select[name="size"] option, .swatch-attribute-options div').each((i, el) => {
      const text = $(el).text().trim();
      if (text && !text.includes('Select') && !text.includes('Out of Stock')) {
        sizes.push(text);
      }
    });

    return res.status(200).json({
      success: true,
      sizes: sizes.length > 0 ? sizes : ['M', 'L', 'XL', 'XXL']
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
