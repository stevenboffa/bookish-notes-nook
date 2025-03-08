
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X, Loader2, Mic, Square, FileAudio } from "lucide-react";
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
    audioUrl?: string;
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
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const { toast } = useToast();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks in the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone"
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      toast({
        title: "Recording finished",
        description: "Your voice note has been recorded"
      });
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioBlob(null);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    } else {
      setAudioBlob(null);
    }
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

  const uploadAudio = async (): Promise<string | null> => {
    if (!audioBlob) return null;

    try {
      const fileName = `${crypto.randomUUID()}.webm`;
      const filePath = `${bookId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('note-audios')
        .upload(filePath, audioBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'audio/webm',
        });

      if (uploadError) {
        console.error('Error uploading audio:', uploadError);
        throw new Error(`Failed to upload audio: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('note-audios')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadAudio:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages();
      }

      let audioUrl = null;
      if (audioBlob) {
        audioUrl = await uploadAudio();
      }

      const noteData = {
        content,
        pageNumber: pageNumber && bookFormat === 'physical_book' ? parseInt(pageNumber) : undefined,
        timestampSeconds: timestampSeconds && bookFormat === 'audiobook' ? parseInt(timestampSeconds) : undefined,
        chapter: chapter || undefined,
        images: imageUrls,
        noteType: noteType || undefined,
        audioUrl,
      };

      await onSubmit(noteData);
      
      setContent("");
      setPageNumber("");
      setTimestampSeconds("");
      setChapter("");
      setNoteType("");
      setSelectedImages([]);
      setAudioBlob(null);
      setRecordingTime(0);
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
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          required={!audioBlob}
          disabled={isSubmitting || isRecording}
          className="min-h-[100px]"
        />
        
        <Select value={noteType} onValueChange={setNoteType} disabled={isRecording}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select note type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Note</SelectItem>
            <SelectItem value="quote">Quote</SelectItem>
            <SelectItem value="summary">Summary</SelectItem>
            <SelectItem value="insight">Insight</SelectItem>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="voice">Voice Note</SelectItem>
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
                disabled={isSubmitting || isRecording}
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
                disabled={isSubmitting || isRecording}
              />
            </div>
          )}
          <div>
            <Input
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="Chapter"
              disabled={isSubmitting || isRecording}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="space-y-2 flex-1">
          <Input
            type="file"
            onChange={handleImageSelect}
            accept="image/*"
            multiple
            className="hidden"
            id="image-upload"
            disabled={isSubmitting || isRecording}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isSubmitting || isRecording}
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            Add Images
          </Button>
        </div>

        <div className="space-y-2 flex-1">
          {!isRecording && !audioBlob ? (
            <Button
              type="button"
              variant="outline"
              className="w-full bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
              onClick={startRecording}
              disabled={isSubmitting}
            >
              <Mic className="w-4 h-4 mr-2" />
              Record Voice
            </Button>
          ) : isRecording ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={stopRecording}
              >
                <Square className="w-4 h-4 mr-2" />
                Stop ({formatTime(recordingTime)})
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={cancelRecording}
                className="px-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-green-50 border-green-200 text-green-700"
                disabled={true}
              >
                <FileAudio className="w-4 h-4 mr-2" />
                Audio Ready
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={cancelRecording}
                className="px-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
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
          disabled={isSubmitting || isRecording || (!content && !audioBlob)}
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

