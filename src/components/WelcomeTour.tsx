
import React, { useEffect } from 'react';
import { TooltipTour } from './ui/tooltip-tour';
import { useWelcomeTour } from '@/hooks/use-welcome-tour';

export function WelcomeTour() {
  const { 
    isTourOpen, 
    tourSteps, 
    completeTour, 
    skipTour 
  } = useWelcomeTour();
  
  // Add this to debug if the tour is initialized correctly
  useEffect(() => {
    console.log("Tour status:", { isTourOpen, stepsCount: tourSteps.length });
  }, [isTourOpen, tourSteps]);
  
  // Only render if tour is open and we have steps
  if (!isTourOpen || tourSteps.length === 0) return null;
  
  return (
    <TooltipTour
      steps={tourSteps}
      isOpen={isTourOpen}
      onComplete={completeTour}
      onSkip={skipTour}
    />
  );
}
