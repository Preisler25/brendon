import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { id } from '../schema.helper';
import { Tickets } from './tickets';

export const Logs = pgTable('logs', {
  id: id,
  cashierId: integer('cashier_id').notNull(),
  date: timestamp('date_of_purchase').defaultNow(),
  totalAmount: integer('total_amount').notNull(),
  totalDeposit: integer('total_deposit').notNull(),
});

export const TicketLogs = pgTable('ticket_logs', {
  id: id,
  logId: uuid('day_id').references(() => Logs.id),
  ticketTypeId: uuid('ticket_type_id').references(() => Tickets.id),
  quantity: integer('quantity').notNull().default(0),
  paidInCash: boolean('payed_in_cash').notNull().default(false),
});
