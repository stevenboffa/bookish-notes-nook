
import { useState, useRef } from "react";
import { Note } from "@/types/books";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { 
  Pin, Trash2, Image as ImageIcon, Calendar, 
  MessageSquare, FileText, Lightbulb, HelpCircle, 
  Quote, Bookmark, Pen, Check, X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { Label } from "./ui/label";

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onTogglePin: (id: string, currentPinned: boolean) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  bookFormat?: string;
}

export function NoteItem({ note, onDelete, onTogglePin, onUpdateNote, bookFormat }: NoteItemProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedNoteType, setEditedNoteType] = useState(note.noteType || "");
  const [editedPageNumber, setEditedPageNumber] = useState<number | undefined>(note.pageNumber);
  const [editedTimestampSeconds, setEditedTimestampSeconds] = useState<number | undefined>(note.timestampSeconds);
  const [editedChapter, setEditedChapter] = useState<string | undefined>(note.chapter);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id);
    }
  };

  const startEditing = () => {
    setEditedContent(note.content);
    setEditedNoteType(note.noteType || "");
    setEditedPageNumber(note.pageNumber);
    setEditedTimestampSeconds(note.timestampSeconds);
    setEditedChapter(note.chapter);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveEdits = () => {
    onUpdateNote(note.id, {
      content: editedContent,
      noteType: editedNoteType || undefined,
      pageNumber: editedPageNumber,
      timestampSeconds: editedTimestampSeconds,
      chapter: editedChapter
    });
    setIsEditing(false);
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
                className="h-8 w-8 text-gray-400 hover:text-primary hover:bg-primary/5"
                onClick={startEditing}
              >
                <Pen className="h-4 w-4" />
              </Button>
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
            {isEditing ? (
              <div className="space-y-3">
                <Textarea 
                  value={editedContent} 
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[100px] w-full border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="Enter your note..."
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="noteType" className="text-xs mb-1 block">Note Type</Label>
                    <Select
                      value={editedNoteType}
                      onValueChange={setEditedNoteType}
                    >
                      <SelectTrigger id="noteType" className="w-full h-8 text-xs">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">General Note</SelectItem>
                        <SelectItem value="quote">Quote</SelectItem>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="insight">Insight</SelectItem>
                        <SelectItem value="question">Question</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {bookFormat === "physical_book" && (
                    <div>
                      <Label htmlFor="pageNumber" className="text-xs mb-1 block">Page Number</Label>
                      <Input
                        id="pageNumber"
                        type="number"
                        min="1"
                        value={editedPageNumber || ""}
                        onChange={(e) => setEditedPageNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full h-8 text-xs"
                        placeholder="Page number"
                      />
                    </div>
                  )}
                  
                  {bookFormat === "audiobook" && (
                    <div>
                      <Label htmlFor="timestamp" className="text-xs mb-1 block">Timestamp (minutes)</Label>
                      <Input
                        id="timestamp"
                        type="number"
                        min="0"
                        value={editedTimestampSeconds !== undefined ? Math.floor(editedTimestampSeconds / 60) : ""}
                        onChange={(e) => {
                          const mins = e.target.value ? parseInt(e.target.value) : undefined;
                          setEditedTimestampSeconds(mins !== undefined ? mins * 60 : undefined);
                        }}
                        className="w-full h-8 text-xs"
                        placeholder="Timestamp in minutes"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="chapter" className="text-xs mb-1 block">Chapter</Label>
                    <Input
                      id="chapter"
                      value={editedChapter || ""}
                      onChange={(e) => setEditedChapter(e.target.value || undefined)}
                      className="w-full h-8 text-xs"
                      placeholder="Chapter"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEditing}
                    className="h-8 text-sm"
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={saveEdits}
                    className="h-8 text-sm bg-primary text-white hover:bg-primary/90"
                  >
                    <Check className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </CardContent>
      
      {!isEditing && (
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
      )}

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
