
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FriendAvatarProps {
  email: string;
  username?: string | null;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

export function FriendAvatar({ email, username, avatarUrl, size = "md" }: FriendAvatarProps) {
  const getInitials = (text: string) => {
    return text.slice(0, 2).toUpperCase();
  };

  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  }[size];

  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={avatarUrl || undefined} />
      <AvatarFallback className="bg-primary/10">
        {username ? getInitials(username) : getInitials(email)}
      </AvatarFallback>
    </Avatar>
  );
}
