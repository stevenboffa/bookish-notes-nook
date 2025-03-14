
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";

export function UserTestimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    
    // Auto-scroll every 6 seconds
    const autoplayInterval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 6000);
    
    return () => {
      clearInterval(autoplayInterval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const testimonials = [
    {
      quote: "I've read hundreds of books but always struggled to remember the key points later. BookishNotes has completely changed how I retain information.",
      name: "Sarah K.",
      title: "Literature Professor",
      avatar: "/placeholder.svg"
    },
    {
      quote: "As a medical student, I need to absorb and recall massive amounts of information. This app has become an essential part of my study routine.",
      name: "Michael T.",
      title: "Medical Student",
      avatar: "/placeholder.svg"
    },
    {
      quote: "The ability to connect ideas across different books has given me insights I would have missed otherwise. It's like having a second brain.",
      name: "David L.",
      title: "Business Consultant",
      avatar: "/placeholder.svg"
    },
    {
      quote: "I've tried many note-taking apps, but BookishNotes is specifically designed for readers. It's exactly what I've been looking for.",
      name: "Aisha J.",
      title: "Book Club Organizer",
      avatar: "/placeholder.svg"
    },
  ];

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div className="flex-[0_0_100%] min-w-0 pl-4 first:pl-0" key={index}>
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 h-full">
                <CardContent className="p-8 md:p-10 flex flex-col justify-between h-full">
                  <div className="mb-6">
                    <div className="text-2xl text-primary mb-2">❝</div>
                    <p className="text-lg italic mb-8">{testimonial.quote}</p>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <div className="h-12 w-12 rounded-full bg-muted overflow-hidden">
                          <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-6 space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous testimonial</span>
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next testimonial</span>
        </Button>
      </div>
      
      <div className="flex justify-center mt-4 space-x-1">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              activeIndex === index ? "w-6 bg-primary" : "w-2 bg-muted"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
