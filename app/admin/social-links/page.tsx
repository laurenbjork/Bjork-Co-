'use client';

import { useState, useEffect } from 'react';
import { Share2, Save, Instagram, Facebook, Music2, Mail } from 'lucide-react';

interface SiteSettings {
  social_instagram: string;
  social_facebook: string;
  social_tiktok: string;
  contact_email: string;
}

export default function AdminSocialLinksPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    social_instagram: '',
    social_facebook: '',
    social_tiktok: '',
    contact_email: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/site-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings({
          social_instagram: data.social_instagram || '',
          social_facebook: data.social_facebook || '',
          social_tiktok: data.social_tiktok || '',
          contact_email: data.contact_email || '',
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-[28px] text-black flex items-center gap-2">
          <Share2 className="w-7 h-7 text-[#013220]" />
          Social Links & Contact
        </h1>
        <p className="text-gray-600 text-[14px] mt-1">
          Manage social media links and contact email for the footer
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 p-6 max-w-[600px]">
        <div className="space-y-6">
          {/* Instagram */}
          <div>
            <label className="flex items-center gap-2 text-[13px] font-medium text-black mb-2">
              <Instagram className="w-4 h-4" />
              Instagram Username
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[14px]">@</span>
              <input
                type="text"
                value={settings.social_instagram}
                onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                placeholder="bjorkandco"
                className="flex-1 px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>
            <p className="text-[12px] text-gray-500 mt-1">
              Just the username, no @ symbol
            </p>
          </div>

          {/* Facebook */}
          <div>
            <label className="flex items-center gap-2 text-[13px] font-medium text-black mb-2">
              <Facebook className="w-4 h-4" />
              Facebook Page Name
            </label>
            <input
              type="text"
              value={settings.social_facebook}
              onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
              placeholder="BJORKandCO"
              className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
            />
            <p className="text-[12px] text-gray-500 mt-1">
              Your Facebook page name (facebook.com/XXX)
            </p>
          </div>

          {/* TikTok */}
          <div>
            <label className="flex items-center gap-2 text-[13px] font-medium text-black mb-2">
              <Music2 className="w-4 h-4" />
              TikTok Username
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[14px]">@</span>
              <input
                type="text"
                value={settings.social_tiktok}
                onChange={(e) => setSettings({ ...settings, social_tiktok: e.target.value })}
                placeholder="yourusername"
                className="flex-1 px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>
          </div>

          {/* Contact Email */}
          <div className="pt-4 border-t border-gray-200">
            <label className="flex items-center gap-2 text-[13px] font-medium text-black mb-2">
              <Mail className="w-4 h-4" />
              Contact Email (Footer)
            </label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              placeholder="hello@bjorkco.com"
              className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
            />
            <p className="text-[12px] text-gray-500 mt-1">
              This email appears when users click the email icon in the footer
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 text-[13px] ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-200 p-6">
        <h3 className="text-[13px] font-medium text-black mb-4">Preview</h3>
        <div className="flex gap-3">
          {settings.social_instagram && (
            <a
              href={`https://instagram.com/${settings.social_instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#013220] hover:text-[#013220] transition-colors"
              title="Open Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {settings.social_facebook && (
            <a
              href={`https://facebook.com/${settings.social_facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#013220] hover:text-[#013220] transition-colors"
              title="Open Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {settings.social_tiktok && (
            <a
              href={`https://tiktok.com/@${settings.social_tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#013220] hover:text-[#013220] transition-colors"
              title="Open TikTok"
            >
              <Music2 className="w-4 h-4" />
            </a>
          )}
          {settings.contact_email && (
            <a
              href={`mailto:${settings.contact_email}`}
              className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center hover:border-[#013220] hover:text-[#013220] transition-colors"
              title="Send email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
