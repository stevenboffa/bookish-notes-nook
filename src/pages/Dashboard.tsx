import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BookPlus, Book, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Meta } from "@/components/Meta";
import { BookList } from "@/components/BookList";

type BookType = {
  id: string;
  title: string;
  author: string;
  status: string;
};

export default function Dashboard() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });
  const [loading, setLoading] = useState(true);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      navigate("/auth/sign-in");
      return;
    }
    fetchBooks();
  }, [session, navigate]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", session?.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBooks(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) {
      toast({
        title: "Error",
        description: "Title and author are required",
        variant: "destructive",
      });
      return;
    }

    setIsAddingBook(true);
    try {
      const { data, error } = await supabase
        .from("books")
        .insert([{ ...newBook, user_id: session?.user.id }])
        .select();

      if (error) throw error;

      setBooks([...books, data[0]]);
      setNewBook({ title: "", author: "" });
      toast({
        title: "Success",
        description: "Book added successfully",
      });
      fetchBooks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAddingBook(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setNewBook({ ...newBook, [field]: e.target.value });
  };

  const handleDeleteBook = async (id: string) => {
    try {
      const { error } = await supabase.from("books").delete().eq("id", id);

      if (error) throw error;

      setBooks(books.filter((book) => book.id !== id));
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
      fetchBooks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateBookStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("books")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setBooks(
        books.map((book) => (book.id === id ? { ...book, status } : book))
      );
      toast({
        title: "Success",
        description: "Book status updated successfully",
      });
      fetchBooks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddBookClick = () => {
    navigate("/add-book");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-20">
      <Meta title="Dashboard" />
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Books</h1>
        <Button data-tour="add-book" onClick={handleAddBookClick}>
          <BookPlus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Book</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Title"
                value={newBook.title}
                onChange={(e) => handleInputChange(e, "title")}
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                type="text"
                id="author"
                placeholder="Author"
                value={newBook.author}
                onChange={(e) => handleInputChange(e, "author")}
              />
            </div>
          </div>
          <Button disabled={isAddingBook} onClick={handleAddBook}>
            {isAddingBook ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Book"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">My Book Collection</h2>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading books...
          </div>
        ) : (
          <div className="book-list-container" data-tour="book-collection">
            <BookList
              books={books}
              onDelete={handleDeleteBook}
              onUpdateStatus={handleUpdateBookStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
}
