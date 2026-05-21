import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import DOMPurify from 'dompurify';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../context/AdminContext';

const CATEGORIES = [
  'Post-Divorce Series',
  'Inspiration',
  'Personal Development',
  'Lifestyle',
  'Motivation',
  'Parenting',
  'Faith',
  'Finance',
  'Other',
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

/* ── Simple toolbar button ── */
function ToolBtn({ title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="px-2 py-1 text-gray-600 hover:text-primary hover:bg-gray-100 rounded text-sm font-medium transition"
    >
      {children}
    </button>
  );
}

/* ── Rich Text Editor ── */
function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const isUpdating = useRef(false);

  // Sync external value into editor only on mount / when value changes externally
  useEffect(() => {
    if (editorRef.current && !isUpdating.current) {
      // Only update DOM if content truly differs (avoids cursor reset)
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const exec = useCallback((cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    // Emit updated HTML
    onChange(editorRef.current?.innerHTML || '');
  }, [onChange]);

  const insertHTML = useCallback((html) => {
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, html);
    onChange(editorRef.current?.innerHTML || '');
  }, [onChange]);

  const handleInput = () => {
    isUpdating.current = true;
    onChange(editorRef.current?.innerHTML || '');
    // Reset flag after a tick
    setTimeout(() => { isUpdating.current = false; }, 0);
  };

  const handleLink = () => {
    const url = window.prompt('Enter URL:', 'https://');
    if (url) exec('createLink', url);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <ToolBtn title="Bold" onClick={() => exec('bold')}><b>B</b></ToolBtn>
        <ToolBtn title="Italic" onClick={() => exec('italic')}><i>I</i></ToolBtn>
        <ToolBtn title="Underline" onClick={() => exec('underline')}><u>U</u></ToolBtn>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolBtn title="Heading 2" onClick={() => exec('formatBlock', 'h2')}>H2</ToolBtn>
        <ToolBtn title="Heading 3" onClick={() => exec('formatBlock', 'h3')}>H3</ToolBtn>
        <ToolBtn title="Paragraph" onClick={() => exec('formatBlock', 'p')}>¶</ToolBtn>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolBtn title="Bullet list" onClick={() => exec('insertUnorderedList')}>• List</ToolBtn>
        <ToolBtn title="Numbered list" onClick={() => exec('insertOrderedList')}>1. List</ToolBtn>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolBtn title="Insert link" onClick={handleLink}>🔗</ToolBtn>
        <ToolBtn title="Remove link" onClick={() => exec('unlink')}>🔗✕</ToolBtn>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolBtn title="Blockquote" onClick={() => insertHTML('<blockquote style="border-left:4px solid #4ab5c4;padding-left:1rem;color:#555;margin:1rem 0"></blockquote>')}>❝</ToolBtn>
        <ToolBtn title="Horizontal rule" onClick={() => insertHTML('<hr style="margin:1.5rem 0;border-color:#e5e7eb"/>')}>—</ToolBtn>
        <div className="flex-1" />
        <ToolBtn title="Clear formatting" onClick={() => exec('removeFormat')}>✕ Clear</ToolBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={(e) => {
          // Let paste happen then sync
          setTimeout(() => onChange(editorRef.current?.innerHTML || ''), 0);
        }}
        className="blog-content min-h-[320px] p-4 text-gray-800 text-sm focus:outline-none"
      />
    </div>
  );
}

/* ── Main Form ── */
export default function AdminBlogForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAdmin();
  const navigate = useNavigate();

  const [tab, setTab] = useState('write'); // 'write' | 'html' | 'preview'
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Post-Divorce Series',
    customCategory: '',
    featured_image: '',
    author: 'Natalie Cabinda',
    published: false,
  });

  const [slugEdited, setSlugEdited] = useState(false);

  // Load post for editing
  useEffect(() => {
    if (!isEdit) return;
    axios.get(`/api/admin/blog/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        const p = r.data;
        const knownCat = CATEGORIES.includes(p.category);
        setForm({
          title: p.title || '',
          slug: p.slug || '',
          excerpt: p.excerpt || '',
          content: p.content || '',
          category: knownCat ? p.category : 'Other',
          customCategory: knownCat ? '' : (p.category || ''),
          featured_image: p.featured_image || '',
          author: p.author || 'Natalie Cabinda',
          published: p.published || false,
        });
        setSlugEdited(true);
      })
      .catch(() => setError('Failed to load post.'))
      .finally(() => setLoading(false));
  }, [id, token, isEdit]);

  // Auto-slug from title
  const handleTitleChange = (e) => {
    const t = e.target.value;
    setForm(f => ({
      ...f,
      title: t,
      slug: slugEdited ? f.slug : slugify(t),
    }));
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  const setContent = (content) => setForm(f => ({ ...f, content }));

  const effectiveCategory = form.category === 'Other' ? form.customCategory : form.category;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim()) return setError('Title is required.');
    if (!form.slug.trim()) return setError('Slug is required.');
    if (!form.content.trim()) return setError('Content cannot be empty.');

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content,
      category: effectiveCategory || 'Uncategorized',
      featured_image: form.featured_image.trim() || null,
      author: form.author.trim() || 'Natalie Cabinda',
      published: form.published,
      tags: [],
    };

    try {
      if (isEdit) {
        await axios.put(`/api/admin/blog/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Post updated successfully!');
      } else {
        const res = await axios.post('/api/admin/blog', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Post created! Redirecting...');
        setTimeout(() => navigate(`/admin/blog/${res.data.id}`), 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to save post. Please try again.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-gray-400">Loading post...</div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Post' : 'New Post'} | RRR Admin</title></Helmet>
      <AdminLayout>
        <form onSubmit={handleSubmit} className="p-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-primary">
                {isEdit ? 'Edit Post' : 'New Blog Post'}
              </h1>
              <button
                type="button"
                onClick={() => navigate('/admin/blog')}
                className="text-gray-400 hover:text-gray-600 text-sm mt-1 transition"
              >
                ← Back to Posts
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.published ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {form.published ? 'Published' : 'Draft'}
                </span>
              </label>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-sm disabled:opacity-60"
              >
                {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
              {success}
            </div>
          )}

          <div className="space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Post Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
                placeholder="e.g. Post Divorce Issue #12: Finding Your Voice"
                required
              />

              {/* Slug */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">/blog/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => { setSlugEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                    className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                    placeholder="post-url-slug"
                  />
                </div>
              </div>
            </div>

            {/* Content editor */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-700">
                  Content <span className="text-red-400">*</span>
                </label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
                  {['write', 'html', 'preview'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`px-3 py-1.5 font-medium transition capitalize ${
                        tab === t ? 'bg-accent text-white' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {t === 'write' ? '✏️ Write' : t === 'html' ? '&lt;/&gt; HTML' : '👁 Preview'}
                    </button>
                  ))}
                </div>
              </div>

              {tab === 'write' && (
                <RichEditor value={form.content} onChange={setContent} />
              )}

              {tab === 'html' && (
                <textarea
                  value={form.content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={18}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-y"
                  placeholder="<p>Your HTML content here...</p>"
                />
              )}

              {tab === 'preview' && (
                <div
                  className="blog-content min-h-[320px] p-4 border border-gray-200 rounded-lg text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(form.content || '<p class="text-gray-400">Nothing to preview yet.</p>'),
                  }}
                />
              )}

              <p className="text-xs text-gray-400 mt-2">
                Use the <strong>Write</strong> tab for formatting, <strong>HTML</strong> for raw code, <strong>Preview</strong> to see how it looks.
              </p>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Excerpt <span className="text-gray-400 font-normal">(shown on blog list page)</span>
              </label>
              <textarea
                value={form.excerpt}
                onChange={set('excerpt')}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
                placeholder="A brief summary of the post — 1-2 sentences..."
              />
            </div>

            {/* Sidebar fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="bg-white rounded-xl shadow p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={set('category')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {form.category === 'Other' && (
                  <input
                    type="text"
                    value={form.customCategory}
                    onChange={set('customCategory')}
                    placeholder="Type custom category..."
                    className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                )}
              </div>

              {/* Author */}
              <div className="bg-white rounded-xl shadow p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={set('author')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
            </div>

            {/* Featured image */}
            <div className="bg-white rounded-xl shadow p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Featured Image URL <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={form.featured_image}
                onChange={set('featured_image')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                placeholder="https://example.com/image.jpg  or  /images/my-photo.jpg"
              />
              {form.featured_image && (
                <img
                  src={form.featured_image}
                  alt="preview"
                  className="mt-3 h-32 rounded-lg object-cover border border-gray-200"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
            </div>

            {/* Bottom publish bar */}
            <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {form.published
                  ? '✅ This post will be visible to the public.'
                  : '📄 This post is saved as a draft.'}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, published: false }))}
                  className="btn-outline text-sm"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-sm disabled:opacity-60"
                >
                  {saving ? 'Saving...' : form.published ? (isEdit ? 'Update Post' : 'Publish Now') : (isEdit ? 'Save Changes' : 'Create Draft')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}
