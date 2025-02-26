
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book } from "./BookList";
import { Mic, MicOff, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AddNoteFormProps {
  book: Book;
  onSubmit: (note: {
    content: string;
    pageNumber?: number;
    timestampSeconds?: number;
    chapter?: string;
    category?: string;
    images?: string[];
  }) => void;
}

const NOTE_TYPES = [
  "plot",
  "character",
  "theme",
  "vocabulary",
  "question"
];

const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function AddNoteForm({ book, onSubmit }: AddNoteFormProps) {
  const [content, setContent] = useState("");
  const [pageNumber, setPageNumber] = useState<string>("");
  const [timestamp, setTimestamp] = useState<string>("");
  const [chapter, setChapter] = useState("");
  const [category, setCategory] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = false;
      newRecognition.interimResults = true;

      newRecognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          setContent(prev => prev + (prev ? ' ' : '') + lastResult[0].transcript);
        }
      };

      newRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Error recording voice. Please try again.');
        setIsRecording(false);
      };

      newRecognition.onend = () => {
        setIsRecording(false);
        if (isRecording) {
          newRecognition.start();
        }
      };

      setRecognition(newRecognition);
    }
  }, [isRecording]);

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`;
      const filePath = `${book.id}/${fileName}`;

      console.log('Starting image upload:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('note-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('note-images')
        .getPublicUrl(filePath);

      console.log('Upload successful, public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedImages.length + files.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images per note`);
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles]);
      
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      toast.success('Voice recording stopped');
    } else {
      recognition.start();
      setIsRecording(true);
      toast.success('Voice recording started');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter some content for the note');
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRecording) {
        recognition?.stop();
      }

      let uploadedImageUrls: string[] = [];

      if (selectedImages.length > 0) {
        try {
          // Upload images sequentially to avoid race conditions
          for (const file of selectedImages) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`;
            const filePath = `${book.id}/${fileName}`;

            console.log('Starting image upload:', filePath);

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('note-images')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              console.error('Upload error:', uploadError);
              throw new Error(`Failed to upload image: ${uploadError.message}`);
            }

            // Get the public URL with cache busting
            const timestamp = Date.now();
            const { data: { publicUrl } } = supabase.storage
              .from('note-images')
              .getPublicUrl(`${filePath}?v=${timestamp}`);

            uploadedImageUrls.push(publicUrl);
            console.log('Image uploaded successfully:', publicUrl);
          }
        } catch (error) {
          console.error('Error uploading images:', error);
          toast.error('Failed to upload one or more images');
          setIsSubmitting(false);
          return;
        }
      }

      const note: any = { content };
      
      if (book.format === "physical_book" && pageNumber) {
        note.pageNumber = parseInt(pageNumber);
      } else if (book.format === "audiobook" && timestamp) {
        const [minutes, seconds] = timestamp.split(":").map(Number);
        note.timestampSeconds = minutes * 60 + seconds;
      }
      
      if (chapter) note.chapter = chapter;
      if (category) note.category = category;
      if (uploadedImageUrls.length > 0) note.images = uploadedImageUrls;

      console.log('Submitting note with data:', note);
      
      await onSubmit(note);
      
      // Reset form
      setContent("");
      setPageNumber("");
      setTimestamp("");
      setChapter("");
      setCategory("");
      setSelectedImages([]);
      setImagePreviews([]);
      
      toast.success('Note added successfully');
    } catch (error) {
      console.error('Error submitting note:', error);
      toast.error('Failed to create note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a note..."
            className="min-h-[100px] pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`absolute right-2 top-2 ${isRecording ? 'text-red-500' : ''}`}
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('image-upload')?.click()}
            className="flex items-center gap-2"
            disabled={selectedImages.length >= MAX_IMAGES || isSubmitting}
          >
            <ImageIcon className="h-4 w-4" />
            Add Images
          </Button>
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
          {selectedImages.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedImages.length} of {MAX_IMAGES} images selected
            </span>
          )}
        </div>

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-full object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {book.format === "physical_book" ? (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Page number"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              min="1"
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
        ) : book.format === "audiobook" ? (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Time (MM:SS)"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              pattern="[0-9]{1,2}:[0-9]{2}"
              title="Format: MM:SS (eg: 12:34)"
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <Input
            placeholder="Chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="w-full"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Note type" />
            </SelectTrigger>
            <SelectContent>
              {NOTE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={!content.trim() || isSubmitting}>
        {isSubmitting ? 'Adding note...' : 'Add Note'}
      </Button>
    </form>
  );
}
