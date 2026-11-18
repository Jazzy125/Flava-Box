'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
export default function MotionLayer() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false; let cleanup: (() => void) | undefined;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return; gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-line', { y: 15, opacity: 0.3, duration: .65, stagger: .07, ease: 'power3.out', clearProps: 'all' });
        const hero = document.querySelector('.hero-art');
        if (hero) { gsap.fromTo(hero, { scale: 1.035 }, { scale: 1, duration: 1.3, ease: 'power2.out' }); gsap.to(hero, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }); }
        document.querySelectorAll('.reveal').forEach(el => gsap.from(el, { y: 15, duration: .6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 96%', once: true }, clearProps: 'transform' }));
        document.querySelectorAll('.stagger-group').forEach(el => gsap.from(el.children, { y: 14, stagger: .055, duration: .45, scrollTrigger: { trigger: el, start: 'top 98%', once: true }, clearProps: 'transform' }));
      });
      cleanup = () => mm.revert();
    });
    return () => { cancelled = true; cleanup?.(); };
  }, [pathname]); return null;
}
