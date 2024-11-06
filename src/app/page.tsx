'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [bookId, setBookId] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (bookId) {
      router.push(`/book/${bookId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Gutenberg Explorer</h1>
      <input
        type="text"
        placeholder="Enter Book ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
        className="w-64 px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 mb-4"
      />
      <button
        onClick={handleSearch}
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Fetch Book
      </button>
    </div>
  );
}
