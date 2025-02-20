const genreFallbackImages: Record<string, string> = {
  "Fiction": "/placeholder-fiction.svg",
  "Non-Fiction": "/placeholder-non-fiction.svg",
  "Mystery": "/placeholder-mystery.svg",
  "Science Fiction": "/placeholder-scifi.svg",
  "Fantasy": "/placeholder-fantasy.svg",
  "Romance": "/placeholder-romance.svg",
  "Thriller": "/placeholder-thriller.svg",
  "Horror": "/placeholder-horror.svg",
  "Biography": "/placeholder-biography.svg",
  "History": "/placeholder-history.svg",
  "Self-Help": "/placeholder-self-help.svg",
  "Poetry": "/placeholder-poetry.svg",
  "Drama": "/placeholder-drama.svg",
  "Adventure": "/placeholder-adventure.svg",
  "Children's": "/placeholder-children.svg",
};

export const getBookCoverFallback = (genre: string) => {
  // If we have a genre-specific fallback, use it
  if (genreFallbackImages[genre]) {
    return genreFallbackImages[genre];
  }
  
  // Otherwise return null to trigger the CSS fallback
  return null;
};
