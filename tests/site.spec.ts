import { test, expect, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { menu, categories } from '../src/data/menu';
const consoleErrors = new WeakMap<Page,string[]>();
test.beforeEach(async ({ page }) => { const errors: string[] = []; consoleErrors.set(page,errors); page.on('pageerror',e => errors.push(e.message)); page.on('console',m => { if (m.type() === 'error') errors.push(m.text()); }); });
test.afterEach(async ({ page }) => { expect(consoleErrors.get(page)).toEqual([]); });

test('home navigation, photographs, hero controls, lightbox and favourites rail',async ({ page }) => {
  await page.goto('/'); await expect(page.locator('.hero h1')).toContainText('CRAVINGS');
  await expect(page.locator('.hero-art img')).toBeVisible(); await page.locator('.hero-art img').evaluate(async (el: HTMLImageElement) => { await el.decode(); });
  await page.getByRole('button',{name:'Show The loaded fries',exact:true}).click(); await expect(page.locator('.photo-edition')).toHaveText('The loaded fries');
  await page.getByRole('button',{name:'Show The signature combo',exact:true}).click();
  await page.getByRole('button',{name:'Open shopping bag, 0 items'}).click(); await expect(page.getByRole('dialog')).toContainText('EMPTY BAG'); await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Next favourites'}).click(); await expect.poll(() => page.locator('.favourite-rail').evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Enlarge Loaded Fries'}).click(); await expect(page.getByRole('dialog')).toBeVisible(); await page.getByRole('button',{name:'Next photo'}).click(); await expect(page.locator('.lightbox-caption h3')).toHaveText('Sticky Wings'); await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'VIEW ALL 9',exact:true}).click(); await expect(page.locator('.gallery-tile')).toHaveCount(9);
  for(const [label,path] of [['Menu','/menu'],['Meal Deals','/meal-deals'],['About','/about'],['Contact','/contact'],['Home','/']]) { await page.locator('.desktop-nav').getByRole('link',{name:label,exact:true}).click(); await expect(page).toHaveURL(new RegExp(path === '/' ? '/$' : path+'$')); await expect(page.locator('main h1')).toBeVisible(); }
});

test('all menu categories, live search, empty results and dish pages',async ({ page,request }) => {
  await page.goto('/menu'); await expect(page.locator('.menu-grid .food-card')).toHaveCount(menu.length);
  for(const category of categories) { await page.locator('.category-tabs').getByRole('button',{name:category,exact:true}).click(); await expect(page.locator('.menu-grid .food-card')).toHaveCount(menu.filter(f=>f.category===category).length); }
  await page.getByRole('button',{name:'All items',exact:true}).click(); await page.getByRole('textbox',{name:'Search the menu'}).fill('not a real dish'); await expect(page.getByText('NO MATCHES THIS TIME.')).toBeVisible(); await page.getByRole('button',{name:'RESET FILTERS'}).click();
  await page.getByRole('textbox',{name:'Search the menu'}).fill('Cajun'); await expect(page.locator('.menu-grid .food-card')).toHaveCount(1); await page.locator('.food-card h3 a').click(); await expect(page).toHaveURL(/\/menu\/cajun-prawns$/); await expect(page.locator('.detail-price')).toHaveText('£10.00');
  for(const f of menu) { const r = await request.get('/menu/'+f.id); expect(r.status()).toBe(200); expect(await r.text()).toContain((f.price/100).toFixed(2)); }
  expect((await request.get('/sitemap.xml')).status()).toBe(200); expect((await request.get('/robots.txt')).status()).toBe(200);
});

