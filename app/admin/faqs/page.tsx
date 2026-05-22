'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, Plus, Trash2, Edit2, Save, X, Bold, List, Link2, Check } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface FAQCategory {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
}

interface FAQ {
  id: string;
  category_id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

interface CategoryWithFAQs extends FAQCategory {
  faqs: FAQ[];
}

export default function AdminFAQsPage() {
  const [categories, setCategories] = useState<CategoryWithFAQs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFAQForm, setShowFAQForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);
  
  const [faqForm, setFaqForm] = useState({
    category_id: '',
    question: '',
    answer: '',
    sort_order: 0,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    sort_order: 0,
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      // Get all FAQs grouped by category
      const response = await fetch('/api/faqs/admin');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFAQ = async () => {
    try {
      const url = editingFAQ 
        ? `/api/faqs/${editingFAQ.id}`
        : '/api/faqs';
      const method = editingFAQ ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqForm),
      });

      if (response.ok) {
        setShowFAQForm(false);
        setEditingFAQ(null);
        resetFAQForm();
        loadFAQs();
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleSaveCategory = async () => {
    try {
      const url = editingCategory
        ? `/api/faq-categories/${editingCategory.id}`
        : '/api/faq-categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      });

      if (response.ok) {
        setShowCategoryForm(false);
        setEditingCategory(null);
        resetCategoryForm();
        loadFAQs();
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadFAQs();
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure? This will delete all FAQs in this category.')) return;

    try {
      const response = await fetch(`/api/faq-categories/${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadFAQs();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const startEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFaqForm({
      category_id: faq.category_id,
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
    });
    setShowFAQForm(true);
  };

  const startEditCategory = (category: FAQCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      sort_order: category.sort_order,
    });
    setShowCategoryForm(true);
  };

  const resetFAQForm = () => {
    setFaqForm({ category_id: '', question: '', answer: '', sort_order: 0 });
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', sort_order: 0 });
  };

  // Rich text formatting helpers
  const insertTag = (tag: string) => {
    const textarea = document.getElementById('answer-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = faqForm.answer;
    const selectedText = text.substring(start, end);
    
    let replacement = '';
    switch (tag) {
      case 'b':
        replacement = `<strong>${selectedText || 'bold text'}</strong>`;
        break;
      case 'ul':
        replacement = `<ul>\n  <li>${selectedText || 'item'}</li>\n  <li>item</li>\n</ul>`;
        break;
      case 'li':
        replacement = `<li>${selectedText || 'item'}</li>`;
        break;
      case 'a':
        replacement = `<a href="${selectedText || 'https://'}" class="text-[#013220] hover:underline">${selectedText || 'link text'}</a>`;
        break;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setFaqForm({ ...faqForm, answer: newText });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[28px] text-black flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-[#013220]" />
            Manage FAQs
          </h1>
          <p className="text-gray-600 text-[14px] mt-1">
            Add, edit, or delete FAQ questions and categories
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowCategoryForm(true);
              setEditingCategory(null);
              resetCategoryForm();
            }}
            className="px-4 py-3 border border-gray-300 text-gray-700 text-[13px] font-medium hover:bg-gray-50 transition-colors"
          >
            + New Category
          </button>
          <button
            onClick={() => {
              setShowFAQForm(true);
              setEditingFAQ(null);
              resetFAQForm();
            }}
            className="flex items-center gap-2 px-4 py-3 bg-[#013220] text-white text-[13px] font-medium tracking-[0.05em] hover:bg-black transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>
      </div>

      {/* Category Form */}
      {showCategoryForm && (
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="font-serif text-[20px] text-black mb-4">
            {editingCategory ? 'Edit Category' : 'New Category'}
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              placeholder="Category name"
              className="flex-1 px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
            />
            <input
              type="number"
              value={categoryForm.sort_order}
              onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
              placeholder="Sort order"
              className="w-32 px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
            />
            <button
              onClick={handleSaveCategory}
              className="px-6 py-3 bg-[#013220] text-white text-[13px] font-medium hover:bg-black transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCategoryForm(false)}
              className="px-4 py-3 border border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FAQ Form */}
      {showFAQForm && (
        <div className="bg-white border border-gray-200 p-6">
          <h2 className="font-serif text-[20px] text-black mb-4">
            {editingFAQ ? 'Edit FAQ' : 'New FAQ'}
          </h2>
          
          <div className="space-y-4">
            {/* Category Select */}
            <div>
              <label className="block text-[13px] font-medium text-black mb-2">Category</label>
              <select
                value={faqForm.category_id}
                onChange={(e) => setFaqForm({ ...faqForm, category_id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Question */}
            <div>
              <label className="block text-[13px] font-medium text-black mb-2">Question</label>
              <input
                type="text"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                placeholder="Enter the question..."
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>

            {/* Answer with Rich Text Toolbar */}
            <div>
              <label className="block text-[13px] font-medium text-black mb-2">Answer (HTML supported)</label>
              
              {/* Toolbar */}
              <div className="flex gap-2 mb-2 p-2 bg-gray-50 border border-gray-200">
                <button
                  onClick={() => insertTag('b')}
                  className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertTag('ul')}
                  className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => insertTag('li')}
                  className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200"
                  title="List Item"
                >
                  <span className="text-[12px] font-medium">LI</span>
                </button>
                <button
                  onClick={() => insertTag('a')}
                  className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200"
                  title="Link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
              </div>

              <textarea
                id="answer-textarea"
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                rows={6}
                placeholder="Enter the answer... Use HTML for formatting: <strong>bold</strong>, <ul><li>list items</li></ul>, <a href='...'>links</a>"
                className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220] font-mono text-[13px]"
              />
              
              {/* Preview */}
              {faqForm.answer && (
                <div className="mt-3 p-4 bg-gray-50 border border-gray-200">
                  <p className="text-[12px] text-gray-500 mb-2">Preview:</p>
                  <div 
                    className="text-[14px] text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: faqForm.answer }}
                  />
                </div>
              )}
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-[13px] font-medium text-black mb-2">Sort Order</label>
              <input
                type="number"
                value={faqForm.sort_order}
                onChange={(e) => setFaqForm({ ...faqForm, sort_order: parseInt(e.target.value) || 0 })}
                className="w-32 px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-[#013220]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveFAQ}
                disabled={!faqForm.category_id || !faqForm.question || !faqForm.answer}
                className="px-6 py-3 bg-[#013220] text-white text-[13px] font-medium hover:bg-black transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Save FAQ
              </button>
              <button
                onClick={() => setShowFAQForm(false)}
                className="px-6 py-3 border border-gray-300 text-[13px] font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQs List by Category */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-white border border-gray-200">
            {/* Category Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-[20px] text-black">{category.name}</h2>
                <span className="text-[13px] text-gray-500">({category.faqs.length} FAQs)</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditCategory(category)}
                  className="p-2 text-gray-400 hover:text-[#013220] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* FAQs */}
            <div className="divide-y divide-gray-100">
              {category.faqs.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-[14px]">
                  No FAQs in this category yet.
                </div>
              ) : (
                category.faqs.map((faq) => (
                  <div key={faq.id} className="p-4 flex items-start justify-between hover:bg-gray-50">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-[15px] text-black mb-1">{faq.question}</p>
                      <div 
                        className="text-[14px] text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditFAQ(faq)}
                        className="p-2 text-gray-400 hover:text-[#013220] transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-[14px]">No FAQ categories yet.</p>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="inline-block mt-4 text-[#013220] hover:underline text-[14px]"
          >
            Create your first category
          </button>
        </div>
      )}
    </div>
  );
}
