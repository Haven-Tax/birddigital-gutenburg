import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Use Vercel's DATABASE_URL for connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessary for secure connections with Vercel Postgres
  },
});

export const db = drizzle(pool);
