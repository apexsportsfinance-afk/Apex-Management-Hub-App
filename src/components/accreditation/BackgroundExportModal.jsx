import React, { useState } from 'react';
import { Server, Mail, X, Check, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackgroundExportModal({ isOpen, onClose, count, onStartJob }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    
    setIsSubmitting(true);
    
    try {
      // Execute the parent's actual API hook logic
      await onStartJob(email);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-100 p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
                <Server size={22} className="stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Enterprise Server Export</h3>
                <p className="text-xs text-slate-500 font-medium tracking-wide">High-Performance Background Engine</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full mb-4">
                  <Check size={40} className="stroke-[3px]" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Job Sent to Server!</h4>
                <p className="text-slate-500 text-sm">
                  You can safely close this entire tab. Our server is violently assembling {count} PDFs.<br/>
                  The final heavily-compressed ZIP file will be blasted into your email shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 mb-6 flex gap-3 items-start">
                  <Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-[13px] leading-relaxed text-amber-800">
                    You are generating <strong>{count}</strong> super high-resolution cards. Doing this inside your fragile web browser will likely cause it to crash violently. <br/><br/>
                    We will instantly bypass the browser and run this directly inside your backend server. Where should the final processed URL link be mailed?
                  </p>
                </div>

                <label className="block mb-4">
                  <span className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" /> Destination Target
                  </span>
                  <input 
                    type="email"
                    required
                    disabled={isSubmitting}
                    placeholder="manager@yourcompany.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 disabled:opacity-50"
                  />
                </label>

                <div className="flex gap-3 justify-end mt-8">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Igniting Server</>
                    ) : (
                      <>Push to Backend</>
                    )}
                  </button>
                </div>
              </>
            )}
            
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
