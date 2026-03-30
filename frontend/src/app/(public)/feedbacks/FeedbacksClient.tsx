'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, PenLine, X, Send, Upload } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
}

interface Feedback {
  _id: string;
  customerName: string;
  categoryId?: { name: string };
  productId?: { name: string };
  imageUrl: string;
  feedbackText: string;
  createdAt: string;
}

export default function FeedbacksClient() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    categoryId: '',
    productId: '',
    feedbackText: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Manage body scroll and Escape key binding when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowForm(false);
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [showForm]);

  // Fetch feedbacks
  useEffect(() => {
    api
      .get('/feedback')
      .then((r) => setFeedbacks(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch categories when form opens
  useEffect(() => {
    if (showForm && categories.length === 0) {
      api.get('/categories').then((r) => setCategories(r.data)).catch(() => {});
    }
  }, [showForm, categories.length]);

  // Fetch products when category changes
  useEffect(() => {
    if (formData.categoryId) {
      api
        .get(`/products?category=${formData.categoryId}`)
        .then((r) => setProducts(r.data))
        .catch(() => {});
    } else {
      setProducts([]);
    }
    setFormData((prev) => ({ ...prev, productId: '' }));
  }, [formData.categoryId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.categoryId || !formData.productId || !formData.feedbackText) {
      toast.error('Please fill all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('customerName', formData.customerName);
      fd.append('categoryId', formData.categoryId);
      fd.append('productId', formData.productId);
      fd.append('feedbackText', formData.feedbackText);
      if (imageFile) fd.append('image', imageFile);

      const { data } = await api.post('/feedback', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFeedbacks((prev) => [data, ...prev]);
      toast.success('Thank you for your feedback! 🎉');
      setShowForm(false);
      setFormData({ customerName: '', categoryId: '', productId: '', feedbackText: '' });
      setImageFile(null);
      setImagePreview('');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="section-title">
          Customer <span className="gradient-text">Feedbacks</span>
        </h1>
        <p className="section-subtitle">See what our customers say about us 💬</p>
      </div>

      {/* Write a Review button */}
      <div className="text-center mb-10">
        <button
          id="write-review-btn"
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <PenLine size={18} />
          Write a Review
        </button>
      </div>

      {/* Feedback cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-52 rounded-2xl" />
          ))}
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">💬</p>
          <p className="text-[var(--muted)]">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="card p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-rose flex items-center justify-center
                                text-white font-bold text-sm shrink-0">
                  {fb.customerName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[var(--text)] truncate">{fb.customerName}</h3>
                  <p className="text-xs text-[var(--muted)]">
                    {fb.productId?.name && `${fb.productId.name} • `}
                    {new Date(fb.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
                {fb.feedbackText}
              </p>

              {fb.imageUrl && (
                <Image
                  src={fb.imageUrl}
                  alt={`${fb.customerName}'s feedback`}
                  width={400}
                  height={300}
                  className="w-full h-40 object-cover rounded-xl"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Review Form Modal ────────── */}
      {showForm && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-200 ease-out animate-in fade-in" 
          onClick={() => setShowForm(false)}
        >
          <div
            className="relative bg-[#FFF5F8] dark:bg-[#1a0a0f] w-full max-w-md mx-auto 
                       rounded-2xl shadow-2xl z-[101] max-h-[90vh] overflow-y-auto px-6
                       transform transition-all duration-200 ease-out animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-[#FFF5F8] dark:bg-[#1a0a0f] pt-6 pb-3 mb-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
              <h2 className="font-playfair text-xl font-bold text-[var(--text)]">
                Write a Review ✍️
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full
                           text-[#C2185B] bg-primary/10 hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pb-8">
                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="input"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Category dropdown */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="input"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cake dropdown */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">
                    Cake *
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                    className="input"
                    required
                    disabled={!formData.categoryId}
                  >
                    <option value="">
                      {formData.categoryId ? 'Select cake' : 'Select a category first'}
                    </option>
                    {products.map((prod) => (
                      <option key={prod._id} value={prod._id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">
                    Photo (optional)
                  </label>
                  <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed
                                    border-border-light dark:border-border-dark rounded-xl
                                    cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload size={18} className="text-[var(--muted)]" />
                    <span className="text-sm text-[var(--muted)]">
                      {imageFile ? imageFile.name : 'Click to upload'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={200}
                      height={150}
                      className="mt-2 w-24 h-24 object-cover rounded-xl"
                    />
                  )}
                </div>

                {/* Feedback text */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">
                    Your Feedback *
                  </label>
                  <textarea
                    value={formData.feedbackText}
                    onChange={(e) =>
                      setFormData({ ...formData, feedbackText: e.target.value })
                    }
                    className="input min-h-[100px] resize-none"
                    placeholder="Share your experience..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center"
                >
                  {submitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send size={16} /> Submit Review
                    </>
                  )}
                </button>
              </form>
          </div>
        </div>
      )}
    </div>
  );
}
