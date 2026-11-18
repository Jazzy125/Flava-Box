import { z } from 'zod';
import { randomBytes } from 'node:crypto';
import nodemailer from 'nodemailer';

export const customerFields = {
  name: z.string().trim().min(2, 'Please enter your full name.').max(100),
  phone: z.string().trim().min(9).max(25).regex(/^\+?[\d ()-]+$/, 'Please enter a valid phone number.').refine(v => v.replace(/\D/g, '').length >= 9, 'Please enter a valid phone number.'),
};
export const postcodePattern = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
export const reference = (prefix: string) => `${prefix}-${randomBytes(4).toString('hex').toUpperCase()}`;
const rates = new Map<string, { count: number; until: number }>();
export class FormError extends Error { constructor(message: string, public status = 400) { super(message); } }
export async function readSubmission(request: Request, kind: string): Promise<unknown> {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host')?.split(',')[0].trim() || request.headers.get('host');
  if (origin && new URL(origin).host !== host && new URL(origin).host !== new URL(request.url).host) throw new FormError('Please submit this form from the Flava Box website.', 403);
  if (!request.headers.get('content-type')?.includes('application/json')) throw new FormError('JSON form data is required.', 415);
  if (Number(request.headers.get('content-length')) > 64000) throw new FormError('Your submission is too large.', 413);
  const now = Date.now();
  for (const [k, v] of rates) if (v.until < now) rates.delete(k);
  const ip = (request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0] || 'local').slice(0,100);
  const key = `${kind}:${ip}`;
  const bucket = rates.get(key) || { count: 0, until: now + 10 * 60 * 1000 };
  if (bucket.count >= 18) throw new FormError('Too many submissions. Please try again later or call 07440 640460.', 429);
  bucket.count += 1; rates.set(key, bucket);
  const reader = request.body?.getReader();
  if (!reader) throw new FormError('The form is empty.');
  const decoder = new TextDecoder(); let size = 0; let raw = '';
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 64000) { await reader.cancel(); throw new FormError('Your submission is too large.', 413); }
      raw += decoder.decode(chunk.value, { stream: true });
    }
    raw += decoder.decode();
  } finally { reader.releaseLock(); }
  try { return JSON.parse(raw); } catch { throw new FormError('The form could not be read. Please try again.'); }
}
export function failure(error: unknown) {
  if (error instanceof FormError) return Response.json({ error: error.message }, { status: error.status });
  if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message || 'Please check your details.' }, { status: 400 });
  console.error('Flava Box form processing failed', error instanceof Error ? error.name : 'UnknownError');
  return Response.json({ error: 'We couldn’t save your enquiry. Please try again or call 07440 640460.' }, { status: 500 });
}
export async function notifyOwner(subject: string, text: string) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, OWNER_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_FROM || !OWNER_EMAIL) return;
  try {
    const client = nodemailer.createTransport({ host: SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_PORT === '465', requireTLS: process.env.SMTP_PORT !== '465', auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined, connectionTimeout: 5000, socketTimeout: 7000 });
    await client.sendMail({ from: SMTP_FROM, to: OWNER_EMAIL, subject, text });
  } catch { console.error('Owner notification unavailable; enquiry retained in database.'); }
}
