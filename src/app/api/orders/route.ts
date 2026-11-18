import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { getMenu } from '@/lib/catalog';
import { business, deliveryCharge, money } from '@/data/business';
import { selectionError, type BagLine } from '@/data/menu';
import { customerFields, failure, FormError, notifyOwner, postcodePattern, readSubmission, reference } from '@/lib/requests';

const schema = z.object({ ...customerFields, requestId: z.uuid(), fulfilment: z.enum(['collection', 'delivery']), address: z.string().trim().max(400).default(''), postcode: z.string().trim().max(10).default(''), notes: z.string().trim().max(700).default(''), accepted: z.literal(true),
  lines: z.array(z.object({ id: z.string().max(80), quantity: z.number().int().min(1).max(20), expectedPrice: z.number().int().min(0), selections: z.record(z.string().max(40), z.array(z.string().max(60)).max(3)), notes: z.string().max(300).default('') })).min(1).max(40),
});
export async function POST(request: Request) {
  try {
    const data = schema.parse(await readSubmission(request, 'order'));
    if (data.fulfilment === 'delivery') {
      if (data.address.length < 6 || !postcodePattern.test(data.postcode)) throw new FormError('Please enter a full delivery address and valid UK postcode.');
      const district = data.postcode.replace(/\s/g, '').slice(0,-3).toUpperCase();
      if (business.deliveryPostcodeDistricts.length && !business.deliveryPostcodeDistricts.includes(district)) throw new FormError('Delivery is not available to that postcode. Please choose collection.');
    }
    const catalog = await getMenu();
    const lines: BagLine[] = data.lines.map((line, i) => {
      const item = catalog.find(food => food.id === line.id);
      if (!item) throw new FormError('An item is no longer available. Please update your bag.');
      if (item.price !== line.expectedPrice) throw new FormError(`${item.name} has a new price. Please remove it from your bag and add it again.`, 409);
      const error = selectionError(item, line.selections);
      if (error) throw new FormError(`${item.name}: ${error}`);
      return { key: String(i), id: item.id, name: item.name, price: item.price, image: item.image, quantity: line.quantity, selections: line.selections, notes: line.notes };
    });
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const fee = data.fulfilment === 'delivery' ? deliveryCharge(subtotal) : 0;
    const ref = reference('FB');
    const [saved] = await db.insert(orders).values({ requestId: data.requestId, reference: ref, name: data.name, phone: data.phone, fulfilment: data.fulfilment, address: data.fulfilment === 'delivery' ? data.address : null, postcode: data.fulfilment === 'delivery' ? data.postcode.toUpperCase() : null, notes: data.notes, lines, subtotal, deliveryFee: fee }).onConflictDoNothing({ target: orders.requestId }).returning({ reference: orders.reference });
    if (!saved) {
      const [existing] = await db.select({ reference: orders.reference, subtotal: orders.subtotal, deliveryFee: orders.deliveryFee }).from(orders).where(eq(orders.requestId, data.requestId));
      return Response.json({ ...existing, status: 'awaiting_acceptance' });
    }
    await notifyOwner(`Flava Box order enquiry ${ref}`, `${ref}\n${data.name} · ${data.phone}\n${data.fulfilment}\n${data.fulfilment === 'delivery' ? data.address + ', ' + data.postcode : ''}\n\n${lines.map(l => `${l.quantity} × ${l.name} — ${money(l.price * l.quantity)}\n${Object.values(l.selections).flat().join(', ')}\n${l.notes}`).join('\n')}\nSubtotal: ${money(subtotal)}\nDelivery: ${fee === null ? 'Confirm with customer' : money(fee)}\nNotes: ${data.notes}\nContact the customer to accept this enquiry.`);
    return Response.json({ reference: ref, subtotal, deliveryFee: fee, status: 'awaiting_acceptance' }, { status: 201 });
  } catch (error) { return failure(error); }
}
