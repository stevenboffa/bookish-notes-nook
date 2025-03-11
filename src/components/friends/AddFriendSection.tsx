
import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddFriendSectionProps {
  onAddFriend: (email: string) => Promise<void>;
  isLoading: boolean;
}

export function AddFriendSection({ onAddFriend, isLoading }: AddFriendSectionProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.trim()) {
      setError("Email is required");
      return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError(null);
    
    try {
      await onAddFriend(email);
      setEmail("");
    } catch (error) {
      console.error("Error adding friend:", error);
      toast("Failed to add friend. Please try again.");
    }
  };

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
          onSubmit={handleSubmit}
        >
          <div className="flex-1">
            <Input
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              className={cn(error ? "border-red-500" : "")}
              disabled={isLoading}
              aria-invalid={!!error}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          <Button 
            type="submit"
            disabled={isLoading || !email}
            className={cn(
              "min-w-[100px]",
              isMobile ? "w-full" : ""
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Add
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
