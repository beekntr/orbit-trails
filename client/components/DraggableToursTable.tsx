import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Star, GripVertical } from "lucide-react";
import { Tour } from "@shared/api";

interface DraggableTourRowProps {
  tour: Tour;
  onEdit: (tour: Tour) => void;
  onDelete: (id: string, name: string) => void;
  loading: boolean;
}

function DraggableTourRow({ tour, onEdit, onDelete, loading }: DraggableTourRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tour._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'z-50' : ''}>
      <TableCell>
        <div className="flex items-center space-x-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <span className="font-medium">{tour.name}</span>
        </div>
      </TableCell>
      <TableCell>{tour.category}</TableCell>
      <TableCell>{tour.duration}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{tour.rating}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge className="bg-green-100 text-green-800">
          {tour.status || 'Active'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onEdit(tour)}
            disabled={loading}
            className="hover:bg-blue-50 hover:border-blue-300"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-800 hover:bg-red-50 hover:border-red-300"
            onClick={() => onDelete(tour._id, tour.name)}
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface DraggableToursTableProps {
  tours: Tour[];
  onEdit: (tour: Tour) => void;
  onDelete: (id: string, name: string) => void;
  onReorder: (reorderedTours: Tour[]) => void;
  loading: boolean;
}

export default function DraggableToursTable({ 
  tours, 
  onEdit, 
  onDelete, 
  onReorder, 
  loading 
}: DraggableToursTableProps) {
  const [items, setItems] = useState(tours);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update items when tours prop changes
  useEffect(() => {
    setItems(tours);
  }, [tours]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over?.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorder(newItems);
    }
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tours available. Add your first tour to get started!
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tour Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext items={items.map(tour => tour._id)} strategy={verticalListSortingStrategy}>
            {items.map((tour) => (
              <DraggableTourRow
                key={tour._id}
                tour={tour}
                onEdit={onEdit}
                onDelete={onDelete}
                loading={loading}
              />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}
