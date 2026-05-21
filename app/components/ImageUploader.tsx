'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  onClear?: () => void;
  currentImage?: string;
  bucket?: string;
  className?: string;
}

export default function ImageUploader({
  onUpload,
  onClear,
  currentImage,
  bucket = 'product-images',
  className,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentImage || '');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await uploadFile(file);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  }, []);

  const uploadFile = async (file: File) => {
    setIsUploading(true);

    try {
      // For now, we'll use a simple URL.createObjectURL for preview
      // In production, you'd upload to Supabase Storage here
      const objectUrl = URL.createObjectURL(file);
      setUploadedUrl(objectUrl);
      onUpload(objectUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setUploadedUrl('');
    onClear?.();
  };

  if (uploadedUrl) {
    return (
      <div className={cn('relative', className)}>
        <img
          src={uploadedUrl}
          alt="Uploaded"
          className="w-full h-48 object-cover rounded border border-gray-200"
        />
        <button
          onClick={handleClear}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
        isDragging
          ? 'border-[#013220] bg-[#013220]/5'
          : 'border-gray-300 hover:border-gray-400',
        className
      )}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer block">
        {isUploading ? (
          <div className="space-y-2">
            <div className="animate-spin w-8 h-8 border-2 border-[#013220] border-t-transparent rounded-full mx-auto" />
            <p className="text-[13px] text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-black">
                Drop image here, or click to select
              </p>
              <p className="text-[12px] text-gray-500 mt-1">
                Supports JPG, PNG, WebP up to 5MB
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#013220]">
              <Upload className="w-4 h-4" />
              <span className="text-[13px] font-medium">Upload Image</span>
            </div>
          </div>
        )}
      </label>
    </div>
  );
}
