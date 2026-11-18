export const categories = ['Meals / Boxes', 'Starters', 'Mains', 'Sides', 'Extras', 'Drinks', 'Dips'] as const;
export type Category = typeof categories[number];
export type ChoiceGroup = { id: string; label: string; count: number; options: string[] };
export type Food = { id: string; name: string; category: Category; price: number; description: string; image: string; choices: ChoiceGroup[]; includes?: string; tag?: string };
export type Selections = Record<string, string[]>;
export type BagLine = { key: string; id: string; name: string; price: number; image: string; quantity: number; selections: Selections; notes: string };

export const wingFlavours = ['Jerk', 'Sweet Chilli', 'Lemon Pepper', 'Mango Habanero', 'BBQ'];
export const chopFlavours = ['Jerk', 'Sweet Chilli', 'Classic'];
const starters = ['Wings', 'Battered Prawns'];
const mains = ['Wings', 'Lamb Chops', 'Cajun Tiger Prawns', 'Battered Prawns'];
const sides = ["Mac 'N' Cheese", 'Fries', 'Seasoned Fries'];
const drinks = ['Flava Fruit Punch', 'Bottle of Water'];
const group = (id: string, label: string, count: number, options: string[]): ChoiceGroup => ({ id, label, count, options });
const wingGroup = group('wings-flavour', 'Wings flavour', 1, wingFlavours);
const chopGroup = group('chops-flavour', 'Chops flavour', 1, chopFlavours);
const entry = (id: string, name: string, category: Category, price: number, description: string, image: string, choices: ChoiceGroup[] = [], extra: Partial<Food> = {}): Food => ({ id, name, category, price, description, image: '/images/' + image + '.webp', choices, ...extra });
const included = 'Garlic bread and corn on the cob';
// Owner-editable source, transcribed from the supplied Instagram menu. All prices in pence.
export const menu: Food[] = [
  entry('loaded-fries', 'Loaded Fries', 'Meals / Boxes', 1200, 'Golden fries, loaded with flavour. A proper comfort-food favourite.', 'loaded-fries', [], { tag: 'FLAVA FAVOURITE' }),
  entry('loaded-mac', 'Loaded Mac', 'Meals / Boxes', 1500, 'Creamy macaroni cheese, served the Flava Box way.', 'loaded-mac'),
  entry('loaded-mix', 'Loaded Mix', 'Meals / Boxes', 1800, 'The loaded mix for when one favourite just isn’t enough.', 'loaded-mix'),
  entry('classic-box', 'Classic Box', 'Meals / Boxes', 1000, 'Wings or battered prawns, one side, garlic bread and corn on the cob.', 'classic-box', [group('starter', 'Choose your starter', 1, starters), group('side', 'Choose your side', 1, sides)], { includes: included }),
  entry('combo-box', 'Combo Box', 'Meals / Boxes', 1500, 'One starter, one main and one side, with garlic bread and corn on the cob.', 'flava-box', [group('starter', 'Choose your starter', 1, starters), group('main', 'Choose your main', 1, mains), group('side', 'Choose your side', 1, sides)], { includes: included, tag: 'THE SIGNATURE COMBO' }),
  entry('combo-large', 'Combo Large', 'Meals / Boxes', 2000, 'Two different mains, two different sides and a drink. Garlic bread and corn included.', 'combo-large', [group('main', 'Choose two mains', 2, mains), group('side', 'Choose two sides', 2, sides), group('drink', 'Choose your drink', 1, drinks)], { includes: included }),
  entry('starter-wings', 'Wings ×4', 'Starters', 500, 'Four wings with your choice of signature flavour.', 'wings', [wingGroup]),
  entry('starter-prawns', 'Battered Prawns ×4', 'Starters', 300, 'Four golden battered prawns to start your order.', 'battered-prawns'),
  entry('wings', 'Wings ×5', 'Mains', 600, 'Five wings, five flavours to choose from. Find your favourite.', 'wings', [wingGroup]),
  entry('lamb-chops', 'Lamb Chops ×3', 'Mains', 850, 'Three lamb chops in Jerk, Sweet Chilli or Classic flavour.', 'lamb-chops', [chopGroup]),
  entry('cajun-prawns', 'Cajun Tiger Prawn ×3', 'Mains', 1000, 'Three tiger prawns with a bold Cajun seasoning.', 'cajun-prawns'),
  entry('battered-prawns', 'Battered Prawns ×6', 'Mains', 550, 'Six battered prawns with a satisfying golden crunch.', 'battered-prawns'),
  entry('mac-cheese', "Mac 'N' Cheese", 'Sides', 600, 'Creamy, cheesy macaroni to round off your box.', 'mac-cheese'),
  entry('fries', 'Fries', 'Sides', 300, 'A side of golden fries. Made for dipping.', 'fries'),
  entry('seasoned-fries', 'Seasoned Fries', 'Sides', 350, 'Golden fries with an extra hit of seasoning.', 'fries'),
  entry('garlic-bread', 'Garlic Bread', 'Extras', 50, 'A little garlic bread on the side.', 'garlic-bread'),
  entry('corn', 'Corn on the Cob', 'Extras', 100, 'Sweet corn on the cob to go with your favourites.', 'corn'),
  entry('fruit-punch', 'Flava Fruit Punch', 'Drinks', 300, 'A fruity accompaniment to your Flava Box.', 'fruit-punch'),
  entry('water', 'Bottle of Water', 'Drinks', 100, 'Bottled water with your meal.', 'water'),
  ...['Jerk', 'Sweet Chilli', 'BBQ', 'Mango', 'Box Sauce'].map(name => entry('dip-' + name.toLowerCase().replaceAll(' ', '-'), name, 'Dips', 70, `${name} dip. Add an extra flavour to your box.`, 'dips')),
];

