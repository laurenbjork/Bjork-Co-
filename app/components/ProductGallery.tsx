'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images?: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Placeholder images if none provided
  const galleryImages = images?.length ? images : [null, null, null, null];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {galleryImages[selectedImage] ? (
          <Image
            src={galleryImages[selectedImage]}
            alt={productName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 border border-gray-200">
            <span className="text-gray-400 text-[12px]">{productName}</span>
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square bg-gray-100 overflow-hidden border-2 transition-colors ${
                selectedImage === index ? 'border-[#013220]' : 'border-transparent hover:border-gray-300'
              }`}
            >
              {image ? (
                <Image
                  src={image}
                  alt={`${productName} - View ${index + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-[10px]">{index + 1}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
