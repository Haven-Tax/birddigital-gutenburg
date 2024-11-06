import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('bookId');

  if (!bookId) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const contentUrl = `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`;
    const metadataUrl = `https://www.gutenberg.org/ebooks/${bookId}`;

    // Fetch the book content
    const contentResponse = await fetch(contentUrl);
    const content = await contentResponse.text();

    // Fetch the metadata page HTML and parse it with Cheerio
    const metadataResponse = await fetch(metadataUrl);
    const metadataHtml = await metadataResponse.text();
    const $ = cheerio.load(metadataHtml);

    // Extract the title from the table if available, otherwise fallback
    const title =
      $('#bibrec tr:contains("Title") td').text().trim() || 'Unknown Title';

    // Extract the author using the provided selector
    const author =
      $('#bibrec tr:contains("Author") td a').text().trim() || 'Unknown Author';

    // Extract the cover image (if available)
    const coverImageElement = $('img[src*="cover.medium.jpg"]').attr('src');
    const coverImage = coverImageElement?.startsWith('https')
      ? coverImageElement
      : `https://www.gutenberg.org${coverImageElement}`;

    // Extract release date
    const releaseDate =
      $('#bibrec > div > table > tbody > tr:nth-child(19) > td')
        .text()
        .trim() || 'Unknown Release Date';

    // Extract EBook-No.
    const ebookNumber =
      $('#bibrec > div > table > tbody > tr:nth-child(18) > td')
        .text()
        .trim() || 'Unknown EBook-No.';

    // Extract download links
    const downloadLinks: { format: string; url: string }[] = [];
    $('table.files a[href*="/ebooks/"]').each((_, element) => {
      const format = $(element).text().trim();
      const url = $(element).attr('href')
        ? `https://www.gutenberg.org${$(element).attr('href')}`
        : '';

      // Only add the link if both format and url are non-empty
      if (format && url) {
        downloadLinks.push({ format, url });
      }
    });

    const metadata = {
      title,
      author,
      coverImage,
      releaseDate,
      ebookNumber,
      downloadLinks,
    };

    return NextResponse.json({ content, metadata });
  } catch (error) {
    console.error('Error fetching book data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book data' },
      { status: 500 }
    );
  }
}
