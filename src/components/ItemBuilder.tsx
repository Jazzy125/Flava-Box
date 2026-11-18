'use client';
import { useRef, useState } from 'react';
import { Check, Plus, Minus, ShoppingBag, ChevronDown, Info } from 'lucide-react';
import { type Food, type Selections, choiceGroups, selectionError } from '@/data/menu';
import { money, business } from '@/data/business';
import { useShop } from './Shop';
export function Stepper({ value, onChange, label = 'Quantity' }: { value: number; onChange: (value: number) => void; label?: string }) {
  return <div className="stepper" aria-label={label}><button type="button" disabled={value <= 1} aria-label={`Decrease ${label.toLowerCase()}`} onClick={() => onChange(value-1)}><Minus size={15}/></button><span aria-live="polite">{value}</span><button type="button" disabled={value >= 20} aria-label={`Increase ${label.toLowerCase()}`} onClick={() => onChange(value+1)}><Plus size={15}/></button></div>;
}
export default function ItemBuilder({ food, inModal = false }: { food: Food; inModal?: boolean }) {
  const { add, setBagOpen, dismissToast } = useShop(); const [selected, setSelected] = useState<Selections>({}); const [quantity, setQuantity] = useState(1); const [notes, setNotes] = useState(''); const [error, setError] = useState(''); const form = useRef<HTMLFormElement>(null);
  const groups = choiceGroups(food, selected);
  function choose(group: typeof groups[number], value: string) {
    const current = selected[group.id] || [];
    const next = { ...selected, [group.id]: group.count === 1 ? [value] : current.includes(value) ? current.filter(v => v !== value) : [...current, value].slice(0, group.count) };
    const valid = choiceGroups(food, next).map(g => g.id);
    for (const key of Object.keys(next)) if (!valid.includes(key)) delete next[key];
    setSelected(next); setError('');
  }
  return <form className="item-builder" ref={form} onSubmit={e => { e.preventDefault(); const problem = selectionError(food, selected); if (problem) { setError(problem); const missing = groups.find(g => (selected[g.id] || []).length !== g.count); if (missing) form.current?.querySelector<HTMLElement>(`[data-group="${missing.id}"] button`)?.focus(); return; } if (!add(food, quantity, selected, notes.trim())) { setError('This would exceed the bag limit. Please reduce the quantity or call for a large order.'); return; } if (!inModal) { dismissToast(); setBagOpen(true); } }}>
    {food.includes && <div className="included-note"><Check size={17}/><span>Always included: <strong>{food.includes.toLowerCase()}.</strong></span></div>}
    {groups.map((g, index) => <fieldset key={g.id} className="choice-group" data-group={g.id}><legend><span className="choice-number">{String(index+1).padStart(2,'0')}</span>{g.label}</legend><span className="choice-hint">Select {g.count}{g.count > 1 ? ' different options' : ' option'}<span>{(selected[g.id] || []).length}/{g.count}</span></span><div className="choice-options">{g.options.map(option => { const checked = (selected[g.id] || []).includes(option); const other = g.id === 'starter' ? 'main' : g.id === 'main' ? 'starter' : ''; const locked = !checked && ((g.count > 1 && (selected[g.id] || []).length >= g.count) || (!!other && (selected[other] || []).includes(option))); return <button type="button" key={option} disabled={locked} aria-pressed={checked} className={'choice ' + (checked ? 'chosen' : '')} onClick={() => choose(g,option)}><span className={'choice-mark ' + (g.count === 1 ? 'round' : '')}>{checked && <Check size={11} strokeWidth={3}/>}</span>{option}</button>; })}</div></fieldset>)}
    {food.includes && <p className="micro-copy">The same option cannot be selected twice.</p>}
    <details className="item-notes"><summary>Item notes <span>Optional <ChevronDown size={14}/></span></summary><label className="sr-only" htmlFor={'notes-'+food.id}>Notes for {food.name}</label><textarea id={'notes-'+food.id} maxLength={300} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything the team should know?" /></details>
    <p className="allergen-note"><Info size={15}/><span>Food allergy? <a href={business.phoneHref}>Call the team</a> before ordering.</span></p>
    {error && <p className="form-error" role="alert">{error}</p>}<div className="builder-bottom"><Stepper value={quantity} onChange={setQuantity}/><button className="btn btn-orange" type="submit"><ShoppingBag size={17}/>ADD TO BAG <span className="price-split">{money(food.price * quantity)}</span></button></div>
  </form>;
}
