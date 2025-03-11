
import React from 'react';
import { TooltipTour } from './ui/tooltip-tour';
import { useWelcomeTour } from '@/hooks/use-welcome-tour';
import { useToast } from '@/hooks/use-toast';

export function WelcomeTour() {
  const { 
    isTourOpen, 
    tourSteps, 
    completeTour, 
    skipTour 
  } = useWelcomeTour();
  
  return (
    <TooltipTour
      steps={tourSteps}
      isOpen={isTourOpen}
      onComplete={completeTour}
      onSkip={skipTour}
    />
  );
}
