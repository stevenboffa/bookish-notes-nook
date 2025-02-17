
import { Card, CardContent } from "@/components/ui/card";

interface BookCategoryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onClick: () => void;
}

export function BookCategoryCard({ title, description, imageUrl, onClick }: BookCategoryCardProps) {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <CardContent className="absolute bottom-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-white/80">{description}</p>
        </CardContent>
      </div>
    </Card>
  );
}
