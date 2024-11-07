import { NextResponse } from 'next/server';
import { db } from '@/db';
import { searchedBooks } from '@/db/schema';
import { desc } from 'drizzle-orm'; // Import the desc function

export async function GET() {
  try {
    const searches = await db
      .select()
      .from(searchedBooks)
      .orderBy(desc(searchedBooks.searchDate)) // Use desc helper function
      .limit(10);

    return NextResponse.json({ searches });
  } catch (error) {
    console.error('Error fetching book searches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book searches' },
      { status: 500 }
    );
  }
}
