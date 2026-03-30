'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Upload, GripVertical } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface CarouselSlide {
  _id: string;
  imageUrl: string;
  caption: string;
  order: number;
}

export default function AdminCarouselPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [order, setOrder] = useState('0');
  const [uploading, setUploading] = useState(false);

  const fetchSlides = () => {
    api.get('/carousel').then((r) => setSlides(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) { toast.error('Select an image.'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      fd.append('caption', caption);
      fd.append('order', order);
      await api.post('/carousel', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Slide added!');
      setImageFile(null);
      setCaption('');
      setOrder('0');
      fetchSlides();
    } catch {
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    try {
      await api.delete(`/carousel/${id}`);
      toast.success('Deleted.');
      setSlides((prev) => prev.filter((s) => s._id !== id));
    } catch {
      toast.error('Failed.');
    }
  };

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold text-[var(--text)] mb-6">Carousel</h1>

      <form onSubmit={handleUpload} className="card p-5 mb-8 flex flex-col sm:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl cursor-pointer hover:border-primary/50">
            <Upload size={18} className="text-[var(--muted)]" />
            <span className="text-sm text-[var(--muted)]">{imageFile ? imageFile.name : 'Select image'}</span>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
        </div>
        <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} className="input sm:w-40" placeholder="Caption" />
        <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="input sm:w-20" placeholder="Order" />
        <button type="submit" disabled={uploading} className="btn-primary text-sm shrink-0">
          {uploading ? 'Uploading...' : <><Plus size={16} /> Add Slide</>}
        </button>
      </form>

      {loading ? (
        <div className="space-y-4">{[1,2].map(i => <div key={i} className="skeleton h-32 rounded-xl"/>)}</div>
      ) : slides.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-10">No carousel slides yet.</p>
      ) : (
        <div className="space-y-4">
          {slides.map((slide) => (
            <div key={slide._id} className="card p-4 flex items-center gap-4">
              <GripVertical size={18} className="text-[var(--muted)] shrink-0" />
              <Image src={slide.imageUrl} alt={slide.caption || ''} width={120} height={70} className="w-28 h-16 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text)] truncate">{slide.caption || '(no caption)'}</p>
                <p className="text-xs text-[var(--muted)]">Order: {slide.order}</p>
              </div>
              <button onClick={() => handleDelete(slide._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
