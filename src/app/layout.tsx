import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ShopProvider } from '@/components/Shop';
import Header from '@/components/Header';
import { Footer } from '@/components/Brand';
import ShopLayers from '@/components/ShopLayers';
import MotionLayer from '@/components/MotionLayer';
import { siteUrl } from '@/data/business';
import './globals.css';
import '@/styles/shop.css';
import '@/styles/pages.css';
export const metadata: Metadata = { metadataBase: new URL(siteUrl()), title: { default: 'Flava Box Luton | Flavour Loaded', template: '%s | Flava Box Luton' }, description: 'Flavour-packed takeaway in Luton. Explore loaded fries, wings, chops, prawns and custom Flava Boxes, then start your order enquiry.', openGraph: { type: 'website', locale: 'en_GB', siteName: 'Flava Box Luton', images: [{ url: '/images/hero-combo.webp', width: 1672, height: 941, alt: 'Flava Box loaded takeaway box serving inspiration' }] }, twitter: { card: 'summary_large_image' }, icons: { icon: '/icon.svg' } };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#101010' };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en-GB"><head><link rel="preload" href="/fonts/anton.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><a className="skip-link" href="#main-content">Skip to content</a><ShopProvider><Header/><main id="main-content">{children}</main><Footer/><ShopLayers/><MotionLayer/></ShopProvider></body></html>;
}
