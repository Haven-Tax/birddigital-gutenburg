'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookSearch {
  id: number;
  bookId: string;
  searchDate: string;
}

export default function Home() {
  const [bookId, setBookId] = useState('');
  const [recentSearches, setRecentSearches] = useState<BookSearch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = () => {
    if (!bookId.trim()) {
      setError('Please enter a valid Book ID');
      return;
    }
    setError(null); // Clear any previous error
    router.push(`/book/${bookId}`);
  };

  // Fetch recent searches when the component mounts
  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const response = await fetch('/api/saveSearch/fetchSearchedBooks');
        if (!response.ok) {
          throw new Error('Failed to fetch recent searches');
        }
        const data = await response.json();
        if (data.searches) {
          setRecentSearches(data.searches);
        }
      } catch (error) {
        console.error('Error fetching recent searches:', error);
        setError('Unable to load recent searches');
      }
    };

    fetchRecentSearches();
  }, []);

  // Handler for Enter key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-4xl font-semibold text-white mb-6">
          Gutenberg Explorer
        </h1>

        <div className="flex flex-col items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter Book ID"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSearch}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
          >
            Fetch Book
          </button>
        </div>

        {/* Display Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-8 text-left">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">
              Recently Searched Books
            </h2>
            <ul className="space-y-2">
              {recentSearches.map((search) => (
                <li
                  key={search.id}
                  className="flex justify-between items-center bg-gray-700 rounded-md p-2 shadow-sm"
                >
                  <button
                    onClick={() => router.push(`/book/${search.bookId}`)}
                    className="text-blue-400 hover:underline font-medium"
                  >
                    Book ID: {search.bookId}
                  </button>
                  <span className="text-gray-400 text-sm">
                    {new Date(search.searchDate).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
