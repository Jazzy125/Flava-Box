'use client';
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import type { Food, BagLine, Selections } from '@/data/menu';

type Store = { lines: BagLine[]; count: number; subtotal: number; hydrated: boolean; bagOpen: boolean; setBagOpen: (v: boolean) => void; configuring: Food | null; configure: (v: Food | null) => void; add: (f: Food, q?: number, s?: Selections, n?: string) => boolean; quantity: (key: string, value: number) => void; remove: (key: string) => void; clear: () => void; toast: string; dismissToast: () => void };
const ShopContext = createContext<Store | null>(null);
const STORAGE = 'flavabox:bag:v1';
function isLine(value: unknown): value is BagLine {
  if (!value || typeof value !== 'object') return false;
  const l = value as BagLine;
  return typeof l.key === 'string' && typeof l.id === 'string' && typeof l.name === 'string' && typeof l.notes === 'string' && typeof l.image === 'string' && /^\/images\/[a-z-]+\.webp$/.test(l.image) && Number.isInteger(l.quantity) && l.quantity > 0 && l.quantity <= 20 && Number.isInteger(l.price) && l.price > 0 && !!l.selections && typeof l.selections === 'object' && Object.values(l.selections).every(v => Array.isArray(v) && v.every(x => typeof x === 'string'));
}
export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>([]); const [hydrated, setHydrated] = useState(false);
  const [bagOpen, setBagOpen] = useState(false); const [configuring, configure] = useState<Food | null>(null); const [toast, setToast] = useState('');
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE) || '[]'); if (Array.isArray(saved)) setLines(saved.filter(isLine).slice(0, 40)); } catch { /* Private browsing may disable storage. */ } setHydrated(true); }, []);
  useEffect(() => { if (hydrated) { try { localStorage.setItem(STORAGE, JSON.stringify(lines)); } catch { /* The current session remains usable. */ } } }, [lines, hydrated]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 4200); return () => clearTimeout(t); }, [toast]);
  const add = (food: Food, q = 1, s: Selections = {}, n = '') => {
    const signature = (v: Selections) => JSON.stringify(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)).map(([key, values]) => [key, [...values].sort()]));
    const same = lines.find(l => l.id === food.id && l.notes === n && l.price === food.price && signature(l.selections) === signature(s));
    if ((same?.quantity || 0) + q > 20 || (!same && lines.length >= 40)) { setToast('Bag limit reached. Please call us for a large order.'); return false; }
    if (same) setLines(prev => prev.map(l => l.key === same.key ? { ...l, quantity: l.quantity + q } : l));
    else setLines(prev => [...prev, { key: crypto.randomUUID(), id: food.id, name: food.name, image: food.image, price: food.price, quantity: q, selections: s, notes: n }]);
    setToast(`${q > 1 ? q + ' × ' : ''}${food.name} added to your bag`); configure(null); return true;
  };
  const dismissToast = useCallback(() => setToast(''), []);
  return <MotionConfig reducedMotion="user"><ShopContext.Provider value={{ lines, hydrated, count: lines.reduce((v, l) => v + l.quantity, 0), subtotal: lines.reduce((v, l) => v + l.quantity * l.price, 0), bagOpen, setBagOpen, configuring, configure, add, toast, dismissToast, quantity: (key, v) => setLines(old => old.map(l => l.key === key ? { ...l, quantity: Math.min(20, Math.max(1, v)) } : l)), remove: key => setLines(old => old.filter(l => l.key !== key)), clear: () => setLines([]) }}>{children}</ShopContext.Provider></MotionConfig>;
}
export function useShop() { const store = useContext(ShopContext); if (!store) throw new Error('ShopProvider required'); return store; }
