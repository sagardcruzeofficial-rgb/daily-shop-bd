import React, { useEffect, useMemo, useState } from 'react';

export default function HeroSlider({ products = [], onProductClick }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const frames = useMemo(() => {
    const latest = products.slice(0, 15);
    return Array.from({ length: 3 }, (_, index) => latest.slice(index * 5, index * 5 + 5)).filter((frame) => frame.length > 0);
  }, [products]);

  useEffect(() => {
    setFrameIndex(0);
  }, [products]);

  useEffect(() => {
    if (frames.length < 2) return undefined;
    const timer = setInterval(() => setFrameIndex((index) => (index + 1) % frames.length), 5000);
    return () => clearInterval(timer);
  }, [frames.length]);

  const currentFrame = frames[frameIndex] || [];

  if (currentFrame.length === 0) {
    return (
      <section className="flex min-h-[190px] items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div><p className="text-xs font-bold text-slate-500 dark:text-slate-400">Latest product images will appear here</p><p className="mt-1 text-[11px] text-slate-400">Add products from the Admin Panel to start the three-frame slider.</p></div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,.08)] dark:border-slate-700 dark:bg-slate-900 sm:p-4">
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
        <div><span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f57224]">Latest arrivals</span><h2 className="text-sm font-black text-slate-900 dark:text-white">New products</h2></div>
        <span className="text-[10px] font-semibold text-slate-400">Frame {frameIndex + 1} of 3</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {currentFrame.map((product) => {
          const title = product.name || product.title || 'DailyShopBD Product';
          return (
            <button key={product.id} type="button" onClick={() => onProductClick?.(product)} className="group min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
              <div className="flex h-24 items-center justify-center bg-slate-50 p-2 dark:bg-slate-900 sm:h-28"><img src={product.image} alt={title} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" /></div>
              <div className="p-2"><p className="truncate text-[10px] font-bold text-slate-700 dark:text-slate-200">{title}</p><p className="mt-1 text-[11px] font-black text-[#f57224]">৳{product.price ?? '—'}</p></div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((index) => <button key={index} type="button" aria-label={`Show product frame ${index + 1}`} onClick={() => index < frames.length && setFrameIndex(index)} className={`h-1.5 rounded-full transition-all ${frameIndex === index ? 'w-7 bg-[#f57224]' : 'w-1.5 bg-slate-300 dark:bg-slate-600'}`} />)}
      </div>
    </section>
  );
}
