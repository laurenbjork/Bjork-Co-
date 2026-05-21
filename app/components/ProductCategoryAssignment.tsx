'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface ProductCategoryAssignmentProps {
  productId: string;
  selectedCategories: string[];
  selectedCollections: string[];
  onCategoriesChange: (categoryIds: string[]) => void;
  onCollectionsChange: (collectionIds: string[]) => void;
}

export default function ProductCategoryAssignment({
  productId,
  selectedCategories,
  selectedCollections,
  onCategoriesChange,
  onCollectionsChange,
}: ProductCategoryAssignmentProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategoriesAndCollections();
  }, []);

  const loadCategoriesAndCollections = async () => {
    try {
      // Fetch categories and collections from Supabase
      const [catsRes, colsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/collections'),
      ]);

      if (catsRes.ok) {
        const cats = await catsRes.json();
        setCategories(cats);
      }

      if (colsRes.ok) {
        const cols = await colsRes.json();
        setCollections(cols);
      }
    } catch (error) {
      console.error('Error loading categories/collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoriesChange(newSelection);
  };

  const toggleCollection = (collectionId: string) => {
    const newSelection = selectedCollections.includes(collectionId)
      ? selectedCollections.filter((id) => id !== collectionId)
      : [...selectedCollections, collectionId];
    onCollectionsChange(newSelection);
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-[13px] text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-[13px] font-medium text-black mb-3">Categories</h4>
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded transition-colors',
                    isSelected
                      ? 'bg-[#013220] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {category.name}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-[13px] text-gray-500">
            No categories available. Create categories first.
          </p>
        )}
      </div>

      {/* Collections */}
      <div>
        <h4 className="text-[13px] font-medium text-black mb-3">Collections</h4>
        {collections.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {collections.map((collection) => {
              const isSelected = selectedCollections.includes(collection.id);
              return (
                <button
                  key={collection.id}
                  onClick={() => toggleCollection(collection.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded transition-colors',
                    isSelected
                      ? 'bg-[#013220] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {collection.name}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-[13px] text-gray-500">
            No collections available. Create collections first.
          </p>
        )}
      </div>

      {/* Selected Summary */}
      {(selectedCategories.length > 0 || selectedCollections.length > 0) && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-[12px] font-medium text-gray-600 mb-2">Selected:</h4>
          <div className="flex flex-wrap gap-1.5">
            {selectedCategories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return cat ? (
                <span
                  key={catId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#013220]/10 text-[#013220] text-[11px] rounded"
                >
                  {cat.name}
                  <button
                    onClick={() => toggleCategory(catId)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}
            {selectedCollections.map((colId) => {
              const col = collections.find((c) => c.id === colId);
              return col ? (
                <span
                  key={colId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#013220]/10 text-[#013220] text-[11px] rounded"
                >
                  {col.name}
                  <button
                    onClick={() => toggleCollection(colId)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
