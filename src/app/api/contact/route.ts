import { z } from 'zod';
import { db } from '@/db';
import { enquiries } from '@/db/schema';
import { customerFields, failure, readSubmission, notifyOwner, reference } from '@/lib/requests';

const schema = z.object({ ...customerFields, subject: z.enum(['General enquiry', 'Delivery area', 'Collection', 'Menu & allergens', 'Existing order']), message: z.string().trim().min(8, 'Please tell us a little more about your enquiry.').max(1200), website: z.string().max(0).optional() });
export async function POST(request: Request) {
  try {
    const data = schema.parse(await readSubmission(request, 'contact'));
    const ref = reference('FQ');
    await db.insert(enquiries).values({ reference: ref, name: data.name, phone: data.phone, subject: data.subject, message: data.message });
    await notifyOwner(`Flava Box enquiry ${ref}`, `${ref}\n${data.subject}\n${data.name} · ${data.phone}\n\n${data.message}`);
    return Response.json({ reference: ref }, { status: 201 });
  } catch (error) { return failure(error); }
}
