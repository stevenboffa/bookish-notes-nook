
import { Note } from "@/types/books";
import { Button } from "@/components/ui/button";
import { Pin, Trash2, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
}

export const NoteItem = ({ note, onDelete, onTogglePin }: NoteItemProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getNoteTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'quote':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'summary':
        return 'bg-green-500 hover:bg-green-600';
      case 'insight':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'question':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <>
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            {note.noteType && (
              <Badge 
                className={`mb-2 ${getNoteTypeColor(note.noteType)}`}
                variant="secondary"
              >
                <Tag className="w-3 h-3 mr-1" />
                {note.noteType.charAt(0).toUpperCase() + note.noteType.slice(1)}
              </Badge>
            )}
            <p className="text-sm text-gray-900">{note.content}</p>
            {note.pageNumber && (
              <span className="text-xs text-gray-500 mt-1 block">
                Page: {note.pageNumber}
              </span>
            )}
            {note.chapter && (
              <span className="text-xs text-gray-500 block">
                Chapter: {note.chapter}
              </span>
            )}
            {note.category && (
              <span className="text-xs text-gray-500 block">
                Category: {note.category}
              </span>
            )}
            {note.images && note.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {note.images.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Note image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setSelectedImage(imageUrl)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTogglePin(note.id, !note.isPinned)}
              className={`hover:bg-gray-100 ${
                note.isPinned ? "text-primary" : "text-gray-500"
              }`}
            >
              <Pin className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(note.id)}
              className="hover:bg-red-100 hover:text-red-600 text-gray-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {new Date(note.createdAt).toLocaleDateString()}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Expanded view"
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
