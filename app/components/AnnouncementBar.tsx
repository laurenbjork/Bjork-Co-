'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface Announcement {
  id: string;
  message: string;
  link: string | null;
  bg_color: string;
  text_color: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  priority: number;
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load dismissed announcements from localStorage
    const saved = localStorage.getItem('dismissed-announcements');
    if (saved) {
      setDismissedIds(JSON.parse(saved));
    }

    loadAnnouncements();
  }, []);

  useEffect(() => {
    // Auto-rotate announcements every 8 seconds if multiple
    if (announcements.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 8000);

      return () => clearInterval(timer);
    }
  }, [announcements.length]);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements/public');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissed-announcements', JSON.stringify(newDismissed));
  };

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    (a) => !dismissedIds.includes(a.id)
  );

  if (isLoading || visibleAnnouncements.length === 0) {
    return null;
  }

  const currentAnnouncement = visibleAnnouncements[currentIndex];

  const content = (
    <div
      className="px-4 py-2.5 text-center text-[13px] font-medium tracking-[0.05em] relative"
      style={{
        backgroundColor: currentAnnouncement.bg_color,
        color: currentAnnouncement.text_color,
      }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-4">
        {currentAnnouncement.link ? (
          <Link
            href={currentAnnouncement.link}
            className="hover:underline"
            style={{ color: currentAnnouncement.text_color }}
          >
            {currentAnnouncement.message}
          </Link>
        ) : (
          <span>{currentAnnouncement.message}</span>
        )}

        {/* Dismiss button */}
        <button
          onClick={() => handleDismiss(currentAnnouncement.id)}
          className="p-1 hover:opacity-70 transition-opacity"
          style={{ color: currentAnnouncement.text_color }}
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Multiple indicator dots */}
      {visibleAnnouncements.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {visibleAnnouncements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-opacity',
                index === currentIndex ? 'opacity-100' : 'opacity-40'
              )}
              style={{ backgroundColor: currentAnnouncement.text_color }}
              aria-label={`Go to announcement ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return content;
}
