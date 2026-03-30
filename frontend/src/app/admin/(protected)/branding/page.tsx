'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Check } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Branding {
  logoUrl: string;
  menuCardUrl: string;
}

export default function AdminBrandingPage() {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingMenu, setUploadingMenu] = useState(false);

  useEffect(() => {
    api.get('/branding').then((r) => setBranding(r.data)).catch(() => {});
  }, []);

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('image', logoFile);
      const { data } = await api.put('/branding/logo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setBranding(data);
      setLogoFile(null);
      toast.success('Logo updated!');
    } catch { toast.error('Failed.'); } finally { setUploadingLogo(false); }
  };

  const handleMenuUpload = async () => {
    if (!menuFile) return;
    setUploadingMenu(true);
    try {
      const fd = new FormData();
      fd.append('image', menuFile);
      const { data } = await api.put('/branding/menucard', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setBranding(data);
      setMenuFile(null);
      toast.success('Menu card updated!');
    } catch { toast.error('Failed.'); } finally { setUploadingMenu(false); }
  };

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold text-[var(--text)] mb-8">Branding</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo */}
        <div className="card p-6">
          <h2 className="font-semibold text-[var(--text)] mb-4">Logo</h2>
          {branding?.logoUrl && (
            <Image src={branding.logoUrl} alt="Logo" width={120} height={120} className="w-24 h-24 object-cover rounded-full mb-4 ring-2 ring-primary/20" />
          )}
          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl cursor-pointer hover:border-primary/50 mb-3">
            <Upload size={18} className="text-[var(--muted)]" />
            <span className="text-sm text-[var(--muted)]">{logoFile ? logoFile.name : 'Select logo image'}</span>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
          <button onClick={handleLogoUpload} disabled={!logoFile || uploadingLogo} className="btn-primary text-sm w-full justify-center">
            {uploadingLogo ? 'Uploading...' : <><Check size={16} /> Update Logo</>}
          </button>
        </div>

        {/* Menu Card */}
        <div className="card p-6">
          <h2 className="font-semibold text-[var(--text)] mb-4">Menu Card</h2>
          {branding?.menuCardUrl && (
            <Image src={branding.menuCardUrl} alt="Menu Card" width={200} height={280} className="w-full max-w-[200px] h-auto rounded-xl mb-4 shadow-card" />
          )}
          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl cursor-pointer hover:border-primary/50 mb-3">
            <Upload size={18} className="text-[var(--muted)]" />
            <span className="text-sm text-[var(--muted)]">{menuFile ? menuFile.name : 'Select menu card image'}</span>
            <input type="file" accept="image/*" onChange={(e) => setMenuFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
          <button onClick={handleMenuUpload} disabled={!menuFile || uploadingMenu} className="btn-primary text-sm w-full justify-center">
            {uploadingMenu ? 'Uploading...' : <><Check size={16} /> Update Menu Card</>}
          </button>
        </div>
      </div>
    </div>
  );
}
