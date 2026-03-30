'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Check } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface AboutData {
  ownerImageUrl: string;
  content: string;
}

export default function AdminAboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/about').then((r) => {
      setAbout(r.data);
      setContent(r.data.content || '');
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('content', content);
      if (imageFile) fd.append('image', imageFile);
      const { data } = await api.put('/about', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAbout(data);
      setImageFile(null);
      toast.success('About page updated!');
    } catch { toast.error('Failed.'); } finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold text-[var(--text)] mb-8">About Page</h1>

      <div className="card p-6 max-w-2xl">
        {/* Owner Image */}
        <div className="mb-6">
          <h2 className="font-semibold text-[var(--text)] mb-3">Owner Image</h2>
          {about?.ownerImageUrl && (
            <Image src={about.ownerImageUrl} alt="Owner" width={120} height={120} className="w-24 h-24 rounded-full object-cover mb-3 ring-2 ring-primary/20" />
          )}
          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl cursor-pointer hover:border-primary/50">
            <Upload size={18} className="text-[var(--muted)]" />
            <span className="text-sm text-[var(--muted)]">{imageFile ? imageFile.name : 'Select owner image'}</span>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h2 className="font-semibold text-[var(--text)] mb-3">About Content</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input min-h-[180px]"
            placeholder="Write about your bakery..."
          />
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center">
          {saving ? 'Saving...' : <><Check size={16} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
