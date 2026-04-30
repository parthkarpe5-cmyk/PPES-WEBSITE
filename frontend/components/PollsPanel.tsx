'use client';

import { useState } from 'react';
import { BarChart2, Plus, Trash2, Send } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: number[];
  isActive: boolean;
}

export const PollsPanel = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']);

  const addOption = () => setNewOptions([...newOptions, '']);
  const removeOption = (index: number) => setNewOptions(newOptions.filter((_, i) => i !== index));

  const createPoll = () => {
    if (!newQuestion || newOptions.some(o => !o)) return;
    const poll: Poll = {
      id: Math.random().toString(36).substr(2, 9),
      question: newQuestion,
      options: newOptions,
      votes: new Array(newOptions.length).fill(0),
      isActive: true
    };
    setPolls([poll, ...polls]);
    setIsCreating(false);
    setNewQuestion('');
    setNewOptions(['', '']);
  };

  return (
    <div className="flex flex-col h-full bg-[#0D121F]/95 backdrop-blur-3xl text-white">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-bold text-lg flex items-center gap-3">
          <div className="p-2 rounded-xl bg-saffron/10 text-saffron">
            <BarChart2 size={18} />
          </div>
          Live Polls
        </h3>
        {!isCreating && (
          <Button 
            onClick={() => setIsCreating(true)}
            size="sm" 
            className="bg-sky hover:bg-sky/80 text-white rounded-full px-4 h-8"
          >
            <Plus size={16} className="mr-1" /> Create
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {isCreating ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-4"
            >
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Question</label>
                <input 
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="What is your question?"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky/50 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Options</label>
                {newOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      value={option}
                      onChange={(e) => {
                        const next = [...newOptions];
                        next[index] = e.target.value;
                        setNewOptions(next);
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-sky/50 transition-colors"
                    />
                    {newOptions.length > 2 && (
                      <button onClick={() => removeOption(index)} className="text-slate-500 hover:text-red-400 p-2">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  onClick={addOption}
                  className="text-[10px] font-bold text-sky hover:text-sky/80 uppercase tracking-widest flex items-center gap-1 p-2"
                >
                  <Plus size={12} /> Add Option
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setIsCreating(false)} className="flex-1 text-slate-400 hover:text-white hover:bg-white/5">Cancel</Button>
                <Button onClick={createPoll} className="flex-1 bg-sky hover:bg-sky/80">Launch Poll</Button>
              </div>
            </motion.div>
          ) : polls.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <BarChart2 size={48} strokeWidth={1} className="mb-4" />
              <p className="text-sm font-medium">No active polls</p>
              <p className="text-xs mt-1">Create a poll to engage your students</p>
            </div>
          ) : (
            polls.map((poll) => (
              <motion.div 
                key={poll.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">32 Votes</span>
                </div>
                <h4 className="font-bold text-base mb-4 leading-tight">{poll.question}</h4>
                <div className="space-y-3">
                  {poll.options.map((option, idx) => {
                    const percentage = 30 + (idx * 15); // Mock data
                    return (
                      <div key={idx} className="relative group cursor-pointer">
                        <div className="flex justify-between text-xs mb-1.5 px-1">
                          <span className="font-medium group-hover:text-sky transition-colors">{option}</span>
                          <span className="text-slate-500 font-bold">{percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="h-full bg-sky"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="ghost" className="w-full mt-6 text-[10px] font-bold text-red-400 hover:text-red-500 hover:bg-red-500/5 uppercase tracking-[0.2em] h-8 border border-red-500/10">
                  End Poll
                </Button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
