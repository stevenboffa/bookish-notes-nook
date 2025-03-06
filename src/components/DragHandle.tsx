
import { GripVertical } from "lucide-react";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface DragHandleProps {
  listeners: SyntheticListenerMap | undefined;
}

export function DragHandle({ listeners }: DragHandleProps) {
  return (
    <button
      className="ml-2 touch-none p-1 opacity-50 hover:opacity-100 transition-opacity"
      {...listeners}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );
}