test('combo limits, flavours, cart persistence, totals and genuine delivery checkout',async ({ page }) => {
  await page.goto('/menu/combo-box'); await page.locator('[data-group="starter"]').getByRole('button',{name:'Wings',exact:true}).click(); await expect(page.locator('[data-group="main"]').getByRole('button',{name:'Wings',exact:true})).toBeDisabled();
  await page.goto('/menu/combo-large'); await page.getByRole('button',{name:/ADD TO BAG/}).click(); await expect(page.locator('.item-builder').getByRole('alert')).toContainText('select 2');
  const g = (k:string) => page.locator(`[data-group="${k}"]`);
  await g('main').getByRole('button',{name:'Wings',exact:true}).click(); await g('main').getByRole('button',{name:'Lamb Chops',exact:true}).click(); await expect(g('main').getByRole('button',{name:'Battered Prawns',exact:true})).toBeDisabled();
  await g('side').getByRole('button',{name:'Fries',exact:true}).click(); await g('side').getByRole('button',{name:"Mac 'N' Cheese",exact:true}).click(); await expect(g('side').getByRole('button',{name:'Seasoned Fries',exact:true})).toBeDisabled();
  await g('drink').getByRole('button',{name:'Flava Fruit Punch',exact:true}).click(); await g('wings-flavour').getByRole('button',{name:'BBQ',exact:true}).click(); await g('chops-flavour').getByRole('button',{name:'Classic',exact:true}).click();
  await page.getByRole('button',{name:/ADD TO BAG/}).click(); const bag = page.getByRole('dialog',{name:'Your shopping bag'}); await expect(bag).toContainText('£20.00'); await bag.getByRole('button',{name:'Increase combo large quantity'}).click(); await expect(bag.locator('.total-row')).toContainText('£40.00'); await expect(bag).toContainText('qualifies for free');
  await page.keyboard.press('Escape'); await page.reload(); await page.getByRole('button',{name:'Open shopping bag, 2 items'}).click(); await page.getByRole('link',{name:'REVIEW YOUR ORDER'}).click(); await expect(page).toHaveURL(/checkout$/);
  await page.getByRole('button',{name:'SEND ORDER ENQUIRY'}).click(); await expect(page.locator('input[name="name"]:invalid')).toHaveCount(1);
  await page.getByLabel('Full name',{exact:true}).fill('FLAVA SITE QA'); await page.getByLabel('Phone number',{exact:true}).fill('07700900123'); await page.getByText('Check your address',{exact:true}).click(); await page.getByLabel('Full delivery address').fill('10 Test Street, Luton'); await page.getByLabel('Postcode',{exact:true}).fill('LU4 8NU'); await page.locator('input[name="accepted"]').check(); await page.locator('textarea[name="notes"]').fill('Automated test enquiry — do not fulfil.');
  const response = page.waitForResponse(r=>r.url().endsWith('/api/orders')&&r.request().method()==='POST'); await page.getByRole('button',{name:'SEND ORDER ENQUIRY'}).click(); const res=await response; expect(res.status()).toBe(201); const data=await res.json(); expect(data.subtotal).toBe(4000); expect(data.deliveryFee).toBe(0); expect(data.status).toBe('awaiting_acceptance'); await expect(page.locator('.receipt-card')).toContainText(data.reference); await expect(page.getByRole('link',{name:'CONFIRM VIA WHATSAPP'})).toHaveAttribute('href',/https:\/\/wa.me\/447440640460\?text=/); await expect(page.getByRole('button',{name:'Open shopping bag, 0 items'})).toBeVisible();
});

test('quick add, customise modal, quantity reduction, remove and empty basket',async ({ page }) => {
  await page.goto('/menu?category=Mains'); await page.getByRole('button',{name:'Customise Wings ×5',exact:true}).click(); const modal=page.getByRole('dialog'); await modal.getByRole('button',{name:'Lemon Pepper',exact:true}).click(); await modal.getByRole('button',{name:/ADD TO BAG/}).click(); await page.getByRole('button',{name:'Add Cajun Tiger Prawn ×3 to bag',exact:true}).click(); await page.getByRole('button',{name:'Open shopping bag, 2 items'}).click(); await expect(page.locator('.bag-summary .total-row')).toContainText('£16.00'); await page.getByRole('button',{name:'Increase wings ×5 quantity'}).click(); await page.getByRole('button',{name:'Decrease wings ×5 quantity'}).click(); await page.getByRole('button',{name:'Remove Wings ×5',exact:true}).click(); await page.getByRole('button',{name:'Remove Cajun Tiger Prawn ×3',exact:true}).click(); await expect(page.getByRole('dialog')).toContainText('EMPTY BAG');
});

