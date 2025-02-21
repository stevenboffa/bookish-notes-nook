
export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
    categories: string[];
  };
}

export interface AIBookRecommendation {
  title: string;
  author: string;
  publicationYear: string;
  description: string;
  rating?: string;
  themes: string[];
  imageUrl?: string;
  amazonUrl?: string;
}
