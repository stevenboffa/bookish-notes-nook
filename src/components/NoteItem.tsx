
import { useState, useRef } from "react";
import { Note } from "@/types/books";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { 
  Pin, Trash2, Image as ImageIcon, Calendar, 
  MessageSquare, FileText, Lightbulb, HelpCircle, 
  Quote, Bookmark 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, currentPinned: boolean) => void;
}

export function NoteItem({ note, onDelete, onTogglePin }: NoteItemProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id);
    }
  };

  const getNoteTypeIcon = () => {
    switch (note.noteType) {
      case 'quote':
        return <Quote className="h-5 w-5 text-blue-500" />;
      case 'summary':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'insight':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'question':
        return <HelpCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  const showImages = note.images && note.images.length > 0;

  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="pt-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              {getNoteTypeIcon()}
              <span className="text-sm font-medium capitalize">
                {note.noteType || "General Note"}
              </span>
              
              {note.isPinned && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Pinned
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${note.isPinned ? 'text-yellow-600' : 'text-gray-400'}`}
                onClick={() => onTogglePin(note.id, note.isPinned)}
              >
                <Pin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="prose prose-sm max-w-none mt-1">
            {note.content && (
              <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
            )}

            {showImages && (
              <div className="mt-3 flex flex-wrap gap-2">
                {note.images.map((url, index) => (
                  <div
                    key={index}
                    className="relative bg-gray-100 rounded-md overflow-hidden cursor-pointer h-20 w-20"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setImageDialogOpen(true);
                    }}
                  >
                    <img
                      src={url}
                      alt={`Note image ${index + 1}`}
                      className="object-cover h-full w-full"
                    />
                    {note.images.length > 1 && index === 3 && note.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                        +{note.images.length - 4}
                      </div>
                    )}
                  </div>
                )).slice(0, 4)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-3 px-6 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" /> 
          {formatDate(note.createdAt)}
        </div>
        
        <div className="flex space-x-2">
          {note.pageNumber && (
            <Badge variant="outline" className="rounded-sm h-5 px-1 text-xs">
              Page {note.pageNumber}
            </Badge>
          )}
          {note.timestampSeconds !== null && note.timestampSeconds !== undefined && (
            <Badge variant="outline" className="rounded-sm h-5 px-1 text-xs">
              {Math.floor(note.timestampSeconds / 60)}:{(note.timestampSeconds % 60).toString().padStart(2, '0')}
            </Badge>
          )}
          {note.chapter && (
            <Badge variant="outline" className="rounded-sm h-5 px-1 text-xs">
              Ch: {note.chapter}
            </Badge>
          )}
        </div>
      </CardFooter>

      <Dialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Note Images</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={note.images[selectedImageIndex]}
              alt={`Note image ${selectedImageIndex + 1}`}
              className="max-h-[70vh] object-contain"
            />
          </div>
          {note.images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {note.images.map((_, index) => (
                <Button
                  key={index}
                  variant={selectedImageIndex === index ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
