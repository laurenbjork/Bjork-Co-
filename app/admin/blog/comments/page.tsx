'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, XCircle, Trash2, Filter, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';

interface Comment {
  id: string;
  name: string;
  email: string;
  comment: string;
  status: 'pending' | 'approved' | 'spam';
  created_at: string;
  post: {
    title: string;
    slug: string;
  };
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam'>('all');

  useEffect(() => {
    loadComments();
  }, [filter]);

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/blog/comments/admin?status=${filter}`);
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

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/blog/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        loadComments();
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/blog/comments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-[12px] font-medium rounded">
            <CheckCircle className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-[12px] font-medium rounded">
            <Filter className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case 'spam':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-[12px] font-medium rounded">
            <XCircle className="w-3.5 h-3.5" />
            Spam
          </span>
        );
      default:
        return null;
    }
  };

  const stats = {
    total: comments.length,
    pending: comments.filter((c) => c.status === 'pending').length,
    approved: comments.filter((c) => c.status === 'approved').length,
    spam: comments.filter((c) => c.status === 'spam').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Blog Comments</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Moderate and manage blog post comments
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4">
          <p className="text-[12px] text-gray-500 uppercase">Total</p>
          <p className="text-[24px] font-medium text-black">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 p-4">
          <p className="text-[12px] text-gray-500 uppercase">Pending</p>
          <p className="text-[24px] font-medium text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white border border-gray-200 p-4">
          <p className="text-[12px] text-gray-500 uppercase">Approved</p>
          <p className="text-[24px] font-medium text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white border border-gray-200 p-4">
          <p className="text-[12px] text-gray-500 uppercase">Spam</p>
          <p className="text-[24px] font-medium text-red-600">{stats.spam}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'spam'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 text-[13px] font-medium capitalize transition-colors',
              filter === f
                ? 'bg-[#013220] text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Comments Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Comment
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Post
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-right text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {comments.map((comment) => (
              <tr key={comment.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-[14px] text-black">{comment.name}</p>
                    <p className="text-[12px] text-gray-500">{comment.email}</p>
                    <p className="text-[14px] text-gray-700 mt-2 line-clamp-2">
                      {comment.comment}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/blog/${comment.post.slug}`}
                    target="_blank"
                    className="text-[14px] text-[#013220] hover:underline flex items-center gap-1"
                  >
                    {comment.post.title}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(comment.status)}
                </td>
                <td className="px-4 py-4 text-[13px] text-gray-600">
                  {formatDate(comment.created_at)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* Approve */}
                    {comment.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(comment.id, 'approved')}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* Mark as Spam */}
                    {comment.status !== 'spam' && (
                      <button
                        onClick={() => handleStatusChange(comment.id, 'spam')}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Mark as Spam"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {comments.length === 0 && (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-[14px]">No comments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
