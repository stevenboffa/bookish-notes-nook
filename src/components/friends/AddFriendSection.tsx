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

interface AddFriendSectionProps {
  onAddFriend: (email: string) => Promise<void>;
  isLoading: boolean;
}

export function AddFriendSection({ onAddFriend, isLoading }: AddFriendSectionProps) {
  const [email, setEmail] = useState("");

  return (
    <Card className="mb-8 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Add a Friend</CardTitle>
        <CardDescription>
          Enter your friend's email to send them a friend request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Input
            type="email"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={() => {
              onAddFriend(email);
              setEmail("");
            }}
            disabled={isLoading || !email}
            className="min-w-[100px]"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}