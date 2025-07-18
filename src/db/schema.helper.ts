import { uuid } from 'drizzle-orm/pg-core';

export const id = uuid().primaryKey().defaultRandom();
