'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
export function Overlay({ children, onClose, label, drawer = false, className = '' }: { children: ReactNode; onClose: () => void; label: string; drawer?: boolean; className?: string }) {
  const panel = useRef<HTMLDivElement>(null); const close = useRef(onClose); close.current = onClose;
  useEffect(() => {
    const active = document.activeElement as HTMLElement | null;
    const before = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const selector = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]';
    const timer = setTimeout(() => panel.current?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true }), 70);
    function keyboard(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); close.current(); }
      if (e.key === 'Tab' && panel.current) { const items = Array.from(panel.current.querySelectorAll<HTMLElement>(selector)).filter(el => el.offsetParent !== null); const first = items[0], last = items[items.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); } }
    }
    document.addEventListener('keydown', keyboard);
    return () => { clearTimeout(timer); document.removeEventListener('keydown', keyboard); document.body.style.overflow = before; active?.focus({ preventScroll: true }); };
  }, []);
  return <motion.div className={'overlay ' + (drawer ? 'drawer-overlay ' : '') + className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }} onMouseDown={e => { if (e.currentTarget === e.target) onClose(); }}><motion.div role="dialog" aria-modal="true" aria-label={label} className={'overlay-panel ' + (drawer ? 'drawer-panel' : '')} ref={panel} initial={drawer ? { x: '100%' } : { y: 16 }} animate={drawer ? { x: 0 } : { y: 0 }} exit={drawer ? { x: '100%' } : { y: 12 }} transition={{ duration: .25, ease: [.22, 1, .36, 1] }}>{children}</motion.div></motion.div>;
}
