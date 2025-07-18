import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { id } from '../schema.helper';

export const Rentals = pgTable('rentals', {
  id: id,
  name: text().notNull().unique(),
  max_amount: integer().notNull().default(0),
  active: integer().notNull().default(0),
});
