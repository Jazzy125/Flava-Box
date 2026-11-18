import { pgTable, varchar, integer, jsonb, timestamp, text, uuid } from 'drizzle-orm/pg-core';
import type { Food, BagLine } from '@/data/menu';

export const menuItems = pgTable('flava_menu', {
  id: varchar('id', { length: 80 }).primaryKey(),
  details: jsonb('details').$type<Food>().notNull(),
  position: integer('position').notNull(),
});
export const orders = pgTable('flava_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  reference: varchar('reference', { length: 20 }).notNull().unique(),
  requestId: uuid('request_id').notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  fulfilment: varchar('fulfilment', { length: 12 }).notNull(),
  address: text('address'),
  postcode: varchar('postcode', { length: 10 }),
  lines: jsonb('lines').$type<BagLine[]>().notNull(),
  subtotal: integer('subtotal').notNull(),
  deliveryFee: integer('delivery_fee'),
  notes: text('notes').notNull(),
  status: varchar('status', { length: 30 }).default('awaiting_acceptance').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
export const enquiries = pgTable('flava_enquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  reference: varchar('reference', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  subject: varchar('subject', { length: 60 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
