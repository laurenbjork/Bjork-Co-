'use client';

import { useState } from 'react';
import { X, Star, GripVertical } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ImageItem {
  id: string;
  url: string;
  sort_order: number;
  is_hero: boolean;
}

interface ImageGalleryProps {
  images: ImageItem[];
  onReorder: (images: ImageItem[]) => void;
  onSetHero: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (url: string) => void;
}

export default function ImageGallery({
  images,
  onReorder,
  onSetHero,
  onDelete,
  onAdd,
}: ImageGalleryProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...sortedImages];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    // Update sort orders
    const reordered = newImages.map((img, i) => ({
      ...img,
      sort_order: i,
    }));

    onReorder(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      onAdd(newImageUrl.trim());
      setNewImageUrl('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Add New Image */}
      <div className="flex gap-2">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="https://... (paste image URL)"
          className="flex-1 px-4 py-2 border border-gray-300 text-[13px] focus:outline-none focus:border-[#013220]"
        />
        <button
          onClick={handleAddImage}
          disabled={!newImageUrl.trim()}
          className="px-4 py-2 bg-[#013220] text-white text-[13px] font-medium disabled:opacity-50"
        >
          Add Image
        </button>
      </div>

      {/* Gallery Grid */}
      {sortedImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {sortedImages.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                'relative group border-2 rounded-lg overflow-hidden cursor-move transition-all',
                image.is_hero
                  ? 'border-[#013220] ring-2 ring-[#013220]/20'
                  : 'border-gray-200 hover:border-gray-300',
                draggedIndex === index && 'opacity-50'
              )}
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100">
                <img
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                {/* Drag Handle */}
                <div className="absolute top-2 left-2 p-1.5 bg-white/90 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-gray-600" />
                </div>

                {/* Hero Badge */}
                {image.is_hero && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-[#013220] text-white text-[11px] font-medium rounded">
                    HERO
                  </div>
                )}

                {/* Actions */}
                <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Set as Hero */}
                  {!image.is_hero && (
                    <button
                      onClick={() => onSetHero(image.id)}
                      className="p-1.5 bg-white/90 rounded hover:bg-yellow-100 transition-colors"
                      title="Set as hero image"
                    >
                      <Star className="w-4 h-4 text-gray-600" />
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(image.id)}
                    className="p-1.5 bg-white/90 rounded hover:bg-red-100 transition-colors"
                    title="Delete image"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Order Number */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-[11px] rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <p className="text-[14px] text-gray-500">No images yet.</p>
          <p className="text-[12px] text-gray-400 mt-1">
            Add images above or drag and drop in the product form
          </p>
        </div>
      )}

      {/* Instructions */}
      {sortedImages.length > 0 && (
        <p className="text-[12px] text-gray-500">
          Drag images to reorder. The hero image is used as the main product image.
        </p>
      )}
    </div>
  );
}
