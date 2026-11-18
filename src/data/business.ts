export const business = {
  name: 'Flava Box Luton',
  phone: '07440 640460',
  phoneHref: 'tel:+447440640460',
  whatsappNumber: '447440640460',
  instagram: 'https://www.instagram.com/flavaboxluton/',
  instagramPost: 'https://www.instagram.com/p/DZ1KB5CqYOe/',
  handle: '@flavaboxluton',
  hours: '5 PM – 10 PM',
  days: 'Monday – Sunday',
  preorder: '3 PM',
  timezone: 'Europe/London',
  address: '314–318 Selbourne Road, Maidenhall, Luton, LU4 8NU',
  addressVerified: false,
  hoursVerified: false,
  menuVerified: false,
  freeDeliveryAbove: 3500,
  // Amounts are in pence. Leave null until the owner confirms the fee.
  deliveryFee: null as number | null,
  // An empty list means delivery coverage must be confirmed by the team.
  deliveryPostcodeDistricts: [] as string[],
};

export const whatsappLink = (message: string) => `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || business.whatsappNumber).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
export const money = (pence: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);
export const shortMoney = (pence: number) => '£' + (pence % 100 === 0 ? pence / 100 : (pence / 100).toFixed(2));
export const deliveryCharge = (subtotal: number) => subtotal > business.freeDeliveryAbove ? 0 : business.deliveryFee;
export const siteUrl = () => (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
