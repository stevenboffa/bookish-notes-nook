import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

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
    content: "\"All we have to decide is what to do with the time that is given us.\" This quote from Gandalf has guided so many of my life decisions when facing difficult choices.",
    bookTitle: "The Lord of the Rings",
    userName: "Maria L.",
    userInitials: "ML"
  },
  {
    id: "3",
    content: "Four stages of competence: unconscious incompetence, conscious incompetence, conscious competence, and unconscious competence. I'm definitely at stage 2 with my writing skills.",
    bookTitle: "Ultralearning",
    userName: "James T.",
    userInitials: "JT"
  },
  {
    id: "4",
    content: "\"I must not fear. Fear is the mind-killer.\" The Bene Gesserit litany against fear is something I recite to myself before every public speaking event.",
    bookTitle: "Dune",
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
    content: "\"So we beat on, boats against the current, borne back ceaselessly into the past.\" This final line haunts me with its beautiful imagery of struggling against inevitable nostalgia.",
    bookTitle: "The Great Gatsby",
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
    content: "\"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\" Such a brilliantly ironic opening line that sets up the entire novel's examination of marriage and social status.",
    bookTitle: "Pride and Prejudice",
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
    content: "\"Call me Ishmael.\" Three simple words that begin such an epic journey. I'm fascinated by how much weight a short opening line can carry.",
    bookTitle: "Moby Dick",
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
    <div className="relative h-[480px] overflow-hidden">
      {/* Notes container with smooth scrolling */}
      <div 
        className="relative overflow-hidden py-6" 
        style={{ height: '100%' }}
      >
        <div 
          ref={containerRef}
          className="space-y-5 transition-none px-2"
          style={{ 
            transform: `translateY(-${scrollPosition}px)`,
          }}
        >
          {displayNotes.map((note, index) => (
            <Card 
              key={`${note.id}-${index}`}
              className={cn(
                "backdrop-blur-sm shadow-lg transition-all duration-500",
                index % 2 === 0 ? "bg-white/20" : "bg-primary/20"
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-medium text-sm shrink-0">
                    {note.userInitials}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm italic text-white">{note.content}</p>
                    <div className="text-xs text-white/70">
                      <span className="font-medium text-white/90">{note.userName}</span> on <span className="font-medium text-white/90">{note.bookTitle}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
