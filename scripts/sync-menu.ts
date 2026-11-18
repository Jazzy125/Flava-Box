import 'dotenv/config';
import { db, pool } from '@/db';
import { menuItems } from '@/db/schema';
import { menu } from '@/data/menu';
import { notInArray } from 'drizzle-orm';
// Explicit maintenance command: overwrite catalogue data from the approved source.
async function main() {
  if (!menu.length) throw new Error('Refusing to sync an empty catalogue.');
  await db.transaction(async tx => {
    for (const [position, details] of menu.entries()) await tx.insert(menuItems).values({ id:details.id, details, position }).onConflictDoUpdate({ target:menuItems.id,set:{ details, position } });
    await tx.delete(menuItems).where(notInArray(menuItems.id,menu.map(f => f.id)));
  });
  console.log(`Synchronized ${menu.length} menu items. Existing order snapshots are unchanged.`);
}
main().catch(err => { console.error(err instanceof Error ? err.message : 'Menu sync failed'); process.exitCode = 1; }).finally(() => pool.end());
