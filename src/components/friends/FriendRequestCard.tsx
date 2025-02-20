
import { UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FriendAvatar } from "./FriendAvatar";
import { FriendRequest } from "./types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function FriendRequestCard({ request, onAccept, onReject }: FriendRequestCardProps) {
  const isMobile = useIsMobile();

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-lg",
      "animate-fade-in active:scale-95 touch-manipulation",
      isMobile ? "p-2" : ""
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FriendAvatar 
            email={request.sender.email}
            username={request.sender.username}
            avatarUrl={request.sender.avatar_url}
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium truncate">
              {request.sender.username || request.sender.email}
            </CardTitle>
            <CardDescription>
              Wants to be your friend
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAccept(request.id)}
            className="text-green-500 hover:text-green-600 hover:bg-green-50"
          >
            <UserCheck className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReject(request.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <UserX className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
