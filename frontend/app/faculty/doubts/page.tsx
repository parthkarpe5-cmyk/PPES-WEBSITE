'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDoubts } from '@/lib/api';
import { 
  MessageSquare, 
  Search, 
  Clock, 
  CheckCircle2,
  Filter,
  MessageCircle,
  ChevronRight,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Doubt {
  _id: string;
  title: string;
  subject_id: string;
  status: 'open' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  student_id: string;
  student_name?: string;
  student_grade?: string;
  has_unread?: boolean;
}

export default function FacultyDoubtsDashboard() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  
  const router = useRouter();

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const data = await getDoubts();
      setDoubts(data);
    } catch (error) {
      console.error('Error loading doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default: return <MessageSquare className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredDoubts = doubts.filter((doubt) => {
    const matchesSearch = 
      (doubt.student_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      doubt.subject_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doubt.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = filterGrade === 'all' || doubt.student_grade === filterGrade;
    
    return matchesSearch && matchesGrade;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin" />
          <p className="text-saffron font-medium animate-pulse uppercase tracking-widest text-xs">Loading Assigned Doubts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-200 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
              <MessageCircle className="text-saffron" size={36} />
              Faculty Portal: Doubts
            </h1>
            <p className="text-slate-400 mt-2">Manage and respond to student inquiries assigned to you.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              {['all', 'Class 9', 'Class 10'].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setFilterGrade(grade)}
                  className={`px-4 md:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filterGrade === grade 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                    : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-saffron transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by student ID or subject..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-saffron/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Doubt List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoubts.length === 0 ? (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <User className="text-slate-500" size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No assigned doubts found</h3>
                <p className="text-slate-400 max-w-sm mx-auto">Either you are all caught up or no doubts have been assigned to you yet.</p>
              </div>
            ) : (
              filteredDoubts.map((doubt, index) => (
                <motion.div 
                  key={doubt._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/faculty/doubts/${doubt._id}`)}
                  className="group bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-saffron/30 p-6 rounded-[2rem] cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron font-bold border border-saffron/20">
                          {doubt.subject_id[0]}
                        </div>
                        {doubt.has_unread && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-saffron rounded-full border-2 border-[#0A0F1C] animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10 inline-block mb-1">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{doubt.subject_id}</span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-saffron transition-colors">
                          {doubt.student_name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">{doubt.student_grade}</span>
                          <span className="text-slate-600 text-[10px]">•</span>
                          <span className="text-slate-500 text-[10px] font-medium italic line-clamp-1">{doubt.title}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusIcon(doubt.status)}
                      {doubt.has_unread && (
                        <span className="text-[8px] font-black text-saffron uppercase tracking-widest animate-pulse">New Message</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mt-6 pt-4 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      STUDENT: {doubt.student_id}
                    </span>
                    <span className="flex items-center gap-2">
                      {new Date(doubt.created_at).toLocaleDateString()}
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
