'use client';

import { useState, useEffect } from 'react';
import { FileText, Link, Download, ExternalLink, Plus, Trash2, File, Globe, X } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useCall } from '@stream-io/video-react-sdk';
import { cn } from '../lib/utils';
import { useUser } from '../hooks/use-user';

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
  const { user } = useUser();
  const call = useCall();
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      type: 'file',
      title: 'Chapter 04 - Advanced Physics.pdf',
      size: '2.4 MB',
      url: '#',
      addedBy: 'Prof. Sarah',
      timestamp: '10 mins ago'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'file' | 'link'>('file');

  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on('custom', (event: any) => {
      if (event.user_id === call.currentUserId) return;

      if (event.custom.type === 'resource-added') {
        const newResource = event.custom.payload;
        setResources(prev => {
          if (prev.find(r => r.id === newResource.id)) return prev;
          return [newResource, ...prev];
        });
      }

      if (event.custom.type === 'resource-deleted') {
        const { resourceId } = event.custom.payload;
        setResources(prev => prev.filter(r => r.id !== resourceId));
      }

      if (event.custom.type === 'resource-request-sync') {
        if (resources.length > 0) {
          call.sendCustomEvent({
            type: 'resource-sync-data',
            payload: resources
          });
        }
      }

      if (event.custom.type === 'resource-sync-data') {
        setResources(event.custom.payload);
      }
    });

    call.sendCustomEvent({ type: 'resource-request-sync', payload: {} });

    return () => unsubscribe();
  }, [call]);

  const handleAdd = () => {
    if (!newTitle || !newUrl) return;

    const resource: Resource = {
      id: Math.random().toString(36).substr(2, 9),
      type: newType,
      title: newTitle,
      url: newUrl,
      addedBy: user?.name || 'Faculty',
      timestamp: 'Just now',
      size: newType === 'file' ? '1.0 MB' : undefined
    };

    setResources([resource, ...resources]);

    if (call) {
      call.sendCustomEvent({
        type: 'resource-added',
        payload: resource
      });
    }

    setIsAdding(false);
    setNewTitle('');
    setNewUrl('');
  };

  const handleDelete = (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
    if (call) {
      call.sendCustomEvent({
        type: 'resource-deleted',
        payload: { resourceId }
      });
    }
  };

  const isTeacher = user?.role === 'admin' || user?.role === 'faculty';

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
          {isTeacher && !isAdding && (
            <Button 
              onClick={() => setIsAdding(true)}
              size="sm" 
              className="bg-sky hover:bg-sky/80 text-white rounded-full px-4 h-8"
            >
              <Plus size={16} className="mr-1" /> Add
            </Button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
        <AnimatePresence mode="popLayout">
          {isAdding ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-4"
            >
              <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
                <button 
                  onClick={() => setNewType('file')}
                  className={cn("flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all", newType === 'file' ? "bg-sky text-white" : "text-slate-500")}
                >FILE</button>
                <button 
                  onClick={() => setNewType('link')}
                  className={cn("flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all", newType === 'link' ? "bg-sky text-white" : "text-slate-500")}
                >LINK</button>
              </div>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Resource Title"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky/50"
              />
              <input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={newType === 'file' ? "File URL" : "Web URL"}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky/50"
              />
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setIsAdding(false)} className="flex-1 text-xs">Cancel</Button>
                <Button onClick={handleAdd} className="flex-1 bg-sky text-xs">Add Resource</Button>
              </div>
            </motion.div>
          ) : resources.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 opacity-40">
              <FileText size={48} strokeWidth={1} className="mb-4" />
              <p className="text-sm font-medium">No resources shared yet</p>
              <p className="text-xs mt-1">Teachers can share files and links here</p>
            </div>
          ) : (
            resources.map((item) => (
              <motion.div 
                key={item.id}
                layout
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
                  <div className="flex flex-col gap-1">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-sky transition-colors">
                      {item.type === 'file' ? <Download size={18} /> : <ExternalLink size={18} />}
                    </a>
                    {isTeacher && (
                      <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-medium text-slate-600 uppercase tracking-widest">{item.timestamp}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
