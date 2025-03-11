
import { useState, useEffect } from 'react';
import { TourStep } from '@/components/ui/tooltip-tour';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define tour steps
const defaultTourSteps: TourStep[] = [
  {
    target: '[data-tour="add-book"]',
    title: 'Add Your First Book',
    content: 'Start by adding books to your collection. Click here to add your first book!',
    position: 'bottom',
  },
  {
    target: '[data-tour="book-collection"]',
    title: 'Your Book Collection',
    content: 'This is where all your books will appear. You can filter, sort, and organize them.',
    position: 'bottom',
  },
  {
    target: '[data-tour="friends"]',
    title: 'Connect with Friends',
    content: 'Discover what your friends are reading and share your recommendations.',
    position: 'bottom',
  },
  {
    target: '[data-tour="profile"]',
    title: 'Your Profile',
    content: 'View and update your profile settings here.',
    position: 'top',
  }
];

export function useWelcomeTour() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();
  const { toast } = useToast();

  // Check if user has completed the tour
  useEffect(() => {
    const checkTourStatus = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('tour_completed')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching tour status:", error);
          setIsLoading(false);
          return;
        }

        const completed = data?.tour_completed || false;
        setTourCompleted(completed);
        console.log("Tour completed status:", completed);
        
        // Auto-open tour for new users who haven't completed it
        if (data && data.tour_completed === false) {
          // Small delay to ensure the page is fully rendered
          setTimeout(() => {
            console.log("Auto-opening tour for new user");
            setIsTourOpen(true);
          }, 1500);
        }
      } catch (error) {
        console.error('Error checking tour status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTourStatus();
  }, [session?.user]);

  // Mark tour as completed
  const completeTour = async () => {
    if (!session?.user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tour_completed: true })
        .eq('id', session.user.id);

      if (error) {
        throw error;
      }

      setTourCompleted(true);
      setIsTourOpen(false);
      toast({
        title: "Tour completed!",
        description: "You can restart the tour anytime from your profile settings.",
      });
    } catch (error) {
      console.error('Error updating tour status:', error);
      toast({
        title: "Error updating tour status",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Skip the tour
  const skipTour = async () => {
    if (!session?.user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tour_completed: true })
        .eq('id', session.user.id);

      if (error) {
        throw error;
      }

      setTourCompleted(true);
      setIsTourOpen(false);
      toast({
        title: "Tour skipped",
        description: "You can start the tour anytime from your profile settings.",
      });
    } catch (error) {
      console.error('Error updating tour status:', error);
    }
  };

  // Restart the tour - this is the function called by the button in the Profile page
  const restartTour = () => {
    console.log("Restarting tour...");
    setIsTourOpen(true);
  };

  return {
    isTourOpen,
    tourCompleted,
    isLoading,
    tourSteps: defaultTourSteps,
    openTour: () => setIsTourOpen(true),
    closeTour: () => setIsTourOpen(false),
    completeTour,
    skipTour,
    restartTour,
  };
}
