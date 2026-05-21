'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, Calendar, CheckCircle, XCircle } from 'lucide-react';
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
  created_at: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    message: '',
    link: '',
    bg_color: '#013220',
    text_color: '#FFFFFF',
    is_active: true,
    start_date: '',
    end_date: '',
    priority: 0,
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId 
        ? `/api/announcements/${editingId}`
        : '/api/announcements';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          link: formData.link || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        resetForm();
        loadAnnouncements();
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadAnnouncements();
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      message: announcement.message,
      link: announcement.link || '',
      bg_color: announcement.bg_color,
      text_color: announcement.text_color,
      is_active: announcement.is_active,
      start_date: announcement.start_date?.split('T')[0] || '',
      end_date: announcement.end_date?.split('T')[0] || '',
      priority: announcement.priority,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      message: '',
      link: '',
      bg_color: '#013220',
      text_color: '#FFFFFF',
      is_active: true,
      start_date: '',
      end_date: '',
      priority: 0,
    });
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        loadAnnouncements();
      }
    } catch (error) {
      console.error('Error toggling announcement:', error);
    }
  };

  const isActive = (announcement: Announcement) => {
    if (!announcement.is_active) return false;
    const now = new Date();
    if (announcement.start_date && new Date(announcement.start_date) > now) return false;
    if (announcement.end_date && new Date(announcement.end_date) < now) return false;
    return true;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black">Announcement Bars</h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Manage promotional banners and announcements
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Announcement
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="font-serif text-[18px] text-black mb-4">
            {editingId ? 'Edit Announcement' : 'New Announcement'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-black mb-2">
                  Message *
                </label>
                <input
                  type="text"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="e.g., Free shipping on orders over $500"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Link (optional)
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Priority
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
                <p className="text-[12px] text-gray-500 mt-1">Higher number = shown first</p>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.bg_color}
                    onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                    className="w-12 h-10 border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.bg_color}
                    onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="w-12 h-10 border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Start Date (optional)
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  End Date (optional)
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 border-gray-300"
              />
              <label htmlFor="is_active" className="text-[13px] text-black">
                Active (visible on site)
              </label>
            </div>

            {/* Preview */}
            <div className="pt-4">
              <label className="block text-[13px] font-medium text-black mb-2">Preview</label>
              <div
                className="px-4 py-3 text-center text-[13px] font-medium tracking-[0.05em]"
                style={{
                  backgroundColor: formData.bg_color,
                  color: formData.text_color,
                }}
              >
                {formData.message || 'Your announcement text will appear here'}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#013220] text-white text-[13px] font-medium hover:bg-black transition-colors"
              >
                {editingId ? 'Save Changes' : 'Create Announcement'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-6 py-3 border border-gray-300 text-[13px] font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Preview
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Schedule
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Priority
              </th>
              <th className="px-4 py-3 text-right text-[12px] font-medium tracking-[0.05em] text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {announcements.map((announcement) => (
              <tr key={announcement.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div
                    className="px-3 py-2 text-[12px] font-medium inline-block max-w-[300px] truncate"
                    style={{
                      backgroundColor: announcement.bg_color,
                      color: announcement.text_color,
                    }}
                  >
                    {announcement.message}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => toggleActive(announcement.id, announcement.is_active)}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-1 text-[12px] font-medium rounded transition-colors',
                      isActive(announcement)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {isActive(announcement) ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        {announcement.is_active ? 'Scheduled' : 'Inactive'}
                      </>
                    )}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="text-[13px] text-gray-600">
                    {announcement.start_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        From: {new Date(announcement.start_date).toLocaleDateString()}
                      </div>
                    )}
                    {announcement.end_date && (
                      <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                        To: {new Date(announcement.end_date).toLocaleDateString()}
                      </div>
                    )}
                    {!announcement.start_date && !announcement.end_date && (
                      <span className="text-gray-400">Always visible</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-[14px] text-black">
                  {announcement.priority}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2 text-gray-400 hover:text-[#013220] transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
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

        {announcements.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-[14px]">No announcements yet.</p>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                resetForm();
              }}
              className="inline-block mt-4 text-[#013220] hover:underline text-[14px]"
            >
              Create your first announcement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
