
import React from 'react';
import ResourceCard from './ResourceCard';
import { LucideIcon } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  readTime: string;
  link: string;
}

interface ResourceSectionProps {
  title: string;
  resources: Resource[];
  bgColor?: string;
}

const ResourceSection: React.FC<ResourceSectionProps> = ({
  title,
  resources,
  bgColor = "bg-white"
}) => {
  return (
    <section className={`rounded-xl ${bgColor} overflow-hidden mb-10 p-6 md:p-8`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            id={resource.id}
            title={resource.title}
            description={resource.description}
            icon={resource.icon}
            readTime={resource.readTime}
            link={resource.link}
          />
        ))}
      </div>
    </section>
  );
};

export default ResourceSection;
