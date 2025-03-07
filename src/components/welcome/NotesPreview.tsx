
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

// Sample notes data - in a real implementation, this would come from the database
const SAMPLE_NOTES = [
  {
    id: "1",
    content: "\"The ability to simplify means to eliminate the unnecessary so that the necessary may speak.\" This perfectly captures why I need to declutter both my space and my mind.",
    bookTitle: "The Life-Changing Magic of Tidying Up",
    userName: "Alex K.",
    userInitials: "AK"
  },
  {
    id: "2",
    content: "Kahneman's explanation of System 1 (fast, intuitive) and System 2 (slow, deliberate) thinking explains so much about my decision-making biases. I need to be more aware of when I'm using which system.",
    bookTitle: "Thinking, Fast and Slow",
    userName: "Maria L.",
    userInitials: "ML"
  },
  {
    id: "3",
    content: "The four stages of competence: unconscious incompetence, conscious incompetence, conscious competence, and unconscious competence. I'm definitely at stage 2 with my writing skills.",
    bookTitle: "Ultralearning",
    userName: "James T.",
    userInitials: "JT"
  },
  {
    id: "4",
    content: "\"We buy things we don't need with money we don't have to impress people we don't like.\" This quote hit me hard. I'm rethinking my spending habits now.",
    bookTitle: "Your Money or Your Life",
    userName: "Sarah P.",
    userInitials: "SP"
  },
  {
    id: "5",
    content: "The concept of 'deep work' is exactly what I've been missing in my daily routine. I'm blocking out 2 hours each morning now for focused work.",
    bookTitle: "Deep Work",
    userName: "Michael R.",
    userInitials: "MR"
  },
  {
    id: "6",
    content: "\"It is not that we have a short time to live, but that we waste a lot of it.\" Seneca's words still ring true 2,000 years later.",
    bookTitle: "On the Shortness of Life",
    userName: "Priya S.",
    userInitials: "PS"
  },
  {
    id: "7",
    content: "I never realized how much our environment shapes our behavior until reading this book. Making small changes to my space has already improved my habits.",
    bookTitle: "Atomic Habits",
    userName: "David L.",
    userInitials: "DL"
  },
  {
    id: "8",
    content: "The practice of accepting uncertainty rather than fighting it has been life-changing for managing my anxiety.",
    bookTitle: "Comfortable with Uncertainty",
    userName: "Emma J.",
    userInitials: "EJ"
  },
  {
    id: "9",
    content: "\"The obstacle is the way.\" This simple Stoic principle has changed how I approach every problem in my life.",
    bookTitle: "The Obstacle Is the Way",
    userName: "Robert T.",
    userInitials: "RT"
  },
  {
    id: "10",
    content: "Learning that willpower is a finite resource that depletes throughout the day helped me restructure my schedule for better productivity.",
    bookTitle: "Willpower",
    userName: "Nora H.",
    userInitials: "NH"
  }
];

export function NotesPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const noteHeight = 170; // Approximate height of each note card
  const totalHeight = SAMPLE_NOTES.length * noteHeight;
  
  useEffect(() => {
    const animateScroll = () => {
      setScrollPosition(prevPosition => {
        const newPosition = prevPosition + 1; // Smooth scrolling speed
        
        // Reset when reaching the end to create an infinite loop
        if (newPosition >= totalHeight - noteHeight * 3) {
          return 0;
        }
        
        return newPosition;
      });
    };
    
    const animation = setInterval(animateScroll, 30); // Smoother animation with more frequent, smaller updates
    
    return () => clearInterval(animation);
  }, [totalHeight]);
  
  // Create a duplicated array for seamless looping
  const displayNotes = [...SAMPLE_NOTES, ...SAMPLE_NOTES];
  
  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      
      {/* Notes container with smooth scrolling */}
      <div className="relative overflow-hidden" style={{ height: '100%' }}>
        <div 
          ref={containerRef}
          className="space-y-5 transition-none"
          style={{ 
            transform: `translateY(-${scrollPosition}px)`,
          }}
        >
          {displayNotes.map((note, index) => (
            <Card 
              key={`${note.id}-${index}`}
              className={cn(
                "backdrop-blur-sm border-primary/10 transition-all duration-500",
                index % 2 === 0 ? "bg-primary/5" : "bg-white/20"
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm shrink-0">
                    {note.userInitials}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm italic">{note.content}</p>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{note.userName}</span> on <span className="font-medium text-foreground">{note.bookTitle}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
}
