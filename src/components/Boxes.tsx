import Link from 'next/link';
import { ArrowRight, Check, PackageOpen, Truck } from 'lucide-react';
import { type Food } from '@/data/menu';
import { business, shortMoney } from '@/data/business';
import { FoodImage, Kicker } from './Brand';
export function BoxCards({ foods }: { foods: Food[] }) {
  return <div className="box-grid stagger-group">{foods.map((f,i) => <article key={f.id} className={'box-card box-'+i}><div className="box-card-photo"><FoodImage src={f.image} alt={'Food inspiration for the '+f.name}/><span className="photo-tag">BOX NO. 0{i+1}</span></div><div className="box-card-body"><div className="bot-between"><h3>{f.name}</h3><span className="box-price">{shortMoney(f.price)}</span></div><p>{f.description}</p><div className="box-inclusion"><Check size={15}/>Garlic bread & corn included</div><Link className={'btn full '+(i === 1 ? 'btn-orange' : 'btn-outline')} href={'/menu/'+f.id}>BUILD YOUR BOX <ArrowRight size={17}/></Link></div></article>)}</div>;
}
export function ComboSection({ foods }: { foods: Food[] }) {
  return <section className="section combo-section"><div className="wrap"><Kicker>THE BOX BUILDER</Kicker><div className="section-head"><h2>MORE FLAVOUR. MORE TO SHARE.</h2><PackageOpen className="section-icon" size={43} strokeWidth={1.2}/></div><BoxCards foods={foods}/><p className="box-footnote">Your box, your choices. The same option cannot be selected twice.</p></div></section>;
}
export function OfferBanner() {
  return <section className="offer-banner"><div className="offer-visual"><FoodImage src="/images/loaded-fries.webp" alt="A tray of loaded golden fries" sizes="45vw"/></div><div className="wrap"><div className="offer-content"><div className="kicker"><Truck size={19}/> THE DELIVERY DEAL</div><h2>YOUR ORDER.<br/>OUR DELIVERY.</h2><p>Free local delivery on orders above <strong>{shortMoney(business.freeDeliveryAbove)}.</strong></p><Link href="/menu" className="btn btn-dark">START YOUR ORDER <ArrowRight size={18}/></Link><small>Delivery area and availability confirmed when you enquire.</small></div></div></section>;
}
