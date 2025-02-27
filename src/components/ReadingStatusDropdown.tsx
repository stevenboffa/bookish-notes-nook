
import { useState } from "react";
import { Check, ChevronDown, Clock, BookOpen, BookX, BookCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ReadingStatus = "to_read" | "reading" | "completed" | "dnf";

interface ReadingStatusDropdownProps {
  bookId: string;
  currentStatus: ReadingStatus | string;
  isInReadingList?: boolean;
}

export function ReadingStatusDropdown({
  bookId,
  currentStatus,
  isInReadingList = false,
}: ReadingStatusDropdownProps) {
  const [status, setStatus] = useState<ReadingStatus | string>(currentStatus);
  const { toast } = useToast();

  const statusOptions: {
    value: ReadingStatus;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "to_read",
      label: "Want to Read",
      icon: <Clock className="mr-2 h-4 w-4" />,
    },
    {
      value: "reading",
      label: "Currently Reading",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
    },
    {
      value: "completed",
      label: "Completed",
      icon: <BookCheck className="mr-2 h-4 w-4" />,
    },
    {
      value: "dnf",
      label: "Did Not Finish",
      icon: <BookX className="mr-2 h-4 w-4" />,
    },
  ];

  const getStatusDetails = (statusValue: string) => {
    return (
      statusOptions.find((option) => option.value === statusValue) || {
        value: statusValue,
        label: "Unknown Status",
        icon: <Clock className="mr-2 h-4 w-4" />,
      }
    );
  };

  const currentStatusDetails = getStatusDetails(status);

  const handleStatusChange = async (newStatus: ReadingStatus) => {
    try {
      const { error } = await supabase
        .from("books")
        .update({ status: newStatus })
        .eq("id", bookId);

      if (error) throw error;

      setStatus(newStatus);
      toast({
        title: "Status Updated",
        description: `Book moved to "${getStatusDetails(newStatus).label}"`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update reading status. Please try again.",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center">
            {currentStatusDetails.icon}
            <span>{currentStatusDetails.label}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            className={cn(
              "flex items-center",
              status === option.value && "bg-muted"
            )}
          >
            {option.icon}
            {option.label}
            {status === option.value && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
