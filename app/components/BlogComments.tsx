'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, User, Clock, Send } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface Comment {
  id: string;
  name: string;
  comment: string;
  status: string;
  created_at: string;
  replies?: Comment[];
}

interface BlogCommentsProps {
  postId: string;
  postSlug: string;
}

export default function BlogComments({ postId, postSlug }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
    website: '', // Honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/blog/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitMessage('');

    // Honeypot check
    if (formData.website) {
      setSubmitError('Spam detected.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          name: formData.name,
          email: formData.email,
          comment: formData.comment,
        }),
      });

      if (response.ok) {
        setSubmitMessage('Thank you! Your comment is awaiting moderation.');
        setFormData({ name: '', email: '', comment: '', website: '' });
        setShowForm(false);
      } else {
        const data = await response.json();
        setSubmitError(data.error || 'Failed to submit comment');
      }
    } catch (error) {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <p className="text-gray-500 text-center">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="py-12 border-t border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-serif text-[24px] text-black flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Comments ({comments.length})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#013220] text-white text-[13px] font-medium hover:bg-black transition-colors"
        >
          {showForm ? 'Cancel' : 'Leave a Comment'}
        </button>
      </div>

      {/* Comment Form */}
      {showForm && (
        <div className="bg-gray-50 p-6 mb-8">
          <h4 className="font-medium text-[16px] text-black mb-4">Leave a Comment</h4>

          {submitMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-[14px]">
              {submitMessage}
            </div>
          )}

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-[14px]">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field - hidden from users */}
            <div className="hidden">
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="your@email.com"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Your email will not be published
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-black mb-2">
                Comment *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                placeholder="Share your thoughts..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'flex items-center gap-2 px-6 py-3 bg-[#013220] text-white text-[13px] font-medium transition-colors',
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'
              )}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Comment'}
            </button>
          </form>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-6">
              {/* Comment */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#013220]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-[#013220]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-[14px] text-black">
                      {comment.name}
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-[15px] text-gray-700 leading-relaxed">
                    {comment.comment}
                  </p>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-200">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-[13px] text-black">
                                {reply.name}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                {formatDate(reply.created_at)}
                              </span>
                            </div>
                            <p className="text-[14px] text-gray-600">
                              {reply.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-[14px]">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
}
