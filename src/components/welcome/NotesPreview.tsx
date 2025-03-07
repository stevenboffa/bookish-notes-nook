
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  }
];

export function NotesPreview() {
  return (
    <div className="space-y-5">
      {SAMPLE_NOTES.map((note, index) => (
        <Card 
          key={note.id}
          className={cn(
            "backdrop-blur-sm border-primary/10", 
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
  );
}
