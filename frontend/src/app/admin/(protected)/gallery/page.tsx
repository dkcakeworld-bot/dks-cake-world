'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Upload } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface GalleryItem {
  _id: string;
  imageUrl: string;
  description: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchGallery = () => {
    api.get('/gallery').then((r) => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) { toast.error('Select an image first.'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      fd.append('description', description);
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image uploaded!');
      setImageFile(null);
      setDescription('');
      fetchGallery();
    } catch {
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Deleted.');
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch {
      toast.error('Failed.');
    }
  };

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold text-[var(--text)] mb-6">Gallery</h1>

      {/* Upload form */}
      <form onSubmit={handleUpload} className="card p-5 mb-8 flex flex-col sm:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl cursor-pointer hover:border-primary/50">
            <Upload size={18} className="text-[var(--muted)]" />
            <span className="text-sm text-[var(--muted)]">{imageFile ? imageFile.name : 'Select image'}</span>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
        </div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input sm:w-56"
          placeholder="Description (optional)"
        />
        <button type="submit" disabled={uploading} className="btn-primary text-sm shrink-0">
          {uploading ? 'Uploading...' : <><Plus size={16} /> Upload</>}
        </button>
      </form>

      {/* Gallery grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="skeleton h-40 rounded-xl"/>)}</div>
      ) : items.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-10">No gallery images yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className="relative group rounded-xl overflow-hidden">
              <Image src={item.imageUrl} alt={item.description || ''} width={300} height={200} className="w-full h-40 object-cover" />
              <button
                onClick={() => handleDelete(item._id)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg
                           opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 size={14} />
              </button>
              {item.description && (
                <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
