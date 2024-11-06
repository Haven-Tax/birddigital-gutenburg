import { pgTable, text, integer, serial } from 'drizzle-orm/pg-core';

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  gutenbergId: integer('gutenberg_id').notNull().unique(),
  title: text('title').notNull(),
  author: text('author'),
  releaseDate: text('release_date'),
  language: text('language'),
  ebookNumber: text('ebook_number'),
  coverImageUrl: text('cover_image_url'),
  content: text('content').notNull(),
});
