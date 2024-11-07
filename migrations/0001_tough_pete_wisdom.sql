ALTER TABLE "books" RENAME TO "searched_books";--> statement-breakpoint
ALTER TABLE "searched_books" RENAME COLUMN "gutenberg_id" TO "book_id";--> statement-breakpoint
ALTER TABLE "searched_books" DROP CONSTRAINT "books_gutenberg_id_unique";--> statement-breakpoint
ALTER TABLE "searched_books" ADD COLUMN "search_date" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "searched_books" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
ALTER TABLE "searched_books" DROP COLUMN IF EXISTS "author";--> statement-breakpoint
ALTER TABLE "searched_books" DROP COLUMN IF EXISTS "release_date";--> statement-breakpoint
ALTER TABLE "searched_books" DROP COLUMN IF EXISTS "language";--> statement-breakpoint
ALTER TABLE "searched_books" DROP COLUMN IF EXISTS "ebook_number";--> statement-breakpoint
ALTER TABLE "searched_books" DROP COLUMN IF EXISTS "cover_image_url";--> statement-breakpoint
ALTER TABLE "searched_books" DROP COLUMN IF EXISTS "content";