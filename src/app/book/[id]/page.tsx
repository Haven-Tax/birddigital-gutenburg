'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface BookMetadata {
  title: string;
  author: string;
  coverImage: string | null;
  releaseDate?: string;
  ebookNumber?: string;
  downloadLinks: { format: string; url: string }[];
}

const WORDS_PER_PAGE = 400;

export default function BookDisplay({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);
  const [bookContent, setBookContent] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<BookMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Split bookContent into pages based on words
  const words = bookContent ? bookContent.split(/\s+/) : [];
  const totalPages = Math.ceil(words.length / WORDS_PER_PAGE);

  useEffect(() => {
    params
      .then((resolvedParams) => setId(resolvedParams.id))
      .catch(() => setError('Failed to retrieve book ID'));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/gutenberg/fetchBook?bookId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setBookContent(data.content);
          setMetadata(data.metadata);
        }
      })
      .catch(() => setError('Error fetching book data'));
  }, [id]);

  if (error)
    return <div className="text-red-500 text-center mt-4">{error}</div>;

  // Function to get the content for the current page based on words
  const getPageContent = () => {
    if (!bookContent) return '';
    const start = currentPage * WORDS_PER_PAGE;
    const end = start + WORDS_PER_PAGE;
    return words.slice(start, end).join(' ');
  };

  // Handlers for pagination
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-900 text-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4">
        {metadata?.title || 'Book Details'}
      </h2>

      {metadata?.author && (
        <p className="text-lg text-gray-400 mb-6">Author: {metadata.author}</p>
      )}

      {metadata?.coverImage && (
        <div className="mb-6">
          <Image
            src={metadata.coverImage}
            alt="Book Cover"
            width={192}
            height={288}
            className="rounded-md shadow"
          />
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Download Links:</h3>
        <ul className="list-disc ml-6 space-y-2">
          {metadata?.downloadLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                {link.format}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Content:</h3>
        <p className="text-gray-300 whitespace-pre-line">{getPageContent()}</p>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-600 hover:bg-blue-700"
          >
            Previous
          </button>
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-600 hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}