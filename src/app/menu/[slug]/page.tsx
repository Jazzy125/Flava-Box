import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { getFood, getMenu } from '@/lib/catalog';
import { Breadcrumbs, FoodImage, Kicker } from '@/components/Brand';
import { money } from '@/data/business';
import ItemBuilder from '@/components/ItemBuilder';
import FoodCard from '@/components/FoodCard';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const food = await getFood(slug); if (!food) return { title: 'Menu item not found' }; return { title: food.name+' — '+money(food.price), description: food.description+' Browse and customise your takeaway order at Flava Box Luton.', alternates: { canonical: '/menu/'+food.id }, openGraph: { title: food.name+' | Flava Box Luton', description: food.description, images: [food.image] } }; }
export default async function ItemPage({ params }: Props) {
  const { slug } = await params; const food = await getFood(slug); if (!food) notFound(); const others = (await getMenu()).filter(f => f.id !== food.id).sort((a,b) => Number(b.category === food.category)-Number(a.category === food.category)).slice(0,3);
  return <div className="item-page"><div className="wrap"><Breadcrumbs page={food.name} parent={{ href:'/menu',name:'Menu' }}/><div className="item-layout"><div className="detail-visual"><div className="detail-image"><FoodImage src={food.image} alt={food.name+' serving inspiration'} sizes="(max-width: 760px) 90vw, 47vw" priority/><span className="photo-tag">FLAVA BOX / THE MENU EDIT</span></div><div className="image-credit">SERVING INSPIRATION <i/> FLAVA BOX LUTON</div></div><div className="detail-info"><Kicker>{food.category}</Kicker><h1>{food.name}<span className="orange">.</span></h1><span className="detail-price">{money(food.price)}</span><p className="detail-description">{food.description}</p><ItemBuilder key={food.id} food={food}/><div className="order-assurance"><ShieldCheck size={16}/>No payment taken. Orders are confirmed by the team.</div></div></div></div><section className="section related-section"><div className="wrap"><Kicker>KEEP EXPLORING</Kicker><div className="section-head"><h2>MORE OF THE GOOD STUFF.</h2><Link href="/menu" className="text-link"><ArrowLeft size={14}/>BACK TO MENU</Link></div><div className="menu-grid">{others.map(f => <FoodCard key={f.id} food={f}/>)}</div></div></section></div>;
}
