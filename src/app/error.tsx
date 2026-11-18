'use client';
import { Phone, RotateCcw } from 'lucide-react';
import { Kicker } from '@/components/Brand';
import { business } from '@/data/business';
export default function ErrorPage({ reset }: { error: Error & { digest?:string }; reset:()=>void }) { return <section className="empty-page"><Kicker>A LITTLE HOLD-UP</Kicker><h1>LET’S TRY THAT AGAIN.</h1><p>We couldn’t load this page. Try again, or speak to the Flava Box team.</p><div className="button-row"><button className="btn btn-orange" onClick={reset}><RotateCcw size={16}/>TRY AGAIN</button><a className="btn btn-outline" href={business.phoneHref}><Phone size={16}/>CALL {business.phone}</a></div></section>; }
