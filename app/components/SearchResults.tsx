'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/app/types';

// Convert Supabase product to frontend Product type
function convertProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    priceVisibility: p.price_visibility || 'visible',
    image: p.hero_image || '/images/product-placeholder.jpg',
    href: `/product/${p.slug}`,
    description: p.short_description || '',
    category: '',
  };
}

function SearchResultsInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<'all' | 'under500' | '500to1000' | '1000to5000' | 'over5000'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'newest'>('relevance');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, query, priceRange, sortBy]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products/search');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.map(convertProduct));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Price filter
    switch (priceRange) {
      case 'under500':
        filtered = filtered.filter((p) => (p.price || 0) < 500);
        break;
      case '500to1000':
        filtered = filtered.filter((p) => (p.price || 0) >= 500 && (p.price || 0) < 1000);
        break;
      case '1000to5000':
        filtered = filtered.filter((p) => (p.price || 0) >= 1000 && (p.price || 0) < 5000);
        break;
      case 'over5000':
        filtered = filtered.filter((p) => (p.price || 0) >= 5000);
        break;
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        // Assuming products have created_at, fallback to ID
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    setFilteredProducts(filtered);
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Searching...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h3 className="font-medium text-[16px] text-black">Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-[13px] font-medium text-black mb-3 uppercase tracking-wider">
              Price Range
            </h4>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Prices' },
                { value: 'under500', label: 'Under $500' },
                { value: '500to1000', label: '$500 - $1,000' },
                { value: '1000to5000', label: '$1,000 - $5,000' },
                { value: 'over5000', label: 'Over $5,000' },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    value={option.value}
                    checked={priceRange === option.value}
                    onChange={(e) => setPriceRange(e.target.value as any)}
                    className="w-4 h-4 border-gray-300 text-[#013220] focus:ring-[#013220]"
                  />
                  <span className="text-[14px] text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h4 className="text-[13px] font-medium text-black mb-3 uppercase tracking-wider">
              Sort By
            </h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-3">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[14px] text-gray-600">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
            {query && ` for "${query}"`}
          </p>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 text-[13px] font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-[18px] text-black mb-2">No results found</h3>
            <p className="text-gray-500 text-[14px]">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="py-12 text-center">
        <p className="text-gray-500">Loading results...</p>
      </div>
    }>
      <SearchResultsInner />
    </Suspense>
  );
}
