'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getDoubts, 
  getSubjects, 
  getTeachers, 
  createDoubt,
  getAuthHeaders 
} from '@/lib/api';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  BookOpen, 
  User, 
  ChevronRight, 
  Clock, 
  Filter,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Doubt {
  _id: string;
  title: string;
  subject_id: string;
  status: 'open' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  last_message?: string;
  has_unread?: boolean;
}

interface Subject {
  _id: string;
  name: string;
  code: string;
  description: string;
  facultyIds: string[];
}

interface Teacher {
  userId: string;
  name: string;
  role: string;
  email: string;
}

export default function StudentDoubtsDashboard() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'dashboard' | 'select_subject' | 'select_teacher'>('dashboard');
  
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const router = useRouter();
  const { 'x-user-id': userId } = getAuthHeaders();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [doubtsData, subjectsData, teachersData] = await Promise.all([
        getDoubts(),
        getSubjects(),
        getTeachers()
      ]);
      setDoubts(doubtsData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewDoubt = () => {
    setStep('select_subject');
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setStep('select_teacher');
  };

  const handleSelectTeacher = async (teacher: Teacher) => {
    try {
      // Check if there's already an open doubt for this subject and teacher
      const existingDoubt = doubts.find(d => 
        d.subject_id === selectedSubject?.name && 
        d.status === 'open'
      );

      if (existingDoubt) {
        router.push(`/student/doubts/${existingDoubt._id}`);
      } else {
        // Create a new doubt session
        const newDoubt = await createDoubt({
          title: `Chat about ${selectedSubject?.name}`,
          subject_id: selectedSubject?.name || 'General',
          teacher_id: teacher.userId,
          initial_message: { text: "Hello, I have a doubt regarding this subject." }
        });
        router.push(`/student/doubts/${newDoubt._id}`);
      }
    } catch (error) {
      console.error('Error creating doubt session:', error);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky/20 border-t-sky rounded-full animate-spin" />
          <p className="text-sky font-medium animate-pulse">Initializing Dashboard...</p>
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
              <MessageCircle className="text-sky" size={36} />
              Doubts Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Connect with faculty and clear your concepts instantly.</p>
          </div>
          
          {step === 'dashboard' && (
            <button 
              onClick={handleStartNewDoubt}
              className="bg-sky hover:bg-sky/90 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_30px_rgba(47,168,204,0.3)]"
            >
              <Plus size={20} />
              Ask New Doubt
            </button>
          )}
          
          {step !== 'dashboard' && (
            <button 
              onClick={() => setStep('dashboard')}
              className="text-slate-400 hover:text-white font-medium flex items-center gap-2 transition-colors"
            >
              ← Back to Dashboard
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {step === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search your doubts..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-sky/50 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                  <Filter className="text-slate-400" size={20} />
                </button>
              </div>

              {/* Doubt List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doubts.length === 0 ? (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="text-slate-500" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No active doubts</h3>
                    <p className="text-slate-400 max-w-sm mx-auto">Start a new conversation with a teacher to clear your confusion.</p>
                  </div>
                ) : (
                  doubts
                    .filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.subject_id.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((doubt, index) => (
                    <motion.div 
                      key={doubt._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => router.push(`/student/doubts/${doubt._id}`)}
                      className="group bg-white/5 border border-white/10 hover:bg-white/[0.08] p-6 rounded-[2rem] cursor-pointer transition-all hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="relative">
                          <div className="px-3 py-1 bg-sky/10 rounded-full border border-sky/20">
                            <span className="text-[10px] font-bold text-sky uppercase tracking-widest">{doubt.subject_id}</span>
                          </div>
                          {doubt.has_unread && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-sky rounded-full border-2 border-[#0A0F1C] animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MessageCircle size={14} className="opacity-50" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Chat Open</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-sky transition-colors line-clamp-1 mb-2">
                        {doubt.title}
                        {doubt.has_unread && <span className="ml-2 inline-block w-2 h-2 bg-sky rounded-full" />}
                      </h3>
                      <div className="flex items-center justify-between text-slate-500 text-xs">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(doubt.created_at).toLocaleDateString()}
                        </span>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {step === 'select_subject' && (
            <motion.div 
              key="subjects"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="col-span-full mb-4">
                <h2 className="text-2xl font-bold text-white">Select a Subject</h2>
                <p className="text-slate-400">Choose the topic you need help with.</p>
              </div>
              {subjects.map((subject) => (
                <div 
                  key={subject._id}
                  onClick={() => handleSelectSubject(subject)}
                  className="group bg-white/5 border border-white/10 hover:border-sky/50 p-8 rounded-[2.5rem] cursor-pointer transition-all hover:bg-sky/5 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-sky/10 flex items-center justify-center text-sky mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{subject.name}</h3>
                  <p className="text-slate-500 text-sm">{subject.description}</p>
                </div>
              ))}
            </motion.div>
          )}

          {step === 'select_teacher' && (
            <motion.div 
              key="teachers"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="col-span-full mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Select Faculty</h2>
                  <p className="text-slate-400">Talking about <span className="text-sky font-bold">{selectedSubject?.name}</span></p>
                </div>
                <button 
                  onClick={() => setStep('select_subject')}
                  className="text-xs text-sky hover:underline"
                >
                  Change Subject
                </button>
              </div>
              
              {teachers
                .filter(t => selectedSubject?.facultyIds.includes(t.userId))
                .map((teacher) => (
                <div 
                  key={teacher.userId}
                  onClick={() => handleSelectTeacher(teacher)}
                  className="group flex items-center gap-6 bg-white/5 border border-white/10 hover:border-sky/50 p-6 rounded-[2.5rem] cursor-pointer transition-all hover:bg-sky/5"
                >
                  <div className="w-16 h-16 rounded-2xl bg-saffron/10 flex items-center justify-center text-saffron group-hover:rotate-6 transition-transform">
                    <User size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{teacher.name}</h3>
                    <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Expert Faculty</p>
                  </div>
                  <ChevronRight className="text-slate-700 group-hover:text-sky transition-colors" />
                </div>
              ))}

              {teachers.filter(t => selectedSubject?.facultyIds.includes(t.userId)).length === 0 && (
                <div className="col-span-full py-10 text-center text-slate-500">
                  No specific faculty assigned to this subject. Please contact administration.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
