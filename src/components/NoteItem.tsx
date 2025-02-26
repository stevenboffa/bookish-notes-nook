
import { Note } from "@/types/books";
import { Button } from "@/components/ui/button";
import { Pin, Trash2 } from "lucide-react";

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
}

export const NoteItem = ({ note, onDelete, onTogglePin }: NoteItemProps) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
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
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTogglePin(note.id, note.isPinned || false)}
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
  );
};

