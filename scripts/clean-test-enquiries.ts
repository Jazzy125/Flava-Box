import 'dotenv/config';
import { eq, and, like } from 'drizzle-orm';
import { db, pool } from '@/db';
import { orders, enquiries } from '@/db/schema';
// Only the explicit synthetic identity and test payloads are eligible for cleanup.
async function main() {
  const a = await db.delete(orders).where(and(eq(orders.name,'FLAVA SITE QA'),eq(orders.phone,'07700900123'),like(orders.notes,'Automated test enquiry%'))).returning({id:orders.id});
  const b = await db.delete(enquiries).where(and(eq(enquiries.name,'FLAVA SITE QA'),eq(enquiries.phone,'07700900123'),like(enquiries.message,'Automated test enquiry%'))).returning({id:enquiries.id});
  console.log(`Removed ${a.length} synthetic order enquiries and ${b.length} synthetic contact enquiries.`);
}
main().catch(e => { console.error(e); process.exitCode=1; }).finally(() => pool.end());
