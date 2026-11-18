'use client';
import Link from 'next/link';
import { Plus, ArrowUpRight } from 'lucide-react';
import { FoodImage } from './Brand';
import { useShop } from './Shop';
import type { Food } from '@/data/menu';
import { money } from '@/data/business';
export default function FoodCard({ food, numbered }: { food: Food; numbered?: number }) {
  const { add, configure } = useShop();
  return <article className="food-card"><Link href={'/menu/'+food.id} className="food-card-image" aria-label={'View '+food.name}><FoodImage src={food.image} alt={'Serving suggestion for '+food.name}/>{numbered !== undefined && <span className="photo-index">F / {String(numbered+1).padStart(2,'0')}</span>}<span className="food-image-arrow"><ArrowUpRight size={17}/></span></Link><div className="food-card-info"><div className="food-meta">{food.category}</div><h3><Link href={'/menu/'+food.id}>{food.name}</Link></h3><p>{food.description}</p><div className="food-card-bottom"><span className="food-price">{money(food.price)}</span><button className="add-food" aria-label={`${food.choices.length ? 'Customise' : 'Add'} ${food.name}${food.choices.length ? '' : ' to bag'}`} onClick={() => food.choices.length ? configure(food) : add(food)}><Plus size={16}/><span>{food.choices.length ? 'CUSTOMISE' : 'ADD TO BAG'}</span></button></div></div></article>;
}
