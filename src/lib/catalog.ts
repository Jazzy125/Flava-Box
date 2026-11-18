import { cache } from 'react';
import { asc } from 'drizzle-orm';
import { db } from '@/db';
import { menuItems } from '@/db/schema';
import { menu, type Food } from '@/data/menu';

// The database is authoritative. The supplied menu seeds an empty installation.
export const getMenu = cache(async (): Promise<Food[]> => {
  let rows = await db.select().from(menuItems).orderBy(asc(menuItems.position));
  if (!rows.length) {
    await db.insert(menuItems).values(menu.map((details, position) => ({ id: details.id, details, position }))).onConflictDoNothing();
    rows = await db.select().from(menuItems).orderBy(asc(menuItems.position));
  }
  return rows.map(row => row.details);
});
export const getFood = cache(async (id: string) => (await getMenu()).find(item => item.id === id));
