'use client';

import { useState } from 'react';
import { FileText, Link, Download, ExternalLink, Plus, Trash2, File, Globe, X } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Resource {
  id: string;
  type: 'file' | 'link';
  title: string;
  size?: string;
  url: string;
  addedBy: string;
  timestamp: string;
}

export const ResourcesPanel = ({ onClose }: { onClose?: () => void }) => {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      type: 'file',
      title: 'Chapter 04 - Advanced Physics.pdf',
      size: '2.4 MB',
      url: '#',
      addedBy: 'Prof. Sarah',
      timestamp: '10 mins ago'
    },
    {
      id: '2',
      type: 'link',
      title: 'Supplemental Reading Material',
      url: 'https://example.com',
      addedBy: 'Prof. Sarah',
      timestamp: '15 mins ago'
    }
  ]);

  return (
    <div className="flex flex-col h-full bg-[#0D121F]/95 backdrop-blur-3xl text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky/10 text-sky">
            <FileText size={18} />
          </div>
          Session Resources
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="bg-sky hover:bg-sky/80 text-white rounded-full px-4 h-8"
          >
            <Plus size={16} className="mr-1" /> Add
          </Button>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
        {resources.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-sky/20 rounded-2xl p-4 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                item.type === 'file' ? "bg-amber-500/10 text-amber-500" : "bg-sky/10 text-sky"
              )}>
                {item.type === 'file' ? <File size={20} /> : <Globe size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate group-hover:text-white transition-colors">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {item.type === 'file' ? item.size : 'Web Link'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-[10px] font-medium text-slate-500 truncate">{item.addedBy}</span>
                </div>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-sky transition-colors">
                {item.type === 'file' ? <Download size={18} /> : <ExternalLink size={18} />}
              </button>
            </div>
            
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-medium text-slate-600 uppercase tracking-widest">{item.timestamp}</span>
              <button className="text-[9px] font-bold text-slate-600 hover:text-red-400 uppercase tracking-[0.2em] transition-colors">
                Delete
              </button>
            </div>
          </motion.div>
        ))}

        {resources.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 opacity-40">
            <FileText size={48} strokeWidth={1} className="mb-4" />
            <p className="text-sm font-medium">No resources shared yet</p>
            <p className="text-xs mt-1">Teachers can share files and links here</p>
          </div>
        )}
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
