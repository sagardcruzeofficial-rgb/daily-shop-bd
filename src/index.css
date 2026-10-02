import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { createProductSlug } from '../utils/slugify';

export default function ProductCard({ product }) {
  const { addToCart, startCheckout } = useContext(StoreContext);

  if (!product) return null;

  const handleProductClick = () => {
    const title = product.name || product.title || 'product';
    const slug = createProductSlug(title, product.id);

    // Direct product URL
    window.history.pushState(
      { productId: product.id },
      '',
      `/product/${slug}`
    );

    // App.jsx-এর route handler চালু করা
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="crystal-surface bg-white/90 dark:bg-gray-900/90 border border-slate-200/80 dark:border-gray-800 rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#f57224] dark:hover:border-[#f57224] hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(245,114,36,0.16)] transition-all duration-300 flex flex-col justify-between group">

      <div
        className="cursor-pointer relative overflow-hidden"
        onClick={handleProductClick}
        role="link"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleProductClick();
          }
        }}
      >
        <div className="relative w-full h-36 sm:h-44 bg-slate-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={product.image}
            alt={product.title || product.name || 'Product'}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>

        {product.subCategory && (
          <span className="absolute top-2.5 left-2.5 bg-black/80 text-white text-[9px] px-2.5 py-1 rounded-full font-bold backdrop-blur-md border border-white/10 shadow-sm">
            {product.subCategory}
          </span>
        )}

        <div className="p-2.5 sm:p-3">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block mb-0.5">
            {product.category}
          </span>

          <h3 className="text-[11px] sm:text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-2 min-h-[2rem] group-hover:text-[#f57224] transition">
            {product.title || product.name}
          </h3>

          <p className="text-sm sm:text-base font-black text-[#f57224] mt-1">
            ৳{product.price}
          </p>
        </div>
      </div>

      <div className="p-2.5 sm:p-3 pt-0 grid grid-cols-2 gap-1.5 sm:gap-2">
        <button
          onClick={() => addToCart && addToCart(product)}
          className="bg-orange-50 dark:bg-gray-800 border border-orange-200 dark:border-gray-700 text-[#f57224] text-[10px] sm:text-[11px] font-bold py-2 rounded-lg sm:rounded-xl hover:bg-[#f57224] hover:text-white transition shadow-sm active:translate-y-[1px]"
        >
          Add to Cart
        </button>

        <button
          onClick={() => startCheckout && startCheckout([product])}
          className="bg-[#f57224] text-white text-[10px] sm:text-[11px] font-bold py-2 rounded-lg sm:rounded-xl border border-orange-600 hover:bg-orange-600 transition shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_4px_10px_rgba(245,114,36,0.3)] active:translate-y-[1px]"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
