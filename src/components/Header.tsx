'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, ShoppingBag, X, Phone } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wordmark, navLinks } from './Brand';
import { useShop } from './Shop';
import { business } from '@/data/business';
export default function Header() {
  const path = usePathname(); const { count, setBagOpen } = useShop(); const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { const update = () => { setScrolled(window.scrollY > 16); const h = document.documentElement.scrollHeight - window.innerHeight; document.documentElement.style.setProperty('--page-progress', h > 0 ? String(window.scrollY/h) : '0'); }; update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  useEffect(() => { if (!open) return; const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close); }, [open]);
  const active = (href: string) => href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
  return <header className={'site-header ' + (scrolled ? 'is-scrolled' : '')}><div className="header-inner wrap"><Link className="brand-link" href="/" aria-label="Flava Box Luton home"><Wordmark /></Link><nav className="desktop-nav" aria-label="Main navigation">{navLinks.map(l => <Link key={l.href} href={l.href} aria-current={active(l.href) ? 'page' : undefined} className={active(l.href) ? 'active' : ''}>{l.name}</Link>)}</nav><div className="header-actions"><button className="bag-trigger" onClick={() => { setOpen(false); setBagOpen(true); }} aria-label={`Open shopping bag, ${count} items`}><ShoppingBag size={22} strokeWidth={1.7} /><span>{count}</span></button><Link href="/menu" className="btn btn-orange header-order">ORDER NOW <ArrowUpRight size={18} /></Link><button className="mobile-menu-toggle icon-btn" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-controls="mobile-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></div><AnimatePresence>{open && <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }}>{navLinks.map((l,i) => <Link href={l.href} key={l.href} className={active(l.href) ? 'active' : ''} onClick={() => setOpen(false)}><span>0{i+1}</span>{l.name}<ArrowUpRight size={20}/></Link>)}<a className="mobile-call" href={business.phoneHref}><Phone size={16} />{business.phone}</a></motion.nav>}</AnimatePresence><div className="scroll-progress" /></header>;
}
