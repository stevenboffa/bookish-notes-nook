
import { useState, useEffect } from "react";
import { PlusCircle, Tag, X } from "lucide-react";
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

interface CollectionManagerProps {
  collections: Collection[];
  onAddCollection: (name: string) => void;
  onSelectCollection: (id: string | null) => void;
  activeCollection: string | null;
}

export function CollectionManager({
  collections,
  onAddCollection,
  onSelectCollection,
  activeCollection,
}: CollectionManagerProps) {
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCollection = () => {
    if (newCollectionName.trim() === "") {
      toast.error("Collection name cannot be empty");
      return;
    }

    if (collections.some(c => c.name.toLowerCase() === newCollectionName.toLowerCase())) {
      toast.error("A collection with this name already exists");
      return;
    }

    onAddCollection(newCollectionName);
    setNewCollectionName("");
    setIsDialogOpen(false);
    toast.success(`Collection "${newCollectionName}" created`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCollectionName.trim() !== "") {
      handleAddCollection();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Collections</h3>
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

      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCollection === null ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs rounded-lg"
          onClick={() => onSelectCollection(null)}
        >
          All Books
        </Button>
        
        {collections.map((collection) => (
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
        ))}
        
        {collections.length === 0 && (
          <p className="text-xs text-gray-500 italic mt-1">
            No collections yet. Create your first collection to categorize your books.
          </p>
        )}
      </div>
    </div>
  );
}
