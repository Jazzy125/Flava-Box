import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Kicker } from '@/components/Brand';
export default function NotFound() { return <section className="empty-page"><Kicker>404 / OFF THE MENU</Kicker><h1>NOT ON THE MENU.</h1><p>That page isn’t here, but your next favourite might be.</p><Link className="btn btn-orange" href="/menu">BACK TO THE MENU <ArrowRight size={16}/></Link></section>; }
