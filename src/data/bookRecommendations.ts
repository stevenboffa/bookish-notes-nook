import type { AIBookRecommendation } from "@/types/books";

interface CategoryBooks {
  [key: string]: {
    "award-winning": AIBookRecommendation[];
    "new": AIBookRecommendation[];
  };
}

export const bookRecommendations: CategoryBooks = {
  "science-fiction": {
    "award-winning": [
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        description: "A lone astronaut must save humanity from a catastrophic event threatening Earth's existence.",
        imageUrl: "https://m.media-amazon.com/images/I/71dNsXqHrGL._AC_UF1000,1000_QL80_.jpg",
        publicationYear: "2021",
        rating: "4.8",
        themes: ["Space Exploration", "Scientific Discovery", "Survival"],
        readingDifficulty: "Medium",
        pageCount: "496",
        targetAudience: "Adult",
        hook: "A thrilling space adventure that will keep you on the edge of your seat",
        awards: "Goodreads Choice Award 2021",
        amazonUrl: "https://www.amazon.com/Project-Hail-Mary-Andy-Weir/dp/0593135202?tag=bookishnotes-20"
      },
      // Add more award-winning science fiction books...
    ],
    "new": [
      {
        title: "The Last Astronaut",
        author: "David Wellington",
        description: "A gripping tale of humanity's last hope as they face an alien threat.",
        imageUrl: "https://m.media-amazon.com/images/I/71dNsXqHrGL._AC_UF1000,1000_QL80_.jpg",
        publicationYear: "2024",
        rating: "4.5",
        themes: ["Alien Contact", "Space Travel", "Humanity's Future"],
        readingDifficulty: "Medium",
        pageCount: "384",
        targetAudience: "Adult",
        hook: "A fresh take on first contact that will challenge your assumptions",
        amazonUrl: "https://www.amazon.com/Last-Astronaut-David-Wellington/dp/0593135202?tag=bookishnotes-20"
      },
      // Add more new science fiction books...
    ]
  },
  "fantasy": {
    "award-winning": [
      {
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        description: "A masterfully crafted fantasy following the life of Kvothe, a legendary musician and magician.",
        imageUrl: "https://m.media-amazon.com/images/I/71dNsXqHrGL._AC_UF1000,1000_QL80_.jpg",
        publicationYear: "2007",
        rating: "4.9",
        themes: ["Magic", "Music", "Coming of Age"],
        readingDifficulty: "Medium",
        pageCount: "662",
        targetAudience: "Adult",
        hook: "A masterpiece of fantasy that redefines the genre",
        awards: "Quill Award 2007",
        amazonUrl: "https://www.amazon.com/Name-Wind-Kingkiller-Chronicle/dp/0756404746?tag=bookishnotes-20"
      },
      // Add more award-winning fantasy books...
    ],
    "new": [
      {
        title: "The Atlas Complex",
        author: "Olivie Blake",
        description: "The final installment in the Atlas series, where six magicians must face their destiny.",
        imageUrl: "https://m.media-amazon.com/images/I/71dNsXqHrGL._AC_UF1000,1000_QL80_.jpg",
        publicationYear: "2024",
        rating: "4.7",
        themes: ["Magic", "Mystery", "Romance"],
        readingDifficulty: "Medium",
        pageCount: "432",
        targetAudience: "Adult",
        hook: "A stunning conclusion to an epic magical series",
        amazonUrl: "https://www.amazon.com/Atlas-Complex-Olivie-Blake/dp/0593135202?tag=bookishnotes-20"
      },
      // Add more new fantasy books...
    ]
  },
  // Add more categories...
}; 