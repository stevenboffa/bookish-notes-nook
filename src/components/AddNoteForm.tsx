import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X, Loader2, Mic, MicOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddNoteFormProps {
  bookId: string;
  bookFormat?: string;
  onSubmit: (note: {
    content: string;
    pageNumber?: number;
    timestampSeconds?: number;
    chapter?: string;
    images?: string[];
    noteType?: string;
  }) => void;
}

export const AddNoteForm = ({ bookId, bookFormat, onSubmit }: AddNoteFormProps) => {
  const [content, setContent] = useState("");
  const [pageNumber, setPageNumber] = useState<string>("");
  const [timestampSeconds, setTimestampSeconds] = useState<string>("");
  const [chapter, setChapter] = useState("");
  const [noteType, setNoteType] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>("");

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    try {
      if (!('webkitSpeechRecognition' in window)) {
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in your browser. Try using Chrome.",
          variant: "destructive"
        });
        return;
      }

      const recognition = new window.webkitSpeechRecognition();
      recognitionRef.current = recognition;
      
      finalTranscriptRef.current = content;
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          finalTranscriptRef.current += ' ' + finalTranscript;
          setContent(finalTranscriptRef.current.trim());
        }
        
        if (interimTranscript && textareaRef.current) {
          const displayValue = finalTranscriptRef.current + ' ' + interimTranscript;
          textareaRef.current.value = displayValue.trim();
        }
      };

      recognition.onend = () => {
        if (isListening) {
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
        toast({
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive"
        });
      };

      recognition.start();
      setIsListening(true);
      
      toast({
        title: "Listening",
        description: "Speak clearly to convert your voice to text"
      });
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast({
        title: "Error",
        description: "Could not start speech recognition. Please check your browser permissions.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    
    if (textareaRef.current?.value) {
      setContent(textareaRef.current.value);
    }
    
    toast({
      title: "Stopped Listening",
      description: "Voice-to-text conversion stopped"
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of selectedImages) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${bookId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('note-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('note-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isListening) {
      stopListening();
    }
    
    setIsSubmitting(true);

    try {
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages();
      }

      const noteData = {
        content,
        pageNumber: pageNumber && bookFormat === 'physical_book' ? parseInt(pageNumber) : undefined,
        timestampSeconds: timestampSeconds && bookFormat === 'audiobook' ? parseInt(timestampSeconds) : undefined,
        chapter: chapter || undefined,
        images: imageUrls,
        noteType: noteType || undefined,
      };

      await onSubmit(noteData);
      
      setContent("");
      setPageNumber("");
      setTimestampSeconds("");
      setChapter("");
      setNoteType("");
      setSelectedImages([]);
      finalTranscriptRef.current = "";
    } catch (error) {
      console.error('Error submitting note:', error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg p-4 border mb-4">
      <div className="space-y-4">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            required
            disabled={isSubmitting}
            className="min-h-[100px] pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`absolute right-2 bottom-2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-primary'}`}
            onClick={toggleSpeechRecognition}
            disabled={isSubmitting}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>
        
        <Select value={noteType} onValueChange={setNoteType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select note type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Note</SelectItem>
            <SelectItem value="quote">Quote</SelectItem>
            <SelectItem value="summary">Summary</SelectItem>
            <SelectItem value="insight">Insight</SelectItem>
            <SelectItem value="question">Question</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          {bookFormat === 'physical_book' && (
            <div>
              <Input
                type="number"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                placeholder="Page number"
                disabled={isSubmitting}
              />
            </div>
          )}
          {bookFormat === 'audiobook' && (
            <div>
              <Input
                type="number"
                value={timestampSeconds}
                onChange={(e) => setTimestampSeconds(e.target.value)}
                placeholder="Timestamp"
                disabled={isSubmitting}
              />
            </div>
          )}
          <div>
            <Input
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="Chapter"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Input
          type="file"
          onChange={handleImageSelect}
          accept="image/*"
          multiple
          className="hidden"
          id="image-upload"
          disabled={isSubmitting}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={isSubmitting}
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Add Images
        </Button>
      </div>

      {selectedImages.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedImages.map((file, index) => (
            <div
              key={index}
              className="relative group bg-gray-100 rounded-md p-2"
            >
              <div className="text-sm truncate max-w-[150px]">
                {file.name}
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                disabled={isSubmitting}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Note'
          )}
        </Button>
      </div>
    </form>
  );
};
