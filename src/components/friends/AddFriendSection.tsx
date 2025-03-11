import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddFriendSectionProps {
  onAddFriend?: (email: string) => Promise<void>;
  isLoading?: boolean;
}

export function AddFriendSection({ onAddFriend, isLoading: externalLoading }: AddFriendSectionProps = {}) {
  const { session } = useAuth();
  const [friendEmail, setFriendEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) return;
    if (!friendEmail.trim()) return;
    
    // If the parent component provided an onAddFriend handler, use that
    if (onAddFriend) {
      await onAddFriend(friendEmail);
      setFriendEmail('');
      return;
    }
    
    // Otherwise use the default implementation
    setIsSubmitting(true);
    
    try {
      // Check if the user exists
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', friendEmail.trim())
        .maybeSingle();
      
      if (userError) throw userError;
      
      if (!users) {
        toast({
          title: "User not found",
          description: "No user found with that email address.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Check if it's the user's own email
      if (users.id === session.user.id) {
        toast({
          title: "Cannot add yourself",
          description: "You cannot add yourself as a friend.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Check if a friend request already exists
      const { data: existingRequest, error: requestError } = await supabase
        .from('friends')
        .select('id, status')
        .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
        .or(`sender_id.eq.${users.id},receiver_id.eq.${users.id}`)
        .maybeSingle();
      
      if (requestError) throw requestError;
      
      if (existingRequest) {
        toast({
          title: "Request exists",
          description: "A friend request with this user already exists.",
          variant: "default",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Add friend request
      const { error: insertError } = await supabase
        .from('friends')
        .insert({
          sender_id: session.user.id,
          receiver_id: users.id,
          status: 'pending'
        });
      
      if (insertError) throw insertError;
      
      toast({
        title: "Friend request sent",
        description: "Your friend request has been sent successfully.",
      });
      
      setFriendEmail('');
    } catch (error) {
      console.error("Error adding friend:", error);
      toast({
        title: "Error",
        description: "Failed to add friend. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if loading state should come from parent or local state
  const isLoading = externalLoading !== undefined ? externalLoading : isSubmitting;

  return (
    <form onSubmit={handleAddFriend} className="flex items-center gap-2 mb-6" data-tour="friends">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="email"
          placeholder="Add friend by email"
          className="pl-8"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Friend"}
      </Button>
    </form>
  );
}
