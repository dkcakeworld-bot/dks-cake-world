'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Feedback {
  _id: string;
  customerName: string;
  categoryId?: { name: string };
  productId?: { name: string };
  imageUrl: string;
  feedbackText: string;
  createdAt: string;
}

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/feedback').then((r) => setFeedbacks(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this feedback?')) return;
    try {
      await api.delete(`/feedback/${id}`);
      toast.success('Deleted.');
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch {
      toast.error('Failed.');
    }
  };

  return (
    <div>
      <h1 className="font-playfair text-2xl font-bold text-[var(--text)] mb-6">Feedbacks</h1>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl"/>)}</div>
      ) : feedbacks.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-10">No feedbacks yet.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="card p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-rose flex items-center justify-center text-white font-bold text-sm shrink-0">
                {fb.customerName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">{fb.customerName}</h3>
                    <p className="text-xs text-[var(--muted)]">
                      {fb.productId?.name} · {fb.categoryId?.name} ·{' '}
                      {new Date(fb.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(fb._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-sm text-[var(--muted)] mt-2">{fb.feedbackText}</p>
                {fb.imageUrl && (
                  <Image src={fb.imageUrl} alt="" width={200} height={120} className="mt-2 rounded-lg w-40 h-24 object-cover" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
