
import { useState, useEffect } from "react";
import { PlusCircle, Tag, X, GripVertical, Trash2, PenLine, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Collection } from "@/types/books";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface CollectionManagerProps {
  collections: Collection[];
  onAddCollection: (name: string) => Promise<string>;
  onSelectCollection: (id: string | null) => void;
  activeCollection: string | null;
  onUpdateCollections?: (collections: Collection[]) => void;
}

export function CollectionManager({
  collections,
  onAddCollection,
  onSelectCollection,
  activeCollection,
  onUpdateCollections,
}: CollectionManagerProps) {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const [localCollections, setLocalCollections] = useState<Collection[]>(collections);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { session } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Update local collections when the prop changes
    setLocalCollections(collections);
  }, [collections]);

  const handleAddCollection = async () => {
    if (newCollectionName.trim() === "") {
      toast.error("Collection name cannot be empty");
      return;
    }

    if (collections.some(c => c.name.toLowerCase() === newCollectionName.toLowerCase())) {
      toast.error("A collection with this name already exists");
      return;
    }

    try {
      const collectionId = await onAddCollection(newCollectionName);
      setNewCollectionName("");
      setIsDialogOpen(false);
      toast.success(`Collection "${newCollectionName}" created`);
    } catch (error) {
      console.error("Error adding collection:", error);
      toast.error("Failed to create collection");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCollectionName.trim() !== "") {
      handleAddCollection();
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to delete collections");
      return;
    }

    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updatedCollections = localCollections.filter(c => c.id !== id);
      setLocalCollections(updatedCollections);
      
      // If the deleted collection is the active one, reset to "All Books"
      if (activeCollection === id) {
        onSelectCollection(null);
      }
      
      // Notify parent component if callback exists
      if (onUpdateCollections) {
        onUpdateCollections(updatedCollections);
      }
      
      toast.success("Collection deleted");
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("Failed to delete collection");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCollections = [...localCollections];
    const draggedCollection = newCollections[draggedIndex];
    
    // Remove the dragged item
    newCollections.splice(draggedIndex, 1);
    // Insert it at the new position
    newCollections.splice(index, 0, draggedCollection);
    
    setLocalCollections(newCollections);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to reorder collections");
      setDraggedIndex(null);
      return;
    }
    
    setDraggedIndex(null);
    
    try {
      // Update positions in Supabase
      for (let i = 0; i < localCollections.length; i++) {
        const collection = localCollections[i];
        
        // @ts-ignore - collections table exists but TypeScript doesn't know about it yet
        const { error } = await supabase
          .from('collections')
          .update({ position: i })
          .eq('id', collection.id);

        if (error) throw error;
      }
      
      // Notify parent component if callback exists
      if (onUpdateCollections) {
        onUpdateCollections(localCollections);
      }
    } catch (error) {
      console.error("Error updating collection positions:", error);
      toast.error("Failed to save collection order");
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between bg-white rounded-md px-3 py-2 border">
        <div className="flex items-center gap-2">
          {!isMobile && (
            <div className="flex items-center gap-2 mr-2">
              <Button 
                variant={isEditModeActive ? "default" : "outline"}
                size="sm" 
                className={`h-7 px-2 ${isEditModeActive ? 'bg-primary/10 text-primary border-transparent hover:bg-primary/20' : 'hover:bg-gray-100'}`}
                onClick={() => setIsEditModeActive(!isEditModeActive)}
              >
                <PenLine className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Edit</span>
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-7 px-2 bg-primary text-white hover:bg-primary/90"
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">New</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create new collection</DialogTitle>
                    <DialogDescription>
                      Collections help you organize your books into custom categories.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input
                      placeholder="Collection name (e.g. 'Summer 2024', 'Sci-Fi Favorites')"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline" size="sm">Cancel</Button>
                      </DialogClose>
                      <Button 
                        size="sm" 
                        onClick={handleAddCollection}
                        disabled={newCollectionName.trim() === ""}
                      >
                        Create Collection
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
          <h3 className="text-sm font-semibold text-gray-800">Collections</h3>
        </div>
        
        {isMobile && (
          <div className="flex items-center gap-2">
            <Button 
              variant={isEditModeActive ? "default" : "outline"}
              size="sm" 
              className={`h-7 px-2 ${isEditModeActive ? 'bg-primary/10 text-primary border-transparent hover:bg-primary/20' : 'hover:bg-gray-100'}`}
              onClick={() => setIsEditModeActive(!isEditModeActive)}
            >
              <PenLine className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Edit</span>
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-7 px-2 bg-primary text-white hover:bg-primary/90"
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">New</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create new collection</DialogTitle>
                  <DialogDescription>
                    Collections help you organize your books into custom categories.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Collection name (e.g. 'Summer 2024', 'Sci-Fi Favorites')"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" size="sm">Cancel</Button>
                    </DialogClose>
                    <Button 
                      size="sm" 
                      onClick={handleAddCollection}
                      disabled={newCollectionName.trim() === ""}
                    >
                      Create Collection
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className={`${isEditModeActive ? "px-2" : ""}`}>
        {isEditModeActive ? (
          <div className="p-3 border rounded-lg bg-gray-50/70 space-y-2">
            <p className="text-xs text-gray-500">Drag to reorder or click the trash icon to delete</p>
            <div className="flex flex-wrap gap-2">
              {localCollections.length === 0 ? (
                <div className="p-4 text-center w-full bg-white rounded-md border border-dashed">
                  <p className="text-xs text-gray-500 mb-2">You haven't created any collections yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      setIsEditModeActive(false);
                      setIsDialogOpen(true);
                    }}
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    Create your first collection
                  </Button>
                </div>
              ) : (
                localCollections.map((collection, index) => (
                  <div 
                    key={collection.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center bg-white border rounded-md p-1.5 cursor-move group shadow-sm hover:shadow"
                  >
                    <GripVertical className="h-3 w-3 mr-1 text-gray-400" />
                    <span className="text-xs">{collection.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-1 opacity-60 hover:opacity-100 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCollection(collection.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 hide-scrollbar">
              <Button
                variant={activeCollection === null ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs rounded-md whitespace-nowrap shadow-sm"
                onClick={() => onSelectCollection(null)}
              >
                All Books
              </Button>
              
              {localCollections.length === 0 ? (
                <div className="flex-1 bg-gray-50 rounded-md border border-dashed p-3 text-center">
                  <div className="flex flex-col items-center">
                    <BookOpenText className="h-5 w-5 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-500 mb-2">Create collections to organize your books</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs bg-white"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <PlusCircle className="h-3.5 w-3.5 mr-1" />
                      New Collection
                    </Button>
                  </div>
                </div>
              ) : (
                localCollections.map((collection) => (
                  <Button
                    key={collection.id}
                    variant={activeCollection === collection.id ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-xs rounded-md flex-shrink-0 whitespace-nowrap shadow-sm"
                    onClick={() => onSelectCollection(collection.id)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {collection.name}
                    {isMobile && activeCollection === collection.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCollection(collection.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-white" />
                      </Button>
                    )}
                  </Button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
