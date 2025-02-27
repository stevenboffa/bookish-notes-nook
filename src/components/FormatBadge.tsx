
import { Book, Headphones, Tablet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FormatBadgeProps {
  format: "physical_book" | "ebook" | "audiobook";
}

export function FormatBadge({ format }: FormatBadgeProps) {
  const getFormatDetails = () => {
    switch (format) {
      case "physical_book":
        return { icon: <Book className="w-3 h-3 mr-1" />, label: "Physical Book", color: "bg-blue-100 text-blue-800" };
      case "ebook":
        return { icon: <Tablet className="w-3 h-3 mr-1" />, label: "E-Book", color: "bg-purple-100 text-purple-800" };
      case "audiobook":
        return { icon: <Headphones className="w-3 h-3 mr-1" />, label: "Audiobook", color: "bg-green-100 text-green-800" };
      default:
        return { icon: <Book className="w-3 h-3 mr-1" />, label: "Book", color: "bg-gray-100 text-gray-800" };
    }
  };

  const { icon, label, color } = getFormatDetails();

  return (
    <Badge variant="outline" className={`flex items-center ${color}`}>
      {icon}
      {label}
    </Badge>
  );
}
