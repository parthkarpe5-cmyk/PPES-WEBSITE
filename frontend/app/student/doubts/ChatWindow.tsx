'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDoubtDetails, addMessage, updateDoubtStatus, uploadImage, getAuthHeaders } from '@/lib/api';
import { 
  Send, 
  Upload, 
  X, 
  ChevronLeft, 
  MoreVertical, 
  Check, 
  CheckCheck,
  Paperclip,
  Image as ImageIcon,
  Info
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
  assigned_teacher_id?: string;
}

interface Message {
  _id: string;
  sender_id: string;
  text: string;
  image_url?: string;
  created_at: string;
}

export default function StudentChatPage() {
  const params = useParams();
  const router = useRouter();
  const doubtId = params.id as string;
  const { 'x-user-id': userId } = getAuthHeaders();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [doubt, setDoubt] = useState<Doubt | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchDoubtDetails = async () => {
      try {
        const data = await getDoubtDetails(doubtId);
        setDoubt(data.doubt);
        setMessages(data.messages || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    fetchDoubtDetails();
    const interval = setInterval(fetchDoubtDetails, 5000);
    return () => clearInterval(interval);
  }, [doubtId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !imageFile) return;

    setSending(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const newMessage = await addMessage(doubtId, {
        text: messageText,
        image_url: imageUrl
      });

      setMessages((prev) => [...prev, newMessage]);
      setMessageText('');
      setImageFile(null);
      setImagePreview('');
    } catch (err: any) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky"></div>
      </div>
    );
  }

  if (!doubt) {
    return (
      <div className="h-screen bg-[#0A0F1C] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 p-6 rounded-[2rem] border border-red-500/20 max-w-sm">
           <Info className="text-red-500 mx-auto mb-4" size={48} />
           <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
           <p className="text-slate-400 mb-6">You don't have permission to view this conversation or it doesn't exist.</p>
           <button onClick={() => router.push('/student/doubts')} className="w-full bg-sky text-white py-3 rounded-xl font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050810] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/student/doubts')}
            className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky/20 flex items-center justify-center text-sky font-bold">
              {doubt.subject_id[0]}
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-none">{doubt.title}</h1>
              <p className="text-sky text-[10px] uppercase tracking-widest font-bold mt-1">{doubt.subject_id}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter border ${
            doubt.status === 'open' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
          }`}>
            {doubt.status}
          </span>
          <button className="p-2 text-slate-500 hover:text-white transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Messages Area - WhatsApp Style */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {messages.map((msg, index) => {
          const isMe = msg.sender_id === userId;
          const showDate = index === 0 || 
            new Date(messages[index-1].created_at).toDateString() !== new Date(msg.created_at).toDateString();

          return (
            <div key={msg._id} className="flex flex-col">
              {showDate && (
                <div className="flex justify-center my-6">
                  <span className="bg-white/5 backdrop-blur-md text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-white/5">
                    {new Date(msg.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}
              
              <motion.div 
                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`relative max-w-[85%] md:max-w-[70%] group`}>
                  <div className={`
                    p-4 rounded-[1.5rem] shadow-lg
                    ${isMe 
                      ? 'bg-sky text-white rounded-tr-none' 
                      : 'bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-tl-none'}
                  `}>
                    {!isMe && (
                      <p className="text-[10px] font-black uppercase tracking-widest text-sky mb-1">
                        Faculty
                      </p>
                    )}
                    
                    {msg.image_url && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-white/10">
                        <img 
                          src={`http://localhost:5000${msg.image_url}`} 
                          alt="Attachment" 
                          className="w-full object-cover max-h-60"
                        />
                      </div>
                    )}
                    
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isMe ? 'text-white/70' : 'text-slate-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMe && <CheckCheck size={12} className="text-white" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className="bg-[#0A0F1C] border-t border-white/5 p-4 pb-8">
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence>
            {imagePreview && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-4 left-0 bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl"
              >
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="h-32 rounded-xl" />
                  <button 
                    onClick={() => { setImageFile(null); setImagePreview(''); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-[2rem] p-2 pl-4 pr-2 focus-within:border-sky/50 transition-all shadow-inner">
            <label className="cursor-pointer p-2 text-slate-400 hover:text-sky transition-colors">
              <ImageIcon size={22} />
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <input 
              type="text" 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm py-3"
            />
            <button 
              type="submit"
              disabled={sending || (!messageText.trim() && !imageFile)}
              className="bg-sky text-white p-3 rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
