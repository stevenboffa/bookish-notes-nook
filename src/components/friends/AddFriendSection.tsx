import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddFriendSectionProps {
  onAddFriend: (email: string) => Promise<void>;
  isLoading: boolean;
}

export function AddFriendSection({ onAddFriend, isLoading }: AddFriendSectionProps) {
  const [email, setEmail] = useState("");
  const isMobile = useIsMobile();

  return (
    <Card className="mb-8 animate-fade-in">
      <CardHeader className={cn(isMobile ? "p-4" : "")}>
        <CardTitle className="text-xl">Add a Friend</CardTitle>
        <CardDescription>
          Enter your friend's email to send them a friend request
        </CardDescription>
      </CardHeader>
      <CardContent className={cn(isMobile ? "p-4" : "")}>
        <form 
          className="flex flex-col sm:flex-row gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onAddFriend(email);
            setEmail("");
          }}
        >
          <Input
            type="email"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit"
            disabled={isLoading || !email}
            className={cn(
              "min-w-[100px]",
              isMobile ? "w-full" : ""
            )}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}