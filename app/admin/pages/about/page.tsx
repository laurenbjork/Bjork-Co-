'use client';

import { useState, useEffect } from 'react';
import { Info, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';

interface PageSection {
  id?: string;
  section_key: string;
  content: any;
  images?: string[];
}

export default function AdminAboutPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch('/api/page-content/admin?slug=about');
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      }
    } catch (error) {
      console.error('Error loading about page content:', error);
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
            page_slug: 'about',
            section_key: section.section_key,
            content: section.content,
            images: section.images || [],
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

  const updateSection = (index: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const updateContent = (index: number, key: string, value: any) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      content: { ...newSections[index].content, [key]: value },
    };
    setSections(newSections);
  };

  const addSection = () => {
    setSections([
      ...sections,
      { section_key: 'new_section', content: { title: '', description: '' } },
    ]);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
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
            <Info className="w-7 h-7 text-[#013220]" />
            Edit About Page
          </h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Customize your About page content
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
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={section.section_key}
                onChange={(e) => updateSection(index, 'section_key', e.target.value)}
                className="text-[18px] font-medium text-black bg-transparent border-b border-gray-300 focus:border-[#013220] focus:outline-none"
                placeholder="Section Key"
              />
              <button
                onClick={() => removeSection(index)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={section.content?.title || ''}
                  onChange={(e) => updateContent(index, 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="Section title"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={section.content?.subtitle || ''}
                  onChange={(e) => updateContent(index, 'subtitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="Section subtitle"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[13px] font-medium text-black mb-2">
                  Description
                </label>
                <textarea
                  value={section.content?.description || ''}
                  onChange={(e) => updateContent(index, 'description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                  placeholder="Section description"
                />
              </div>

              {/* Button */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-black mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={section.content?.button_text || ''}
                    onChange={(e) => updateContent(index, 'button_text', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                    placeholder="Button text"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-black mb-2">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={section.content?.button_link || ''}
                    onChange={(e) => updateContent(index, 'button_link', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                    placeholder="/shop"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-[13px] font-medium text-black mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Images
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={section.images?.[0] || ''}
                    onChange={(e) => {
                      const newSections = [...sections];
                      newSections[index].images = [e.target.value];
                      setSections(newSections);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
                    placeholder="https://..."
                  />
                </div>
                {section.images?.[0] && (
                  <img
                    src={section.images[0]}
                    alt="Preview"
                    className="w-32 h-32 object-cover mt-2 rounded"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Section */}
      <button
        onClick={addSection}
        className="w-full py-4 border-2 border-dashed border-gray-300 text-gray-500 hover:border-[#013220] hover:text-[#013220] transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add New Section
      </button>
    </div>
  );
}
