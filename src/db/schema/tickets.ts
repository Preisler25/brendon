import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { id } from '../schema.helper';
import { Rentals } from './rentals';

export const Tickets = pgTable('tickets', {
  id: id,
  name: text().notNull().unique(),
  weekend_price: integer().notNull().default(0),
  weekday_price: integer().notNull().default(0),
  deposit: integer().notNull().default(0),
  importance: integer().notNull().unique(),
  rental_id: uuid()
    .references(() => Rentals.id)
    .notNull(),
});
