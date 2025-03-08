
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AtSign, Mail, MessageCircle, HelpCircle, Facebook, Instagram } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    });
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Header />
      <div className="container max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
              Have questions about BookishNotes? We're here to help with any inquiries about our reading notes platform.
              Check our <Link to="/faq" className="text-primary hover:underline">FAQ page</Link> for quick answers.
            </p>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Information Cards */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">FAQ</h3>
                    <p className="text-sm text-muted-foreground">
                      Find quick answers to common questions.
                    </p>
                    <Link to="/faq" className="text-sm font-medium text-primary mt-1 block">
                      Visit our FAQ page
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <AtSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Social Media</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with us on social platforms.
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <a href="https://www.facebook.com/profile.php?id=61573865312172" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                        <Facebook className="h-5 w-5" color="#4267B2" />
                      </a>
                      <a href="https://x.com/bookishnotesapp" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                        <img 
                          src="/lovable-uploads/414d71e0-1338-48d5-8c9d-41110af89248.png" 
                          alt="X (Twitter)" 
                          className="h-5 w-5" 
                        />
                      </a>
                      <a href="https://www.instagram.com/bookishnotesapp" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors">
                        <Instagram className="h-5 w-5" color="#E1306C" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll respond as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Jane Smith"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="jane@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Your message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us what you need help with..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <MessageCircle className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
