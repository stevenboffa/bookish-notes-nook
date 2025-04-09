interface GoogleBookResponse {
  items?: Array<{
    volumeInfo: {
      title: string;
      authors: string[];
      description: string;
      publishedDate: string;
      imageLinks?: {
        thumbnail: string;
      };
      industryIdentifiers?: Array<{
        type: string;
        identifier: string;
      }>;
    };
  }>;
}

export async function fetchBookCover(title: string, author: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    console.log(`Fetching book cover for: ${title} by ${author}`);
    console.log(`Query URL: https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
    
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch book data: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch book data');
    }

    const data: GoogleBookResponse = await response.json();
    console.log('Google Books API response:', data);
    
    if (!data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail) {
      console.log('No thumbnail found in response');
      return null;
    }

    // Convert the thumbnail URL to a higher quality image
    const thumbnailUrl = data.items[0].volumeInfo.imageLinks.thumbnail;
    const highQualityUrl = thumbnailUrl.replace('zoom=1', 'zoom=2');
    console.log('Found thumbnail URL:', highQualityUrl);
    return highQualityUrl;
  } catch (error) {
    console.error('Error fetching book cover:', error);
    return null;
  }
}

export async function getBookDetails(title: string, author: string) {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    console.log(`Fetching book details for: ${title} by ${author}`);
    
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch book data: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch book data');
    }

    const data: GoogleBookResponse = await response.json();
    console.log('Google Books API response:', data);
    
    if (!data.items?.[0]?.volumeInfo) {
      console.log('No book details found in response');
      return null;
    }

    const book = data.items[0].volumeInfo;
    const result = {
      title: book.title,
      author: book.authors?.[0] || author,
      description: book.description || '',
      publicationYear: book.publishedDate?.split('-')[0] || '',
      imageUrl: book.imageLinks?.thumbnail?.replace('zoom=1', 'zoom=2') || null,
      isbn: book.industryIdentifiers?.[0]?.identifier || '',
    };
    console.log('Processed book details:', result);
    return result;
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
} 