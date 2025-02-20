
import { UserMinus, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Friend } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { FriendAvatar } from "./FriendAvatar";

interface FriendCardProps {
  friend: Friend;
  isSelected: boolean;
  onSelect: (friend: Friend) => void;
  onRemove: (friendId: string) => void;
}

export function FriendCard({ friend, isSelected, onSelect, onRemove }: FriendCardProps) {
  const isMobile = useIsMobile();

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
        isSelected ? "ring-2 ring-primary" : "",
        "animate-fade-in active:scale-95 touch-manipulation",
        isMobile ? "p-2" : ""
      )}
      onClick={() => onSelect(friend)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FriendAvatar 
            email={friend.email}
            username={friend.username}
            avatarUrl={friend.avatar_url}
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium truncate">
              {friend.username || friend.email}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{friend.books.length} books</span>
            </CardDescription>
          </div>
          {isMobile && (
            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "transition-opacity",
                isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Friend</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {friend.username || friend.email} from your friends? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => onRemove(friend.id)}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  );
}
