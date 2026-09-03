'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('splashShown')) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => {
        setShow(false);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('splashShown', 'true');
        }
      }, 500);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{ opacity, transition: 'opacity 0.5s ease-in-out' }}
      className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center overscroll-contain pointer-events-none"
    >
      <div className="relative flex items-center justify-center">
        {/* Spinning Ring */}
        <div className="absolute w-28 h-28 rounded-full border-4 border-slate-100 border-t-[#550000] animate-spin" />
        
        {/* Logo */}
        <div className="relative w-14 h-14 rounded-full bg-[#ddc192]/20 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-[#550000] animate-pulse" />
        </div>
      </div>
      <div className="mt-8 text-slate-500 font-bold text-xs tracking-widest uppercase">
        Memuat Sistem SAFINA...
      </div>
    </div>
  );
}
