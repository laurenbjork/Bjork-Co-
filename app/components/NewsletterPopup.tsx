'use client';

import { useState, useEffect } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user has already seen/subscribed to newsletter
    const hasSeenPopup = localStorage.getItem('newsletter-popup-seen');
    const hasSubscribed = localStorage.getItem('newsletter-subscribed');
    
    if (!hasSeenPopup && !hasSubscribed) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter-popup-seen', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        localStorage.setItem('newsletter-subscribed', 'true');
        
        // Auto-close after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to subscribe');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          // Success State
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-serif text-[24px] text-black mb-2">
              Thank You!
            </h3>
            <p className="text-[14px] text-gray-600">
              You&apos;ve been added to our newsletter.
            </p>
          </div>
        ) : (
          // Form State
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#013220]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-[#013220]" />
              </div>
              <h3 className="font-serif text-[24px] text-black mb-2">
                Join Our Newsletter
              </h3>
              <p className="text-[14px] text-gray-600">
                Subscribe for exclusive offers, new arrivals, and jewelry inspiration.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-[13px] rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220] rounded"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className={cn(
                  'w-full px-6 py-3 bg-[#013220] text-white text-[14px] font-medium tracking-[0.05em] rounded transition-colors',
                  isLoading || !email ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'
                )}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            <p className="text-center text-[12px] text-gray-500 mt-4">
              No spam, unsubscribe anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
