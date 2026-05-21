'use client';

import { useState, useEffect } from 'react';
import { Mail, Plus, Trash2, Save, Clock, MapPin, Phone } from 'lucide-react';

interface PageSection {
  id?: string;
  section_key: string;
  content: any;
}

export default function AdminContactPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch('/api/page-content/admin?slug=contact');
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      }
    } catch (error) {
      console.error('Error loading contact page content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      for (const section of sections) {
        const url = section.id
          ? `/api/page-content/${section.id}`
          : '/api/page-content';
        const method = section.id ? 'PUT' : 'POST';

        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_slug: 'contact',
            section_key: section.section_key,
            content: section.content,
          }),
        });
      }

      setSaveMessage('Changes saved successfully!');
      loadContent();
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveMessage('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getSectionComponent = (section: PageSection, index: number) => {
    switch (section.section_key) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-black mb-2">Title</label>
              <input
                type="text"
                value={section.content?.title || ''}
                onChange={(e) => updateContent(index, 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-black mb-2">Subtitle</label>
              <input
                type="text"
                value={section.content?.subtitle || ''}
                onChange={(e) => updateContent(index, 'subtitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-black mb-2">Description</label>
              <textarea
                value={section.content?.description || ''}
                onChange={(e) => updateContent(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>
          </div>
        );

      case 'contact_info':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#013220]" />
                <div className="flex-1">
                  <label className="block text-[13px] font-medium text-black mb-1">Email</label>
                  <input
                    type="email"
                    value={section.content?.email || ''}
                    onChange={(e) => updateContent(index, 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#013220]" />
                <div className="flex-1">
                  <label className="block text-[13px] font-medium text-black mb-1">Phone</label>
                  <input
                    type="text"
                    value={section.content?.phone || ''}
                    onChange={(e) => updateContent(index, 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#013220] mt-2" />
              <div className="flex-1">
                <label className="block text-[13px] font-medium text-black mb-1">Address</label>
                <textarea
                  value={section.content?.address || ''}
                  onChange={(e) => updateContent(index, 'address', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#013220] mt-2" />
              <div className="flex-1">
                <label className="block text-[13px] font-medium text-black mb-2">Business Hours</label>
                <div className="space-y-2">
                  {(section.content?.hours || []).map((hour: any, i: number) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={hour.day}
                        onChange={(e) => {
                          const hours = [...(section.content?.hours || [])];
                          hours[i] = { ...hours[i], day: e.target.value };
                          updateContent(index, 'hours', hours);
                        }}
                        placeholder="Day"
                        className="flex-1 px-3 py-2 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                      />
                      <input
                        type="text"
                        value={hour.time}
                        onChange={(e) => {
                          const hours = [...(section.content?.hours || [])];
                          hours[i] = { ...hours[i], time: e.target.value };
                          updateContent(index, 'hours', hours);
                        }}
                        placeholder="Time"
                        className="flex-1 px-3 py-2 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                      />
                      <button
                        onClick={() => {
                          const hours = [...(section.content?.hours || [])];
                          hours.splice(i, 1);
                          updateContent(index, 'hours', hours);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const hours = [...(section.content?.hours || []), { day: '', time: '' }];
                      updateContent(index, 'hours', hours);
                    }}
                    className="text-[13px] text-[#013220] hover:underline"
                  >
                    + Add Hours
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-black mb-2">Map Embed URL</label>
              <input
                type="url"
                value={section.content?.embed_url || ''}
                onChange={(e) => updateContent(index, 'embed_url', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                placeholder="Google Maps embed URL"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-black mb-2">Section Title</label>
              <input
                type="text"
                value={section.content?.title || ''}
                onChange={(e) => updateContent(index, 'title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-[14px]">
            Custom section - edit content in database
          </div>
        );
    }
  };

  const updateContent = (index: number, key: string, value: any) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      content: { ...newSections[index].content, [key]: value },
    };
    setSections(newSections);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black flex items-center gap-2">
            <Mail className="w-7 h-7 text-[#013220]" />
            Edit Contact Page
          </h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Customize your Contact page content
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saveMessage && (
        <div className={`p-4 text-[14px] ${saveMessage.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
          {saveMessage}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white border border-gray-200 p-6">
            <h3 className="text-[18px] font-medium text-black mb-4 capitalize">
              {section.section_key.replace('_', ' ')} Section
            </h3>
            {getSectionComponent(section, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
