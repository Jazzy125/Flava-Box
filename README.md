# FLAVA BOX LUTON

A complete, mobile-first takeaway website using Next.js App Router, React, TypeScript, PostgreSQL and Drizzle ORM. Custom illustrative food photography, self-hosted typography, GSAP / ScrollTrigger scroll effects and Framer Motion dialogs are included. The project uses the platform’s native Next.js routing and server-side API routes rather than a second Vite/React Router application.

## Customer experience

- Home, full searchable menu, 24 individual dish pages, meal deals, About, Contact and checkout.
- All 24 supplied menu entries, seven categories, exact supplied prices, wing/chop flavours and box selection limits.
- Box choices are checked on both client and server. Duplicate proteins and duplicate mains/sides are prohibited. Choosing wings or chops exposes the appropriate flavour options.
- Local-storage bag, quantity changes, removal, item notes, order notes, collection or delivery and a server-priced summary.
- Saved enquiries receive a reference, a detailed WhatsApp handoff and phone confirmation option. No card data is collected. An enquiry is never shown as an accepted order.
- Server input validation, same-origin and content-type checks, bounded payloads, request throttling, parameterized Drizzle writes and idempotent order submissions. Order records snapshot the actual menu version and price.
- Accessible keyboard dialogs, navigation, skip link, labelled controls, reduced-motion support, responsive WebP images, sitemap and structured data.

## Owner verification before launch

Do **not** treat this preview as confirmation by the owner. The menu is transcribed from the supplied Instagram reference, not third-party aggregators. Confirm every price, description, portion, flavour, included side and availability before publication.

Verify the supplied address (314–318 Selbourne Road, Maidenhall, Luton, LU4 8NU), daily 5–10 PM hours, pre-orders before 3 PM, accepted delivery districts, fee and free-delivery policy with the owner. Exact map directions and structured street address stay disabled until `addressVerified` is true. Opening-hours schema stays disabled until `hoursVerified` is true. Phone, Instagram and WhatsApp destinations also need a live owner check.

All food imagery is generated editorial **serving inspiration**, not actual Flava Box products or customer orders. The gallery and footer identify this. Social images link to the official account and are not represented as a live Instagram feed. Replace the illustrative images with owner-approved photographs when available. No testimonials, ratings, historic claims or dietary certifications have been invented.

## Central configuration

- `src/data/business.ts`: contact details, verification flags, hours, pre-order cutoff, postcode districts, delivery fee and threshold (integer pence).
- `src/data/menu.ts`: complete catalogue seed, descriptions, prices, groups and permitted flavours. The database seeds from this file when the menu table is empty. Thereafter `flava_menu` is the authoritative runtime catalogue.
- Edit catalogue entries via Drizzle/owner database tools, or edit the source then explicitly run `npx tsx scripts/sync-menu.ts`. The sync overwrites catalogue entries and removes entries absent from the source. It does not modify previous order records.
- The free delivery threshold uses **strictly greater than** £35, as supplied. At exactly £35 the standard delivery fee applies. The standard fee defaults to `null` (unconfirmed), never an invented charge. An empty district list means the owner must confirm coverage, not universal delivery. For example, once confirmed, a non-empty district allowlist is enforced server-side. No payment is taken.

## Database and running

Set `DATABASE_URL` in `.env`. Install dependencies, bootstrap the managed runtime, then `npx drizzle-kit push` against the configured local database. The managed preview starts the production app and checks `/api/health`.

Database tables:
- `flava_menu`: ordered catalogue with strongly typed item data.
- `flava_orders`: customer, contact, fulfilment, order snapshot, subtotal, nullable delivery fee, reference and `awaiting_acceptance` status.
- `flava_enquiries`: saved contact requests and unique references.

API: `POST /api/orders`, `POST /api/contact` and `GET /api/health`. No customer data is exposed through public read endpoints. Owner access to database views must remain private. Review and accept enquiries through direct customer contact. An owner can update the saved status through their private database tooling. Configure production retention and backup policies for personal data.

## Optional environment settings

- `SITE_URL`: the verified public origin for absolute canonical URLs and sitemap. Defaults to localhost for preview. Set this before launch.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: owner-confirmed WhatsApp destination in international format; defaults to the supplied UK business number.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `OWNER_EMAIL`: send enquiry notifications to the owner when configured. SMTP credentials are server-only. STARTTLS is required on submission ports; port 465 uses implicit TLS. Without SMTP, customers use the explicit WhatsApp/phone handoff and enquiries remain safely stored. An SMTP failure does not discard a saved enquiry.

No email address or payment credentials are assumed. Do not place secrets in `NEXT_PUBLIC_` variables. For a multi-instance public deployment, move the process-local request limiter to a shared rate-limit service, add ingress body limits and configure trusted proxy headers.

## Validation

`npx next typegen`, `npm exec tsc -- --noEmit --pretty false`, `npm run build`, then the platform `build_and_start` healthcheck.

With the preview running, install the browser with `npx playwright install chromium` and run `npx playwright test`. The suite checks navigation, responsive layout, basket persistence, all category filters, configuration constraints, delivery fee boundaries, idempotency, form submission and server validation. Tests create clearly marked synthetic records (`FLAVA SITE QA`) and do not send WhatsApp messages. Run against a test database with notification credentials disabled.