test('contact enquiry is durably submitted with a reference',async ({ page }) => {
  await page.goto('/contact'); await page.getByLabel('Full name',{exact:true}).fill('FLAVA SITE QA'); await page.getByLabel('Phone number',{exact:true}).fill('07700900123'); await page.getByLabel('What’s it about?').selectOption('Delivery area'); await page.getByLabel('Your message',{exact:true}).fill('Automated test enquiry — no response needed.'); const response=page.waitForResponse(r=>r.url().endsWith('/api/contact')&&r.request().method()==='POST'); await page.getByRole('button',{name:'SEND ENQUIRY',exact:true}).click(); expect((await response).status()).toBe(201); await expect(page.getByRole('status')).toContainText('FQ-'); await expect(page.getByRole('link',{name:'SHARE ON WHATSAPP'})).toHaveAttribute('href',/^https:\/\/wa.me\//);
});

test('server price checks, duplicate choices, threshold boundaries and idempotency',async ({ request }) => {
  const line=(id:string,expectedPrice:number,quantity=1)=>({id,quantity,expectedPrice,selections:{},notes:''});
  const body={name:'FLAVA SITE QA',phone:'07700900123',requestId:randomUUID(),fulfilment:'delivery',address:'10 Test Street, Luton',postcode:'LU4 8NU',notes:'Automated test enquiry — do not fulfil.',accepted:true,lines:[line('loaded-fries',1200,2),line('battered-prawns',550,2)]};
  const send=(data:unknown)=>request.post('/api/orders',{data});
  const boundary=await send(body); expect(boundary.status()).toBe(201); const first=await boundary.json(); expect(first.subtotal).toBe(3500); expect(first.deliveryFee).toBeNull();
  const again=await send(body);expect(again.status()).toBe(200);expect((await again.json()).reference).toBe(first.reference);
  const over=await send({...body,requestId:randomUUID(),lines:[...body.lines,line('dip-bbq',70)]});expect(over.status()).toBe(201);expect((await over.json()).deliveryFee).toBe(0);
  expect((await send({...body,requestId:randomUUID(),lines:[line('loaded-fries',5)]})).status()).toBe(409);
  expect((await send({...body,requestId:randomUUID(),postcode:'wrong'})).status()).toBe(400);
  expect((await send({...body,requestId:randomUUID(),lines:[{...line('combo-box',1500),selections:{starter:['Wings'],main:['Wings'],side:['Fries'],'wings-flavour':['BBQ']}}]})).status()).toBe(400);
  expect((await send({...body,requestId:randomUUID(),lines:[line('loaded-fries',1200,0)]})).status()).toBe(400);
});

test('mobile navigation, layouts, search and bag access',async ({ page }) => {
  await page.setViewportSize({width:390,height:844}); await page.goto('/'); await page.getByRole('button',{name:'Open navigation'}).click(); await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeVisible(); await page.locator('#mobile-navigation').getByRole('link',{name:/Menu/}).click(); await expect(page).toHaveURL(/\/menu$/); await page.getByRole('button',{name:'Dips',exact:true}).click(); await expect(page.locator('.food-card')).toHaveCount(5); await page.getByRole('button',{name:'Add BBQ to bag',exact:true}).click(); await page.getByRole('button',{name:'Open shopping bag, 1 items'}).click(); await expect(page.getByRole('dialog')).toContainText('£0.70'); await page.keyboard.press('Escape');
  for(const path of ['/','/menu','/menu/combo-large','/meal-deals','/about','/contact','/checkout']) { await page.goto(path); await expect(page.locator('main h1')).toBeVisible(); const dimensions=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,vw:innerWidth})); expect(dimensions.sw,`overflow on ${path}`).toBeLessThanOrEqual(dimensions.vw+1); }
});
