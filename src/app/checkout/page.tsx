import type { Metadata } from 'next';
import Checkout from '@/components/Checkout';
export const metadata: Metadata = { title:'Review Your Order', description:'Review your Flava Box bag and send a collection or delivery order enquiry. No card details required.', robots:{ index:false, follow:false } };
export default function CheckoutPage() { return <Checkout/>; }
