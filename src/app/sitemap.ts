import type { MetadataRoute } from 'next';
import { getMenu } from '@/lib/catalog';
import { siteUrl } from '@/data/business';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base = siteUrl(); const foods = await getMenu(); return [...['','/menu','/meal-deals','/about','/contact'].map(path => ({ url:base+path,changeFrequency:'weekly' as const,priority:path === '' ? 1 : .8 })),...foods.map(f => ({ url:base+'/menu/'+f.id,changeFrequency:'weekly' as const,priority:.6 }))]; }
