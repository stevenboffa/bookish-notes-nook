
import React, { ReactNode, useState, useEffect } from "react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type TourStep = {
  target: string; // CSS selector for the target element
  title: string;
  content: ReactNode;
  position?: "top" | "right" | "bottom" | "left";
};

interface TooltipTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function TooltipTour({ steps, isOpen, onComplete, onSkip }: TooltipTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTooltipOpen(false);
      return;
    }

    const findTarget = () => {
      if (currentStep < steps.length) {
        const target = document.querySelector(steps[currentStep].target) as HTMLElement;
        setTargetElement(target);
        
        // Add highlighting effect
        if (target) {
          target.classList.add("tour-highlight");
          
          // Scroll into view if needed
          if (!isElementInViewport(target)) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          
          // Open tooltip after a short delay to ensure scrolling is complete
          setTimeout(() => {
            setTooltipOpen(true);
          }, 400);
        }
      }
    };

    findTarget();

    return () => {
      // Remove highlight from previous element
      if (targetElement) {
        targetElement.classList.remove("tour-highlight");
      }
    };
  }, [isOpen, currentStep, steps]);

  const isElementInViewport = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setTooltipOpen(false);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setTooltipOpen(false);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
      }, 300);
    }
  };

  const handleComplete = () => {
    setTooltipOpen(false);
    if (targetElement) {
      targetElement.classList.remove("tour-highlight");
    }
    setCurrentStep(0);
    onComplete();
  };

  const handleSkip = () => {
    setTooltipOpen(false);
    if (targetElement) {
      targetElement.classList.remove("tour-highlight");
    }
    setCurrentStep(0);
    onSkip();
  };

  if (!isOpen || !targetElement) return null;

  const currentStepData = steps[currentStep];
  const position = currentStepData.position || "bottom";

  return (
    <div className="tooltip-tour">
      <TooltipProvider>
        <Tooltip open={tooltipOpen}>
          <TooltipTrigger asChild>
            <span className="invisible absolute" style={{ left: 0, top: 0 }} />
          </TooltipTrigger>
          <TooltipContent
            side={position}
            align="center"
            className="w-72 p-0 border-primary/20 bg-white shadow-lg"
            sideOffset={10}
          >
            <div className="relative">
              <button 
                onClick={handleSkip}
                className="absolute right-2 top-2 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close tour"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="p-4 pb-2">
                <h3 className="text-base font-semibold mb-1">{currentStepData.title}</h3>
                <div className="text-sm text-gray-600">{currentStepData.content}</div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 border-t">
                <div className="text-xs text-gray-500">{currentStep + 1} of {steps.length}</div>
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handlePrevious}
                      className="h-8"
                    >
                      <ArrowLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    onClick={handleNext}
                    className="h-8"
                  >
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'} {currentStep < steps.length - 1 && <ArrowRight className="h-3 w-3 ml-1" />}
                  </Button>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Semi-transparent overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 pointer-events-none z-40"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
