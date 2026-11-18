import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { ArrowUpRight, Phone, Flame } from 'lucide-react';
export function Instagram({ size = 20 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.6" cy="6.6" r=".85" fill="currentColor" stroke="none"/></svg>; }
import { business } from '@/data/business';

export function Wordmark() {
  return <span className="wordmark" aria-label="Flava Box Luton"><span className="wordmark-name">FLAVA <b>BOX</b></span><span className="wordmark-town"><i />LUTON<i /></span></span>;
}
export function Kicker({ children }: { children: ReactNode }) { return <div className="kicker"><i aria-hidden="true" />{children}</div>; }
export function FoodImage({ src, alt, sizes, priority = false, className = '' }: { src: string; alt: string; sizes?: string; priority?: boolean; className?: string }) {
  return <Image src={src} alt={alt} fill sizes={sizes || '(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw'} priority={priority} className={'food-image ' + className} />;
}
export function Stamp() {
  return <div className="flava-stamp" aria-label="Flava Box Luton, flavour loaded"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><path id="stamp-ring" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" /></defs><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="50" cy="50" r="31" fill="none" stroke="currentColor" strokeWidth="1"/><text fontSize="9.3" fontWeight="700" letterSpacing="1.7" fill="currentColor"><textPath href="#stamp-ring" textLength="237">FLAVOUR LOADED ✦ FLAVA BOX LUTON ✦ </textPath></text></svg><Flame size={40} strokeWidth={1.7} /></div>;
}
export function Breadcrumbs({ page, parent }: { page: string; parent?: { href: string; name: string } }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span>{parent && <><Link href={parent.href}>{parent.name}</Link><span>/</span></>}<span aria-current="page">{page}</span></nav>;
}
export const navLinks = [{ href: '/', name: 'Home' }, { href: '/menu', name: 'Menu' }, { href: '/meal-deals', name: 'Meal Deals' }, { href: '/about', name: 'About' }, { href: '/contact', name: 'Contact' }];
export function Footer() {
  return <footer className="footer"><div className="wrap"><div className="footer-top"><div className="footer-brand"><Link href="/" aria-label="Flava Box home"><Wordmark /></Link><p>Big flavour. Loaded boxes.<br />Straight out of Luton.</p></div><div><h3>EXPLORE</h3><div className="footer-nav">{navLinks.map(link => <Link key={link.href} href={link.href}>{link.name}</Link>)}</div></div><div><h3>THE OPENING LINE-UP</h3><p>{business.days}<br /><strong>{business.hours}</strong></p><p>Pre-order before {business.preorder}.</p></div><div><h3>GET IN TOUCH</h3><a href={business.phoneHref}><Phone size={15} />{business.phone}</a><a href={business.instagram} target="_blank" rel="noreferrer"><Instagram size={15} />{business.handle}<ArrowUpRight size={13} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Flava Box Luton</span><span>Food imagery is illustrative. Prices and availability confirmed on acceptance.</span></div></div></footer>;
}
