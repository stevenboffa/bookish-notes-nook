import { User, UserMinus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Friend } from "@/pages/Friends";

interface FriendCardProps {
  friend: Friend;
  isSelected: boolean;
  onSelect: (friend: Friend) => void;
  onRemove: (friendId: string) => void;
}

export function FriendCard({ friend, isSelected, onSelect, onRemove }: FriendCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
        isSelected ? "ring-2 ring-primary" : "",
        "animate-fade-in"
      )}
      onClick={() => onSelect(friend)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium">
              {friend.email}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <BookOpen className="h-4 w-4" />
              {friend.books.length} books
            </CardDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(friend.id);
          }}
        >
          <UserMinus className="h-4 w-4" />
        </Button>
      </CardHeader>
    </Card>
  );
}