export function choiceGroups(item: Food, selections: Selections): ChoiceGroup[] {
  const groups = [...item.choices];
  const proteins = [...(selections.starter || []), ...(selections.main || [])];
  if (proteins.includes('Wings')) groups.push(wingGroup);
  if (proteins.includes('Lamb Chops')) groups.push(chopGroup);
  return groups;
}
export function selectionError(item: Food, selections: Selections): string | null {
  const groups = choiceGroups(item, selections);
  if (Object.keys(selections).some(key => !groups.some(g => g.id === key))) return 'Please review your selections.';
  const picked: string[] = [];
  for (const g of groups) {
    const vals = selections[g.id] || [];
    if (!Array.isArray(vals) || vals.length !== g.count || vals.some(v => !g.options.includes(v))) return `Please select ${g.count} ${g.count > 1 ? 'options' : 'option'} for “${g.label}”.`;
    if (new Set(vals).size !== vals.length) return 'Choose different options for your box.';
    if (['starter', 'main', 'side'].includes(g.id)) {
      if (vals.some(v => picked.includes(v))) return 'The same option cannot be selected twice.';
      picked.push(...vals);
    }
  }
  return null;
}
export const boxIds = ['classic-box', 'combo-box', 'combo-large'];
export const favouriteIds = ['loaded-fries', 'combo-box', 'wings', 'cajun-prawns', 'loaded-mac', 'loaded-mix', 'classic-box', 'combo-large', 'lamb-chops', 'battered-prawns'];
export const signatures = [
  { name: 'Loaded Fries', image: 'loaded-fries', text: 'Golden fries. Fully loaded.', href: '/menu/loaded-fries' },
  { name: 'Flava Boxes', image: 'flava-box', text: 'Your favourites, in one box.', href: '/meal-deals' },
  { name: 'Wings & Chops', image: 'wings', text: 'Big flavour, down to the bone.', href: '/menu?category=Mains' },
  { name: 'Seafood Specials', image: 'cajun-prawns', text: 'A little heat from the sea.', href: '/menu?pick=seafood' },
];
