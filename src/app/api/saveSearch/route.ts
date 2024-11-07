import { NextResponse } from 'next/server';
import { db } from '@/db';
import { searchedBooks } from '@/db/schema';

export async function POST(request: Request) {
  const { bookId } = await request.json();

  if (!bookId) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    await db.insert(searchedBooks).values({ bookId });
    return NextResponse.json({ message: 'Book search saved successfully' });
  } catch (error) {
    console.error('Error saving book search:', error);
    return NextResponse.json(
      { error: 'Failed to save book search' },
      { status: 500 }
    );
  }
}
