'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFormSubmissions } from '@/app/lib/supabase-admin';
import { Mail, Phone, Calendar, Eye, CheckCircle, MessageSquare, User, ShoppingBag } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface FormSubmission {
  id: string;
  form_type: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  product_id?: string;
  product_name?: string;
  status: string;
  created_at: string;
}

export default function AdminInquiriesPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await getFormSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkResponded = async (id: string) => {
    try {
      const response = await fetch(`/api/form-submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'responded' }),
      });

      if (response.ok) {
        loadSubmissions();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
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

  const getFormTypeIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <MessageSquare className="w-4 h-4" />;
      case 'product_inquiry':
        return <ShoppingBag className="w-4 h-4" />;
      case 'appointment':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getFormTypeLabel = (type: string) => {
    switch (type) {
      case 'contact':
        return 'Contact';
      case 'product_inquiry':
        return 'Product Inquiry';
      case 'appointment':
        return 'Appointment';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Form Submissions</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            View and manage customer inquiries ({submissions.length} submissions)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
            <h2 className="font-medium text-[14px] text-black">Recent Submissions</h2>
          </div>

          {submissions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-[14px]">No submissions yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className={cn(
                    'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                    selectedSubmission?.id === submission.id && 'bg-[#013220]/5'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#013220]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      {getFormTypeIcon(submission.form_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] font-medium px-2 py-0.5 bg-gray-100 rounded">
                          {getFormTypeLabel(submission.form_type)}
                        </span>
                        {submission.status === 'new' && (
                          <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-600 rounded">
                            New
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-[14px] text-black truncate">
                        {submission.subject || submission.message.slice(0, 50)}...
                      </h3>
                      <div className="flex items-center gap-3 text-[12px] text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {submission.name}
                        </span>
                        <span>•</span>
                        <span>{formatDate(submission.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submission Detail */}
        <div className="bg-white border border-gray-200">
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
            <h2 className="font-medium text-[14px] text-black">Submission Details</h2>
          </div>

          {selectedSubmission ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-[#013220]/10 rounded-full flex items-center justify-center">
                  {getFormTypeIcon(selectedSubmission.form_type)}
                </div>
                <div>
                  <span className="text-[12px] font-medium px-2 py-0.5 bg-gray-100 rounded">
                    {getFormTypeLabel(selectedSubmission.form_type)}
                  </span>
                  <p className="text-[12px] text-gray-500">
                    {formatDate(selectedSubmission.created_at)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[12px] text-gray-500 uppercase">From</label>
                  <p className="font-medium text-[14px] text-black">{selectedSubmission.name}</p>
                </div>

                <div>
                  <label className="text-[12px] text-gray-500 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <a 
                    href={`mailto:${selectedSubmission.email}`}
                    className="text-[14px] text-[#013220] hover:underline"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>

                {selectedSubmission.phone && (
                  <div>
                    <label className="text-[12px] text-gray-500 uppercase flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Phone
                    </label>
                    <a 
                      href={`tel:${selectedSubmission.phone}`}
                      className="text-[14px] text-[#013220] hover:underline"
                    >
                      {selectedSubmission.phone}
                    </a>
                  </div>
                )}

                {selectedSubmission.product_name && (
                  <div>
                    <label className="text-[12px] text-gray-500 uppercase flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      Product
                    </label>
                    <p className="text-[14px] text-black">{selectedSubmission.product_name}</p>
                  </div>
                )}

                {selectedSubmission.subject && (
                  <div>
                    <label className="text-[12px] text-gray-500 uppercase">Subject</label>
                    <p className="text-[14px] text-black">{selectedSubmission.subject}</p>
                  </div>
                )}

                <div>
                  <label className="text-[12px] text-gray-500 uppercase">Message</label>
                  <p className="text-[14px] text-black whitespace-pre-wrap bg-gray-50 p-3 rounded">
                    {selectedSubmission.message}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={() => handleMarkResponded(selectedSubmission.id)}
                  className="flex items-center gap-2 w-full justify-center px-4 py-3 bg-[#013220] text-white text-[13px] font-medium hover:bg-black transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Responded
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Eye className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-[14px]">
                Select a submission to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
