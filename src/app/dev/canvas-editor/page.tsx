import { CanvasEditor } from '@/components/dev/CanvasEditor';

// Sample data for testing
const sampleData = {
  book: {
    title: "Go the F**k to Sleep",
    author: "Adam Mansbach"
  },
  aiSummary: {
    overview: "A humorous bedtime book that captures the frustration of parents trying to get their children to sleep.",
    themes: ["Parenting Challenges", "Humor in Reality", "Vivid Storytelling"],
    engagement: "The book's honest portrayal of bedtime struggles resonates with parents worldwide.",
    criticalThinking: "The book effectively uses contrast between traditional lullabies and realistic parental thoughts.",
    emotionalResponse: "The humor provides relief and validation for parents experiencing similar situations.",
    keyTakeaways: [
      "Parenting isn't always picture perfect",
      "Humor can help cope with frustration",
      "Shared experiences unite parents"
    ],
    suggestedReflections: [
      "How does humor help in parenting?",
      "What makes this book so relatable?",
      "How does it compare to traditional children's books?"
    ]
  }
};

export default function CanvasEditorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Canvas Editor (Development Only)</h1>
        <CanvasEditor book={sampleData.book} aiSummary={sampleData.aiSummary} />
      </div>
    </div>
  );
} 