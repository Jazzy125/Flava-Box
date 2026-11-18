import type { Metadata } from 'next';
import { getMenu } from '@/lib/catalog';
import { categories } from '@/data/menu';
import { siteUrl } from '@/data/business';
import PageIntro from '@/components/PageIntro';
import MenuBrowser from '@/components/MenuBrowser';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'The Menu — Loaded Fries, Wings & Boxes', description: 'Browse the complete Flava Box Luton takeaway menu, from loaded fries and custom combo boxes to wings, lamb chops, Cajun prawns, sides and dips.', alternates: { canonical: '/menu' }, openGraph: { title: 'The Flava Menu | Flava Box Luton', description: 'Find your next flavour fix. Explore all 24 items on the Flava Box menu.', images: ['/images/loaded-fries.webp'] } };
export default async function MenuPage({ searchParams }: { searchParams: Promise<Record<string,string | string[] | undefined>> }) {
  const [foods, params] = await Promise.all([getMenu(), searchParams]);
  const cat = typeof params.category === 'string' && categories.some(c => c === params.category) ? params.category : 'All';
  const q = params.pick === 'seafood' ? 'prawn' : typeof params.q === 'string' ? params.q.slice(0,80) : '';
  const schema = { '@context': 'https://schema.org', '@type': 'Menu', name: 'Flava Box Luton Menu', hasMenuSection: categories.map(c => ({ '@type': 'MenuSection', name: c, hasMenuItem: foods.filter(f => f.category === c).map(f => ({ '@type': 'MenuItem', name: f.name, description: f.description, url: siteUrl()+'/menu/'+f.id, offers: { '@type': 'Offer', price: (f.price/100).toFixed(2), priceCurrency: 'GBP' } })) })) };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g,'\\u003c') }}/><PageIntro page="Menu" label="CHOOSE YOUR FLAVA" title="THE FLAVA MENU." description="Loaded boxes, bold flavours and all the extras. Your next favourite is right here." image="loaded-fries"/><MenuBrowser key={cat+q} foods={foods} initialCategory={cat} initialQuery={q}/></>;
}
