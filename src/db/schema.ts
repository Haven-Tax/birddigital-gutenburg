import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';

export const searchedBooks = pgTable('searched_books', {
  id: serial('id').primaryKey(),
  bookId: text('book_id').notNull(),
  searchDate: timestamp('search_date').defaultNow(),
});
