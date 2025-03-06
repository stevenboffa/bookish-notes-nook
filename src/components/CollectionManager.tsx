
import { useState, useEffect } from "react";
import { PlusCircle, Tag, X, GripVertical, Trash2 } from "lucide-react";
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

interface CollectionManagerProps {
  collections: Collection[];
  onAddCollection: (name: string) => Promise<string> | string;
  onSelectCollection: (id: string | null) => void;
  activeCollection: string | null;
  onUpdateCollections?: (collections: Collection[]) => void;
  onDeleteCollection?: (id: string) => Promise<boolean> | boolean;
}

export function CollectionManager({
  collections,
  onAddCollection,
  onSelectCollection,
  activeCollection,
  onUpdateCollections,
  onDeleteCollection,
}: CollectionManagerProps) {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const [localCollections, setLocalCollections] = useState<Collection[]>(collections);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

    await onAddCollection(newCollectionName);
    setNewCollectionName("");
    setIsDialogOpen(false);
    toast.success(`Collection "${newCollectionName}" created`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCollectionName.trim() !== "") {
      handleAddCollection();
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (onDeleteCollection) {
      const success = await onDeleteCollection(id);
      if (!success) {
        // Error handling is done inside onDeleteCollection
        return;
      }
    } else {
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

  const handleDragEnd = () => {
    setDraggedIndex(null);
    
    // Notify parent component if callback exists
    if (onUpdateCollections) {
      onUpdateCollections(localCollections);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Collections</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2"
            onClick={() => setIsEditModeActive(!isEditModeActive)}
          >
            {isEditModeActive ? "Done" : "Edit"}
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <PlusCircle className="h-4 w-4 mr-1" />
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
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCollection === null ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs rounded-lg"
          onClick={() => onSelectCollection(null)}
        >
          All Books
        </Button>
        
        {isEditModeActive ? (
          <div className="flex flex-wrap gap-2 items-start mt-2 w-full border p-2 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 w-full mb-2">Drag to reorder or click the trash icon to delete collections</p>
            {localCollections.map((collection, index) => (
              <div 
                key={collection.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="flex items-center bg-white border rounded-lg p-1 cursor-move"
              >
                <GripVertical className="h-3 w-3 mr-1 text-gray-400" />
                <span className="text-xs">{collection.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCollection(collection.id);
                  }}
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          localCollections.map((collection) => (
            <Button
              key={collection.id}
              variant={activeCollection === collection.id ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs rounded-lg flex items-center"
              onClick={() => onSelectCollection(collection.id)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {collection.name}
            </Button>
          ))
        )}
        
        {collections.length === 0 && !isEditModeActive && (
          <p className="text-xs text-gray-500 italic mt-1">
            No collections yet. Create your first collection to categorize your books.
          </p>
        )}
      </div>
    </div>
  );
}
