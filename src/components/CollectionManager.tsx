import { useState } from "react";
import { Plus } from "lucide-react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collection } from "@/types/books";
import { supabase } from "@/integrations/supabase/client";
import { DragHandle } from "./DragHandle";

interface CollectionManagerProps {
  collections: Collection[];
  onAddCollection: (name: string) => Promise<string>;
  onSelectCollection: (collectionId: string | null) => void;
  activeCollection: string | null;
  onUpdateCollections: (collections: Collection[]) => void;
}

function SortableItem(props: { id: string; name: string; activeCollection: string | null; onSelectCollection: (collectionId: string | null) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const isActive = props.activeCollection === props.id;

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="flex items-center justify-between rounded-md px-3 py-2 border bg-white">
      <Button
        variant={isActive ? "default" : "outline"}
        size="sm"
        onClick={() => props.onSelectCollection(props.id)}
        className={`flex-1 h-8 text-sm font-medium rounded ${
          isActive
            ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
            : "bg-white text-text-muted hover:text-text hover:bg-accent/10"
        }`}
      >
        {props.name}
      </Button>
      <DragHandle listeners={listeners} />
    </div>
  );
}

export function CollectionManager({
  collections,
  onAddCollection,
  onSelectCollection,
  activeCollection,
  onUpdateCollections,
}: CollectionManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const { session } = useAuth();
  const isMobile = useIsMobile();
  
  const toggleEditMode = () => {
    setIsEditModeActive(!isEditModeActive);
  };

  const handleAddCollection = async () => {
    if (!newCollectionName.trim()) {
      toast.error("Collection name cannot be empty");
      return;
    }
    
    try {
      await onAddCollection(newCollectionName);
      setNewCollectionName("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding collection:", error);
      toast.error("Failed to add collection");
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = collections.findIndex(collection => collection.id === active.id);
      const newIndex = collections.findIndex(collection => collection.id === over?.id);

      if (oldIndex === -1 || newIndex === -1) {
        console.error("Error: Could not find collection in array");
        return;
      }

      const reorderedCollections = [...collections];
      const [movedCollection] = reorderedCollections.splice(oldIndex, 1);
      reorderedCollections.splice(newIndex, 0, movedCollection);

      // Optimistically update the UI
      onUpdateCollections(reorderedCollections);

      // Update positions in the database
      try {
        if (!session?.user?.id) {
          throw new Error("You must be logged in to update collections");
        }

        const updates = reorderedCollections.map((collection, index) => ({
          id: collection.id,
          position: index + 1,
          user_id: session.user.id,
        }));

        // @ts-ignore - collections table exists but TypeScript doesn't know about it yet
        const { error } = await supabase
          .from('collections')
          .upsert(updates);

        if (error) {
          throw error;
        }

        // If the database update was successful, update local state
        const updatedCollections = reorderedCollections.map((collection, index) => ({
          ...collection,
          position: index + 1,
        }));
        onUpdateCollections(updatedCollections);
        toast.success("Collections reordered successfully!");
      } catch (error) {
        console.error("Error updating collection positions:", error);
        toast.error("Failed to reorder collections");
        // Revert the UI to the previous state
        onUpdateCollections(collections);
      }
    }
  };
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between bg-white rounded-md px-3 py-2 border">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800">Collections</h3>
          
          {!isMobile && (
            <div className="flex items-center gap-2 ml-2">
              <Button 
                variant={isEditModeActive ? "default" : "outline"}
                size="sm" 
                onClick={toggleEditMode}
                className={`px-3 py-1 h-7 text-xs font-medium rounded ${
                  isEditModeActive 
                    ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" 
                    : "bg-white text-text-muted hover:text-text hover:bg-accent/10"
                }`}
              >
                {isEditModeActive ? "Done" : "Edit"}
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 py-1 h-7 text-xs font-medium rounded bg-white text-text-muted hover:text-text hover:bg-accent/10 flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                    <DialogDescription>
                      Create a new collection to organize your books.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="col-span-4">
                        Collection Name
                      </Label>
                      <Input
                        id="name"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        className="col-span-4"
                        placeholder="e.g., Science Fiction, Summer Reads"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      onClick={handleAddCollection}
                      disabled={!newCollectionName.trim()}
                    >
                      Create Collection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        
        {isMobile && (
          <div className="flex items-center gap-2">
            <Button 
              variant={isEditModeActive ? "default" : "outline"}
              size="sm" 
              onClick={toggleEditMode}
              className={`px-3 py-1 h-7 text-xs font-medium rounded ${
                isEditModeActive 
                  ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" 
                  : "bg-white text-text-muted hover:text-text hover:bg-accent/10"
              }`}
            >
              {isEditModeActive ? "Done" : "Edit"}
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3 py-1 h-7 text-xs font-medium rounded bg-white text-text-muted hover:text-text hover:bg-accent/10 flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Collection</DialogTitle>
                  <DialogDescription>
                    Create a new collection to organize your books.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="col-span-4">
                      Collection Name
                    </Label>
                    <Input
                      id="name"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="col-span-4"
                      placeholder="e.g., Science Fiction, Summer Reads"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleAddCollection}
                    disabled={!newCollectionName.trim()}
                  >
                    Create Collection
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      
      {isEditModeActive ? (
        <SortableContext
          items={collections.map(collection => collection.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {collections.map((collection) => (
              <SortableItem
                key={collection.id}
                id={collection.id}
                name={collection.name}
                activeCollection={activeCollection}
                onSelectCollection={onSelectCollection}
              />
            ))}
          </div>
        </SortableContext>
      ) : (
        <div className="space-y-2">
          {collections.map((collection) => {
            const isActive = activeCollection === collection.id;
            return (
              <Button
                key={collection.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectCollection(collection.id)}
                className={`w-full h-8 text-sm font-medium rounded ${
                  isActive
                    ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    : "bg-white text-text-muted hover:text-text hover:bg-accent/10"
                }`}
              >
                {collection.name}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
