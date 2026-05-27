"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Layout,
  Type,
  CheckSquare,
  Code,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type QuestionType = 'MCQ' | 'MULTIPLE_SELECT' | 'DESCRIPTIVE' | 'CODING';

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  options?: string[];
  correctAnswer?: string | string[];
}

export default function CreateTestFaculty() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [passingScore, setPassingScore] = useState('60');
  const [postTestMessage, setPostTestMessage] = useState('');
  const [isManualRelease, setIsManualRelease] = useState(true);
  
  const [questions, setQuestions] = useState<Question[]>([]);

  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      text: '',
      points: 5,
      options: type === 'MCQ' || type === 'MULTIPLE_SELECT' ? ['', '', '', ''] : [],
      correctAnswer: type === 'MCQ' ? '' : []
    };
    setQuestions([...questions, newQuestion]);
    toast.success(`Added ${type.replace('_', ' ')} question`);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const updateOption = (qId: string, optIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options) {
        const newOptions = [...q.options];
        const oldVal = newOptions[optIndex];
        newOptions[optIndex] = value;
        
        let newCorrectAnswer = q.correctAnswer;
        if (q.type === 'MCQ' && q.correctAnswer === oldVal) {
          newCorrectAnswer = value;
        } else if (q.type === 'MULTIPLE_SELECT' && Array.isArray(q.correctAnswer)) {
          newCorrectAnswer = q.correctAnswer.map(v => v === oldVal ? value : v);
        }

        return { ...q, options: newOptions, correctAnswer: newCorrectAnswer };
      }
      return q;
    }));
  };

  const toggleCorrectAnswer = (qId: string, optionValue: string, isMulti: boolean) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        if (isMulti) {
          const currentArr = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
          if (currentArr.includes(optionValue)) {
            return { ...q, correctAnswer: currentArr.filter(v => v !== optionValue) };
          } else {
            return { ...q, correctAnswer: [...currentArr, optionValue] };
          }
        } else {
          return { ...q, correctAnswer: optionValue };
        }
      }
      return q;
    }));
  };

  const handleSave = async () => {
    if (!title || !description || questions.length === 0) {
      toast.error("Please fill in the title, description, and add at least one question.");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          durationMinutes: parseInt(duration),
          passingScore: parseInt(passingScore),
          postTestMessage,
          isManualRelease,
          questions
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Backend error:", errData);
        throw new Error(errData.error || 'Failed to create test');
      }

      toast.success("Test published successfully!");
      router.push('/faculty/tests');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to publish test. Please try again.");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-10 bg-[#050B14] min-h-screen text-slate-200 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-6 md:p-8 shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2FA8CC]/10 text-[#2FA8CC] text-[10px] font-bold uppercase tracking-widest border border-[#2FA8CC]/20">
              Curriculum Management
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white mt-2 font-display">
              Create <span className="text-[#2FA8CC]">Assessment</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1">Total points in draft: <span className="text-[#FF6B00] font-bold">{totalPoints}</span></p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => router.back()}
              variant="outline" 
              className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl h-11"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/80 text-white font-bold uppercase tracking-widest rounded-xl h-11 px-6 shadow-lg shadow-[#FF6B00]/20"
            >
              <Save className="h-4 w-4 mr-2" />
              Publish Test
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2FA8CC]/5 blur-[100px] rounded-full" />
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Test configurations */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-lg font-bold text-white tracking-tight">Test Configurations</h2>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Test Title</label>
              <input 
                required 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Mid-Term Physics Exam"
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <textarea 
                required 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Details about syllabus covered..."
                className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duration (Min)</label>
                <input 
                  type="number"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Passing Mark (%)</label>
                <input 
                  type="number"
                  value={passingScore}
                  onChange={e => setPassingScore(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-white block">Manual Release</label>
                <span className="text-[10px] text-slate-500 block leading-tight">Hide scores until review</span>
              </div>
              <Switch 
                checked={isManualRelease}
                onCheckedChange={setIsManualRelease}
                className="data-[state=checked]:bg-[#FF6B00]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Post-Test Message</label>
              <input 
                value={postTestMessage}
                onChange={e => setPostTestMessage(e.target.value)}
                placeholder="e.g. Well done! Results will be visible soon."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] transition-all"
              />
            </div>
          </div>

          {/* Quick tools menu for questions */}
          <div className="bg-[#2FA8CC]/5 rounded-2xl p-6 border border-[#2FA8CC]/10 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Question Types</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => addQuestion('MCQ')}
                className="bg-white/5 border border-white/5 text-slate-200 hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
              >
                <Layout className="h-4 w-4 text-[#2FA8CC]" />
                + MCQ
              </Button>
              <Button 
                onClick={() => addQuestion('MULTIPLE_SELECT')}
                className="bg-white/5 border border-white/5 text-slate-200 hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
              >
                <CheckSquare className="h-4 w-4 text-[#2FA8CC]" />
                + Multi-Sel
              </Button>
              <Button 
                onClick={() => addQuestion('DESCRIPTIVE')}
                className="bg-white/5 border border-white/5 text-slate-200 hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
              >
                <Type className="h-4 w-4 text-[#2FA8CC]" />
                + Descr
              </Button>
              <Button 
                onClick={() => addQuestion('CODING')}
                className="bg-white/5 border border-white/5 text-slate-200 hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
              >
                <Code className="h-4 w-4 text-[#2FA8CC]" />
                + Coding
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Question List Builder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white tracking-tight">Question Catalog ({questions.length})</h2>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
              <AlertCircle className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Empty Draft</p>
              <p className="text-slate-500 text-xs mt-1">Add items using the Question Types toolbox on the left side.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div 
                  key={q.id} 
                  className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl hover:border-white/10 transition-colors shadow-xl relative overflow-hidden group"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#2FA8CC]/10 border border-[#2FA8CC]/20 text-[#2FA8CC] w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black">
                        {index + 1}
                      </div>
                      <Badge variant="outline" className="bg-[#2FA8CC]/10 text-[#2FA8CC] border-[#2FA8CC]/30 font-bold text-[9px] uppercase tracking-wider">
                        {q.type.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-white/10 bg-white/5 rounded-xl px-2 h-9">
                        <span className="text-[9px] font-black text-[#2FA8CC]/70 mr-1.5 uppercase tracking-wider">Pts:</span>
                        <input 
                          type="number" 
                          className="w-8 h-6 bg-transparent outline-none text-center font-bold text-xs text-white"
                          value={q.points}
                          onChange={(e) => updateQuestion(q.id, { points: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <button 
                        onClick={() => removeQuestion(q.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <textarea 
                      placeholder="Enter question text here..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] transition-all resize-y min-h-[70px]"
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                    />
                    
                    {/* MCQ and MULTIPLE_SELECT Options list */}
                    {(q.type === 'MCQ' || q.type === 'MULTIPLE_SELECT') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {q.options?.map((opt, i) => {
                          const isCorrect = q.type === 'MCQ'
                            ? q.correctAnswer === opt && opt !== ''
                            : Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt) && opt !== '';
                            
                          return (
                            <div 
                              key={i} 
                              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                                isCorrect 
                                  ? 'border-[#FF6B00] bg-[#FF6B00]/10 shadow-[0_0_15px_rgba(255,107,0,0.15)]' 
                                  : 'border-white/5 bg-white/[0.01] hover:border-white/10'
                              }`}
                            >
                              <input 
                                type="checkbox"
                                checked={isCorrect}
                                onChange={() => toggleCorrectAnswer(q.id, opt, q.type === 'MULTIPLE_SELECT')}
                                className="h-4 w-4 accent-[#FF6B00] cursor-pointer"
                              />
                              <input 
                                type="text"
                                placeholder={`Option ${i+1}`}
                                value={opt}
                                onChange={(e) => updateOption(q.id, i, e.target.value)}
                                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full focus:ring-0"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Glowing left side bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2FA8CC] opacity-30 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
