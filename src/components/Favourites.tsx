'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { type Food } from '@/data/menu';
import { Kicker } from './Brand';
import FoodCard from './FoodCard';
export default function Favourites({ foods }: { foods: Food[] }) {
  const rail = useRef<HTMLDivElement>(null); const [edges, setEdges] = useState([true, false]);
  const update = () => { const el = rail.current; if (el) setEdges([el.scrollLeft < 3, el.scrollLeft+el.clientWidth >= el.scrollWidth-3]); };
  useEffect(() => { update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, []);
  const slide = (direction: number) => { const el = rail.current; if (el) el.scrollBy({ left: direction*((el.firstElementChild as HTMLElement)?.offsetWidth + 20), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); };
  return <section className="section favourites" id="favourites"><div className="wrap"><Kicker>THE CROWD LINE-UP</Kicker><div className="section-head"><div><h2>THE FLAVA FAVOURITES.</h2><p>A few heavy hitters to get your order started.</p></div><Link className="text-link" href="/menu">VIEW FULL MENU <ArrowUpRight size={16}/></Link></div><div className="favourite-rail" ref={rail} onScroll={update}>{foods.map((f,i) => <FoodCard food={f} key={f.id} numbered={i}/>)}</div><div className="rail-footer"><span>THE MENU EDIT <i/> {foods.length} FAVOURITES</span><div className="rail-controls"><button className="circle-btn" onClick={() => slide(-1)} disabled={edges[0]} aria-label="Previous favourites"><ArrowLeft size={17}/></button><button className="circle-btn" onClick={() => slide(1)} disabled={edges[1]} aria-label="Next favourites"><ArrowRight size={17}/></button></div></div></div></section>;
}
