'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', order: '0' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '', order: '0' });
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, order: String(c.order) });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('slug', form.slug);
      fd.append('order', form.order);
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await api.put(`/categories/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated!');
      } else {
        await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created!');
      }
      setShowForm(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Deleted.');
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-2xl font-bold text-[var(--text)]">Categories</h1>
        <button onClick={openCreate} className="btn-primary text-sm"><Plus size={16} /> Add Category</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-xl"/>)}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c._id} className="card p-4 relative group">
              {c.imageUrl ? (
                <Image src={c.imageUrl} alt={c.name} width={200} height={120} className="w-full h-28 object-cover rounded-xl mb-3" />
              ) : (
                <div className="w-full h-28 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-3xl">🎂</div>
              )}
              <h3 className="font-semibold text-[var(--text)]">{c.name}</h3>
              <p className="text-xs text-[var(--muted)]">slug: {c.slug} · order: {c.order}</p>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)} className="p-1.5 bg-white dark:bg-card-dark rounded-lg shadow text-primary hover:bg-primary/10"><Pencil size={12}/></button>
                <button onClick={() => handleDelete(c._id)} className="p-1.5 bg-white dark:bg-card-dark rounded-lg shadow text-red-500 hover:bg-red-50"><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="overlay flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card-light dark:bg-card-dark w-full max-w-md rounded-2xl shadow-2xl animate-slide-in-up p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-xl font-bold text-[var(--text)]">{editing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--muted)]"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input" placeholder="Category name" required />
              <input type="text" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} className="input" placeholder="slug (e.g. chocolate-cakes)" required />
              <input type="number" value={form.order} onChange={(e) => setForm({...form, order: e.target.value})} className="input" placeholder="Display order" />
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl cursor-pointer hover:border-primary/50">
                <Upload size={18} className="text-[var(--muted)]" />
                <span className="text-sm text-[var(--muted)]">{imageFile ? imageFile.name : 'Upload image'}</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
