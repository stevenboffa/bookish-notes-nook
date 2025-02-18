
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FriendAvatarProps {
  email: string;
  size?: "sm" | "md" | "lg";
}

export function FriendAvatar({ email, size = "md" }: FriendAvatarProps) {
  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  }[size];

  return (
    <Avatar className={sizeClass}>
      <AvatarFallback className="bg-primary/10">
        {getInitials(email)}
      </AvatarFallback>
    </Avatar>
  );
}
