CREATE TABLE IF NOT EXISTS "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"gutenberg_id" integer NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"release_date" text,
	"language" text,
	"ebook_number" text,
	"cover_image_url" text,
	"content" text NOT NULL,
	CONSTRAINT "books_gutenberg_id_unique" UNIQUE("gutenberg_id")
);
