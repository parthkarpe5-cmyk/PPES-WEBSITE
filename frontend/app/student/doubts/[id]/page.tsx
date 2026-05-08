'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDoubtDetails, addMessage, uploadImage, getAuthHeaders } from '@/lib/api';
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
  Info,
  Clock,
  CheckCircle2
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

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



  const handleWheel = (e: React.WheelEvent) => {
    if (selectedImage) {
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomScale(prev => Math.min(5, Math.max(0.5, prev + delta)));
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky/20 border-t-sky rounded-full animate-spin" />
          <p className="text-sky font-medium animate-pulse uppercase tracking-widest text-xs">Loading Chat...</p>
        </div>
      </div>
    );
  }

  if (!doubt) {
    return (
      <div className="h-screen bg-[#0A0F1C] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 p-8 rounded-[2.5rem] border border-red-500/20 max-w-sm">
           <Info className="text-red-500 mx-auto mb-4" size={48} />
           <h3 className="text-xl font-bold text-white mb-2 text-center">Access Denied</h3>
           <p className="text-slate-400 mb-6 text-center">You don't have permission to view this conversation or it doesn't exist.</p>
           <button onClick={() => router.push('/student/doubts')} className="w-full bg-sky text-white py-3 rounded-xl font-bold shadow-lg shadow-sky/20">Go Back</button>
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
            <div className="w-11 h-11 rounded-2xl bg-sky/20 flex items-center justify-center text-sky font-bold border border-sky/20">
              {doubt.subject_id[0]}
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-none">{doubt.title}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sky text-[10px] uppercase tracking-widest font-black">{doubt.subject_id}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Active Doubt</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-sky/10 text-sky border-sky/20 shadow-lg shadow-sky/10">
            Active Chat
          </span>
          <button className="p-2 text-slate-500 hover:text-white transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {messages.map((msg, index) => {
          const isMe = msg.sender_id === userId;
          const showDate = index === 0 || 
            new Date(messages[index-1].created_at).toDateString() !== new Date(msg.created_at).toDateString();

          return (
            <div key={msg._id} className="flex flex-col">
              {showDate && (
                <div className="flex justify-center my-8">
                  <span className="bg-white/5 backdrop-blur-xl text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/5 shadow-2xl">
                    {new Date(msg.created_at).toLocaleDateString([], { month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}
              
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`relative max-w-[85%] md:max-w-[65%] group`}>
                  <div className={`
                    p-5 rounded-[2rem] shadow-2xl
                    ${isMe 
                      ? 'bg-sky text-white rounded-tr-none shadow-sky/20' 
                      : 'bg-[#0F172A]/80 backdrop-blur-xl text-white border border-white/10 rounded-tl-none'}
                  `}>
                    {!isMe && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-lg bg-sky/20 flex items-center justify-center">
                          <CheckCircle2 size={12} className="text-sky" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-sky">
                          Official Faculty
                        </p>
                      </div>
                    )}
                    
                    {msg.image_url && (
                      <div 
                        onClick={() => {
                          setSelectedImage(`http://localhost:5000${msg.image_url}`);
                          setZoomScale(1);
                        }}
                        className="mb-3 rounded-[1.25rem] overflow-hidden border border-white/10 shadow-lg group-hover:scale-[1.02] transition-transform cursor-pointer"
                      >
                        <img 
                          src={`http://localhost:5000${msg.image_url}`} 
                          alt="Attachment" 
                          className="w-full object-cover max-h-80"
                        />
                      </div>
                    )}
                    
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.text}
                    </p>
                    
                    <div className={`flex items-center justify-end gap-1.5 mt-3 text-[9px] font-bold ${isMe ? 'text-white/60' : 'text-slate-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMe && <CheckCheck size={14} className="text-white/80" />}
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
      <footer className="bg-[#0A0F1C] border-t border-white/5 p-6 md:p-8">
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence>
            {imagePreview && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-full mb-6 left-0 bg-[#0F172A] backdrop-blur-2xl p-3 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="h-40 w-auto rounded-[1.5rem] object-cover" />
                  <button 
                    onClick={() => { setImageFile(null); setImagePreview(''); }}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-2xl hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-[2.5rem] p-2 pl-6 pr-2 focus-within:border-sky/50 focus-within:bg-white/[0.08] transition-all shadow-2xl">
            <label className="cursor-pointer p-3 text-slate-400 hover:text-sky transition-colors">
              <ImageIcon size={24} />
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            <textarea 
              rows={1}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Ask your doubt..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white text-base py-4 resize-none max-h-32 scrollbar-hide"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e as any);
                }
              }}
            />
            <button 
              type="submit"
              disabled={sending || (!messageText.trim() && !imageFile)}
              className="bg-sky text-white w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-sky/20"
            >
              {sending ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={24} />}
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-[0.2em] font-bold">Encrypted End-to-End • PPES Security</p>
        </div>
      </footer>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md select-none"
            onWheel={handleWheel}
            onClick={() => setSelectedImage(null)}
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-[110]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky/20 flex items-center justify-center text-sky font-bold border border-sky/20">
                  {doubt.subject_id[0]}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{doubt.title}</p>
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Image Attachment</p>
                </div>
              </div>
              <button 
                className="p-3 bg-white/10 hover:bg-red-500 rounded-2xl text-white transition-all"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Main Image Container */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing">
              <motion.div
                drag
                dragMomentum={false}
                style={{ scale: zoomScale }}
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedImage} 
                  alt="Expanded" 
                  className="max-w-[90vw] max-h-[85vh] object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-lg"
                  draggable={false}
                />
              </motion.div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-10 flex items-center gap-2 bg-black/40 backdrop-blur-2xl p-2 rounded-[2rem] border border-white/10 z-[110]">
              <button 
                onClick={(e) => { e.stopPropagation(); setZoomScale(prev => Math.max(0.5, prev - 0.25)); }}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
              >
                -
              </button>
              <div className="px-4 py-2 bg-white/5 rounded-full min-w-[80px] text-center">
                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                  {Math.round(zoomScale * 100)}%
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setZoomScale(prev => Math.min(5, Math.max(0.5, prev + 0.25))); }}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
              >
                +
              </button>
              <div className="w-[1px] h-6 bg-white/10 mx-2" />
              <button 
                onClick={(e) => { e.stopPropagation(); setZoomScale(1); }}
                className="px-6 py-2 bg-sky text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-sky/20"
              >
                Reset
              </button>
            </div>
            
            <p className="absolute bottom-4 text-slate-500 text-[10px] font-medium tracking-widest uppercase pointer-events-none">
              Use Mouse Wheel to Zoom • Drag to Pan
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
