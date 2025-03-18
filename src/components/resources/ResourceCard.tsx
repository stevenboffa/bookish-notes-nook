
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { trackButtonClick } from "@/components/GoogleAnalytics";

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  readTime: string;
  link: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  readTime,
  link
}) => {
  return (
    <Link 
      to={link} 
      className="block h-full" 
      onClick={() => trackButtonClick(`resource_${id}`, "resources")}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] border border-gray-100">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <div className="rounded-full p-3 bg-indigo-100 text-indigo-600 flex-shrink-0">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm mb-4">{description}</p>
            </div>
          </div>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <span className="inline-flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                {readTime}
              </span>
            </div>
            <span className="text-indigo-600 text-sm font-medium hover:underline">
              Read more →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ResourceCard;
