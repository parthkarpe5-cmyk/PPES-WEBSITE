'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getDoubtDetails, addMessage, MOCK_USER, uploadImage } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { Send, Image as ImageIcon } from 'lucide-react';

export default function DoubtDetail() {
  const params = useParams();
  const doubtId = params.id as string;
  
  const [doubt, setDoubt] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const isFetching = useRef(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDoubtDetails();
    
    // Polling only when tab is active
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && !isFetching.current) {
        fetchDoubtDetails(false);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [doubtId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDoubtDetails = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    isFetching.current = true;
    try {
      const data = await getDoubtDetails(doubtId);
      if (data.success) {
        setDoubt(data.doubt);
        setMessages(data.messages);
      } else {
        setError(data.message || 'Error loading doubt');
      }
    } catch (err: any) {
      console.error('Failed to load doubt details:', err);
      setError(err?.response?.data?.message || 'Error connecting to server');
    } finally {
      if (showLoading) setLoading(false);
      isFetching.current = false;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;

    setSending(true);
    try {
      let imageUrl = null;
      if (file) {
        imageUrl = await uploadImage(file);
      }

      await addMessage({
        doubt_id: doubtId,
        text: newMessage,
        image_url: imageUrl,
      });

      setNewMessage('');
      setFile(null);
      await fetchDoubtDetails(false); // Refetch immediately
    } catch (err: any) {
      console.error('Failed to send message:', err);
      alert(err?.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center flex justify-center items-center h-[calc(100vh-2rem)]"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (error || !doubt) {
    return <div className="p-8 text-center text-red-500">{error || 'Doubt not found.'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] py-4 flex flex-col">
      {/* Header */}
      <div className="bg-white p-6 border-b border-slate-200 rounded-t-lg shadow-sm z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{doubt.title}</h1>
            <p className="text-sm text-slate-500 mt-1">
              Created {formatDistanceToNow(new Date(doubt.created_at))} ago
            </p>
          </div>
          <span
            className={`px-4 py-1 rounded-full text-xs font-semibold ${
              doubt.status === 'open'
                ? 'bg-green-100 text-green-800'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            {doubt.status.toUpperCase()}
          </span>
        </div>

        {/* Subject & Teacher Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</p>
            <p className="text-sm font-semibold text-slate-900 capitalize">
              {doubt.subject_id || 'Not assigned'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Teacher</p>
            <p className="text-sm font-semibold text-slate-900">
              {doubt.assigned_teacher_id ? doubt.assigned_teacher_id : 'Not assigned'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
        {messages.map((msg) => {
          const isMe = msg.sender_id === MOCK_USER.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'}`}
            >
              <div
                className={`px-4 py-3 rounded-xl ${
                  isMe ? 'bg-blue-600 text-white rounded-br-none shadow-md' : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text && <p className="whitespace-pre-wrap break-words text-sm">{msg.text}</p>}
                {msg.image_url && (
                  <img
                    src={msg.image_url}
                    alt="Attachment"
                    className="mt-2 max-w-full rounded-lg max-h-60 object-contain"
                  />
                )}
              </div>
              <span className={`text-xs mt-1 ${isMe ? 'text-slate-400' : 'text-slate-500'}`}>
                {formatDistanceToNow(new Date(msg.created_at))} ago
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 rounded-b-lg border-t border-slate-200 shadow-sm">
        {file && (
          <div className="mb-2 flex items-center text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded">
            <ImageIcon className="w-4 h-4 mr-2" />
            {file.name}
            <button
              onClick={() => setFile(null)}
              className="ml-auto text-red-500 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <label className="cursor-pointer p-2 text-slate-500 hover:text-blue-600 transition">
            <ImageIcon className="w-5 h-5" />
            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              className="hidden"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          />
          <button
            type="submit"
            disabled={sending || (!newMessage.trim() && !file)}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
