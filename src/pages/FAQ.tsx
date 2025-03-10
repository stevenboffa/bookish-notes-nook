import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, BookOpen, Search, HelpCircle, Mail, Settings, Shield, CreditCard, BookText } from "lucide-react";
import { useState } from "react";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { Meta } from "@/components/Meta";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  icon: JSX.Element;
};

export default function FAQ() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const faqCategories = [
    {
      title: "Using BookishNotes",
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      faqs: [
        {
          id: 1,
          question: "Is BookishNotes really free to use?",
          answer: "Yes! BookishNotes is completely free to use. We believe in making reading tools accessible to everyone without paywalls.",
          icon: <CreditCard className="h-5 w-5" />,
        },
        {
          id: 2,
          question: "How do I get started?",
          answer: "Simply create an account, add books to your library, and start taking notes. Our intuitive interface makes it easy to organize your reading.",
          icon: <BookOpen className="h-5 w-5" />,
        },
        {
          id: 3,
          question: "Can I export my notes?",
          answer: "Yes, you can export your notes in various formats including PDF, plain text, and markdown to use them however you like.",
          icon: <BookText className="h-5 w-5" />,
        },
        {
          id: 4,
          question: "How do I organize my reading notes?",
          answer: "BookishNotes offers tags, collections, and categories to help you organize notes. You can also search and filter your notes to find what you need quickly.",
          icon: <Settings className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Account & Security",
      icon: <Shield className="h-5 w-5 text-primary" />,
      faqs: [
        {
          id: 5,
          question: "How secure are my notes?",
          answer: "Your data security is our priority. We use industry-standard encryption and secure servers to keep your reading notes safe.",
          icon: <Shield className="h-5 w-5" />,
        },
        {
          id: 6,
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account at any time from your profile settings. This will permanently remove all your data from our servers.",
          icon: <Settings className="h-5 w-5" />,
        },
        {
          id: 7,
          question: "Is my reading data shared with anyone?",
          answer: "No, your reading data is private by default. You can choose to share specific notes or collections with friends, but we never share your data with third parties without your consent.",
          icon: <Shield className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Features & Support",
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      faqs: [
        {
          id: 8,
          question: "Can I use BookishNotes offline?",
          answer: "Currently, BookishNotes requires an internet connection. However, we're developing an offline mode that will be available in the future.",
          icon: <Settings className="h-5 w-5" />,
        },
        {
          id: 9,
          question: "Is there a mobile app?",
          answer: "Our web application is fully responsive and works great on mobile devices. We're also working on dedicated iOS and Android apps that will be released soon.",
          icon: <Settings className="h-5 w-5" />,
        },
        {
          id: 10,
          question: "How do I request a new feature?",
          answer: "We love hearing your ideas! You can submit feature requests through our contact form or by emailing us directly at suggestions@bookishnotes.app.",
          icon: <Mail className="h-5 w-5" />,
        },
        {
          id: 11,
          question: "What do I do if I encounter a bug?",
          answer: "Please report any bugs you find by emailing support@bookishnotes.app with details about the issue and steps to reproduce it. Screenshots are always helpful.",
          icon: <HelpCircle className="h-5 w-5" />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Meta 
        title="Frequently Asked Questions"
        description="Get answers to common questions about BookishNotes features, account setup, note-taking functionality, and more in our comprehensive FAQ."
      />
      <Header />
      <div className="container max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
              Find answers to common questions about BookishNotes. Can't find what you're looking for?
              <Link to="/contact" className="text-primary font-medium ml-1 hover:underline">
                Contact us
              </Link>.
            </p>
          </div>
        </section>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-12 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full py-3 pl-10 pr-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
            placeholder="Search FAQs..."
          />
        </div>

        {/* FAQ Categories */}
        {faqCategories.map((category, index) => (
          <div key={index} className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              {category.icon}
              <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
            </div>
            
            <div className="grid gap-4">
              {category.faqs.map((faq) => (
                <Card 
                  key={faq.id} 
                  className={`transition-all duration-200 ${expandedId === faq.id ? 'border-primary/50 shadow-md' : 'hover:border-gray-300'}`}
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full text-left flex items-center justify-between p-5 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          {faq.icon}
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                      {expandedId === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedId === faq.id && (
                      <div className="px-5 pb-5 pt-0 border-t border-gray-100 animate-slide-up">
                        <p className="text-gray-600 mt-2">{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* CTA Section */}
        <section className="mt-16 bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 max-w-lg mx-auto mb-6">
            We're here to help with any specific questions about BookishNotes that weren't covered in our FAQ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:support@bookishnotes.app">Email Us Directly</a>
            </Button>
          </div>
        </section>
      </div>
      <BlogFooter />
    </div>
  );
}
