'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (result: string) => void;
}

export default function VoiceSearchModal({ isOpen, onClose, onResult }: VoiceSearchModalProps) {
  const [state, setState] = useState<'listening' | 'success' | 'error'>('listening');
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition on open
  useEffect(() => {
    if (!isOpen) return;

    setState('listening');
    setTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setState('error');
      setTranscript('Voice search not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      if (text.trim()) {
        setTranscript(text.trim());
        setState('success');

        // Automatically trigger search after showing the result for 1 second
        setTimeout(() => {
          onResult(text.trim());
        }, 1000);
      } else {
        setState('error');
        setTranscript('Could not hear anything. Please try again.');
      }
    };

    recognition.onerror = (event: any) => {
      setState('error');
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setTranscript('Microphone access denied. Please allow mic permission and try again.');
      } else {
        setTranscript('Microphone access denied. Please allow mic permission and try again.');
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      setState('error');
      setTranscript('Microphone access denied. Please allow mic permission and try again.');
    }

    // Cleanup when modal closes
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isOpen, onResult]);

  // Handle Escape Key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleRetry = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setState('listening');
    setTranscript('');
    setTimeout(() => {
      try {
        if (recognitionRef.current) recognitionRef.current.start();
      } catch (e) {
        setState('error');
      }
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dynamic Keyframes for simple scale entrance */}
      <style>{`
        @keyframes scaleFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleFadeIn {
          animation: scaleFadeIn 0.2s ease-out forwards;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Popup Card */}
      <div className="relative bg-[#FFF5F8] dark:bg-[#1a0a0f] rounded-2xl shadow-2xl p-8 w-80 sm:w-96
                      flex flex-col items-center animate-scaleFadeIn"
           onClick={(e) => e.stopPropagation()}>
        
        {/* --- STATE 1: LISTENING --- */}
        {state === 'listening' && (
          <>
            <h2 className="font-dmsans text-[#C2185B] text-lg font-semibold mb-8">
              Listening...
            </h2>
            
            <div className="relative w-24 h-24 flex items-center justify-center mb-8">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full bg-[#C2185B]/30 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-[#C2185B]/30 animate-ping delay-150" />
              <div className="absolute inset-0 rounded-full bg-[#C2185B]/30 animate-ping delay-300" />
              
              {/* Center Mic icon */}
              <div className="relative z-10 w-20 h-20 bg-white dark:bg-[#2a1a1f] rounded-full flex items-center justify-center shadow-lg">
                <Mic size={48} className="text-[#C2185B]" />
              </div>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
              Speak now — say a cake name 🎂
            </p>

            <button
              onClick={onClose}
              className="text-[#C2185B] hover:underline text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </>
        )}

        {/* --- STATE 2: SUCCESS --- */}
        {state === 'success' && (
          <>
            <h2 className="font-dmsans text-[#C2185B] text-lg font-semibold mb-8">
              Got it!
            </h2>
            
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              {/* Static gold mic */}
              <div className="w-20 h-20 bg-white dark:bg-[#2a1a1f] rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#F9A825]/20">
                <Mic size={48} className="text-[#F9A825]" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#2a1a1f] rounded-xl p-3 mb-6 w-full shadow-inner">
              <p className="text-gray-700 dark:text-gray-200 text-xl font-medium text-center italic">
                &ldquo;{transcript}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-primary font-medium">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Searching...</span>
            </div>
          </>
        )}

        {/* --- STATE 3: ERROR --- */}
        {state === 'error' && (
          <>
            <h2 className="font-dmsans text-red-500 text-lg font-semibold mb-6">
              Microphone Error
            </h2>

            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <MicOff size={40} className="text-red-400" />
            </div>

            <p className="text-gray-700 dark:text-gray-200 text-center font-medium mb-1">
              {transcript.split('\n')[0]}
            </p>
            {transcript.split('\n')[1] && (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8">
                {transcript.split('\n')[1]}
              </p>
            )}

            <div className="w-full space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-[#C2185B] text-white rounded-xl py-3 font-medium transition-transform hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                <Mic size={18} />
                Try Again
              </button>
              <button
                onClick={onClose}
                className="w-full text-gray-500 dark:text-gray-400 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
