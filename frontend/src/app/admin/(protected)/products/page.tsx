'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  category: Category;
  prices: { halfKg: number; oneKg: number };
  imageUrl: string;
  imagePublicId: string;
  description: string;
  isVeg: boolean;
}

const EMPTY_FORM = {
  name: '',
  category: '',
  halfKg: '',
  oneKg: '',
  description: '',
  isVeg: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category?._id || '',
      halfKg: String(p.prices.halfKg),
      oneKg: String(p.prices.oneKg),
      description: p.description,
      isVeg: p.isVeg,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('halfKg', form.halfKg);
      fd.append('oneKg', form.oneKg);
      fd.append('description', form.description);
      fd.append('isVeg', String(form.isVeg));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await api.put(`/products/${editing._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated!');
      } else {
        await api.post('/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created!');
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted.');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-2xl font-bold text-[var(--text)]">Products</h1>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)] border-b border-border-light dark:border-border-dark">
                <th className="pb-3 font-medium">Image</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium hidden sm:table-cell">Category</th>
                <th className="pb-3 font-medium">½ KG</th>
                <th className="pb-3 font-medium">1 KG</th>
                <th className="pb-3 font-medium">Veg</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-primary/5 transition-colors">
                  <td className="py-3 pr-3">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                        🎂
                      </div>
                    )}
                  </td>
                  <td className="py-3 font-medium text-[var(--text)]">{p.name}</td>
                  <td className="py-3 hidden sm:table-cell text-[var(--muted)]">
                    {p.category?.name}
                  </td>
                  <td className="py-3 text-[var(--text)]">{formatPrice(p.prices.halfKg)}</td>
                  <td className="py-3 text-[var(--text)]">{formatPrice(p.prices.oneKg)}</td>
                  <td className="py-3">
                    <span className={p.isVeg ? 'badge-veg' : 'badge-nonveg'}>
                      {p.isVeg ? 'Veg' : 'Non-veg'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20
                                   text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="overlay flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div
            className="bg-card-light dark:bg-card-dark w-full max-w-lg rounded-2xl shadow-2xl
                       animate-slide-in-up max-h-[90vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-xl font-bold text-[var(--text)]">
                {editing ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--muted)] hover:text-primary">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="Product name"
                required
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={form.halfKg}
                  onChange={(e) => setForm({ ...form, halfKg: e.target.value })}
                  className="input"
                  placeholder="½ KG price"
                  required
                />
                <input
                  type="number"
                  value={form.oneKg}
                  onChange={(e) => setForm({ ...form, oneKg: e.target.value })}
                  className="input"
                  placeholder="1 KG price"
                  required
                />
              </div>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input min-h-[80px] resize-none"
                placeholder="Description (optional)"
              />
              <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isVeg}
                  onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                Vegetarian
              </label>
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed
                                border-border-light dark:border-border-dark rounded-xl
                                cursor-pointer hover:border-primary/50 transition-colors">
                <Upload size={18} className="text-[var(--muted)]" />
                <span className="text-sm text-[var(--muted)]">
                  {imageFile ? imageFile.name : 'Upload image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center"
              >
                {submitting ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
