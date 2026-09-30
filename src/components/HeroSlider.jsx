import React, { useState, useEffect } from 'react';

export default function HeroSlider({ setSelectedCategory }) {
  const slides = [
    {
      title: "Latest Gadget Best Price",
      subtitle: "Smart Life, Smarter Choice at DailyShopBD",
      bg: "bg-gradient-to-r from-gray-900 via-indigo-950 to-blue-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
    },
    {
      title: "Trendy Fashion Collection",
      subtitle: "Stylish, Comfortable & Affordable Products",
      bg: "bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60"
    }
  ];

  const quickCats = [
    { name: 'Smartphone', icon: '📱' },
    { name: 'Laptop', icon: '💻' },
    { name: 'Headphone', icon: '🎧' },
    { name: 'Smart Watch', icon: '⌚' },
    { name: 'Camera', icon: '📷' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Home Appliance', icon: '⚡' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[currentIndex];

  return (
    <div className="w-full mb-6">
      {/* Hero Slider Banner */}
      <div className={`${current.bg} text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden transition-all duration-700 min-h-[220px] border border-gray-800`}>
        <div className="space-y-3 z-10 max-w-lg">
          <span className="bg-[#f57224] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">New Arrival</span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">{current.title}</h2>
          <p className="text-xs text-gray-300 font-medium">{current.subtitle}</p>
          <button className="bg-[#f57224] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center gap-2 active:translate-y-[1px]">
            Shop Now →
          </button>
        </div>
        <div className="mt-4 md:mt-0 z-10">
          <img src={current.image} alt="Banner" className="w-44 h-32 md:w-60 md:h-40 object-cover rounded-xl shadow-xl border-2 border-white/10" />
        </div>
      </div>

      {/* Quick Category Icons Row */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mt-4">
        {quickCats.map((cat) => (
          <div 
            key={cat.name}
            onClick={() => setSelectedCategory && setSelectedCategory(cat.name)}
            className="bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm border-2 border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#f57224] dark:hover:border-[#f57224] hover:shadow-md transition text-center group active:translate-y-[1px]"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
            <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
