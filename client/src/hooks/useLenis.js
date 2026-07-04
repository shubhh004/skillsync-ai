import { useEffect } from 'react';
import Lenis from 'lenis';

export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      smoothTouch: false,
      allowNestedScroll: true,
    });
    let rafId;
    function tick(time) { lenis.raf(time); rafId = requestAnimationFrame(tick); }
    rafId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);
}
