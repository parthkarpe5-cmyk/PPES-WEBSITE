"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Layout,
  Type,
  CheckSquare,
  Code,
  AlertCircle,
  Loader2,
  Settings,
  ListPlus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

function AdminTestBuilderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [passingScore, setPassingScore] = useState('60');
  const [postTestMessage, setPostTestMessage] = useState('');
  const [isManualRelease, setIsManualRelease] = useState(true);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [fetchingTest, setFetchingTest] = useState(false);

  const BACKEND_URL = 'http://localhost:5000/api/tests';

  // Fetch test details if in edit mode
  useEffect(() => {
    if (editId) {
      const fetchTestDetails = async () => {
        setFetchingTest(true);
        try {
          const res = await fetch(`${BACKEND_URL}/${editId}?includeAnswers=true`);
          if (res.ok) {
            const data = await res.json();
            setTitle(data.title || '');
            setDescription(data.description || '');
            setDuration(String(data.durationMinutes || '30'));
            setPassingScore(String(data.passingScore || '60'));
            setPostTestMessage(data.postTestMessage || '');
            setIsManualRelease(data.isManualRelease !== false);
            
            // Map Mongoose _id to our local id structure
            if (data.questions && Array.isArray(data.questions)) {
              const mappedQuestions = data.questions.map((q: any) => ({
                id: q._id || q.id || Date.now().toString() + Math.random().toString(),
                type: q.type as QuestionType,
                text: q.text || '',
                points: q.points || 5,
                options: q.options || [],
                correctAnswer: q.correctAnswer
              }));
              setQuestions(mappedQuestions);
            }
            toast.success("Assessment details loaded");
          } else {
            toast.error("Failed to load test details");
          }
        } catch (err) {
          console.error("Error loading test:", err);
          toast.error("Could not fetch test details");
        } finally {
          setFetchingTest(false);
        }
      };

      fetchTestDetails();
    }
  }, [editId]);

  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString() + Math.random().toString(),
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
    
    // Check if MCQ and Multiple Select questions have at least one correct answer
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.type === 'MCQ' && !q.correctAnswer) {
        toast.error(`Question ${i + 1} (MCQ) is missing a correct answer choice.`);
        return;
      }
      if (q.type === 'MULTIPLE_SELECT') {
        const answers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
        if (answers.length === 0) {
          toast.error(`Question ${i + 1} (Multi-Select) requires at least one checked answer.`);
          return;
        }
      }
    }

    try {
      const payload = {
        title,
        description,
        durationMinutes: parseInt(duration) || 30,
        passingScore: parseInt(passingScore) || 60,
        postTestMessage,
        isManualRelease,
        questions: questions.map(q => {
          const cleaned: any = {
            type: q.type,
            text: q.text,
            points: q.points,
          };
          if (q.type === 'MCQ' || q.type === 'MULTIPLE_SELECT') {
            cleaned.options = q.options;
            cleaned.correctAnswer = q.correctAnswer;
          }
          return cleaned;
        })
      };

      const url = editId ? `${BACKEND_URL}/${editId}` : BACKEND_URL;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Backend error:", errData);
        throw new Error(errData.error || 'Failed to save test');
      }

      toast.success(editId ? "Test updated successfully!" : "Test published successfully!");
      router.push('/admin/tests');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save test. Please try again.");
    }
  };

  if (fetchingTest) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-background min-h-screen text-foreground space-y-4">
        <Loader2 className="h-8 w-8 text-[#2FA8CC] animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading Test Schema...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-10 bg-background min-h-screen text-foreground animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-6 md:p-8 shadow-2xl border border-border">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2FA8CC]/10 text-[#2FA8CC] text-[10px] font-bold uppercase tracking-widest border border-[#2FA8CC]/20">
              {editId ? 'Admin Desk (Edit Mode)' : 'Admin Desk'}
            </span>
            <h1 className="text-3xl font-black tracking-tight text-foreground mt-2 font-display">
              {editId ? 'Edit' : 'Create'} <span className="text-[#2FA8CC]">Assessment</span>
            </h1>
            <p className="text-muted-foreground text-xs mt-1">Total points in draft: <span className="text-[#FF6B00] font-bold">{totalPoints}</span></p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => router.push('/admin/tests')}
              variant="outline" 
              className="border-border hover:bg-white/5 text-muted-foreground rounded-xl h-11"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-[#2FA8CC] hover:bg-[#2FA8CC]/80 text-white font-bold uppercase tracking-widest rounded-xl h-11 px-6 shadow-lg shadow-[#2FA8CC]/20"
            >
              <Save className="h-4 w-4 mr-2" />
              {editId ? 'Update Test' : 'Publish Test'}
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2FA8CC]/5 blur-[100px] rounded-full" />
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Test configurations */}
        <div className="lg:col-span-1 space-y-6 animate-in slide-in-from-left duration-300">
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#2FA8CC]" />
            Test Configurations
          </h2>
          
          <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Test Title</label>
              <input 
                required 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Advanced System Architecture"
                className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm text-foreground focus:outline-none focus:border-[#2FA8CC] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Description</label>
              <textarea 
                required 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Details about standard parameters, target course, or scoring rubrics..."
                className="w-full min-h-[100px] bg-card border border-border rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-[#2FA8CC] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Duration (Min)</label>
                <input 
                  type="number"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm text-foreground focus:outline-none focus:border-[#2FA8CC] transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Passing Mark (%)</label>
                <input 
                  type="number"
                  value={passingScore}
                  onChange={e => setPassingScore(e.target.value)}
                  className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm text-foreground focus:outline-none focus:border-[#2FA8CC] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-border rounded-2xl">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-foreground block">Manual Review Required</label>
                <span className="text-[10px] text-slate-500 block leading-tight">Hide grades until admin validation</span>
              </div>
              <Switch 
                checked={isManualRelease}
                onCheckedChange={setIsManualRelease}
                className="data-[state=checked]:bg-[#2FA8CC]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Post-Test Message</label>
              <input 
                value={postTestMessage}
                onChange={e => setPostTestMessage(e.target.value)}
                placeholder="e.g. Assessment successfully logged to the administrative desk."
                className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm text-foreground focus:outline-none focus:border-[#2FA8CC] transition-all"
              />
            </div>
          </div>

          {/* Quick tools menu for questions */}
          <div className="bg-[#2FA8CC]/5 rounded-2xl p-6 border border-[#2FA8CC]/10 space-y-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Question Types</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => addQuestion('MCQ')}
                className="bg-card border border-border text-foreground hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
              >
                <Layout className="h-4 w-4 text-[#2FA8CC]" />
                + MCQ
              </Button>
              <Button 
                onClick={() => addQuestion('MULTIPLE_SELECT')}
                className="bg-card border border-border text-foreground hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
              >
                <CheckSquare className="h-4 w-4 text-[#2FA8CC]" />
                + Multi-Sel
              </Button>
              <Button 
                onClick={() => addQuestion('DESCRIPTIVE')}
                className="bg-card border border-border text-foreground hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
              >
                <Type className="h-4 w-4 text-[#2FA8CC]" />
                + Descr
              </Button>
              <Button 
                onClick={() => addQuestion('CODING')}
                className="bg-card border border-border text-foreground hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
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
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <ListPlus className="h-5 w-5 text-[#2FA8CC]" />
              Question Catalog ({questions.length})
            </h2>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border rounded-3xl backdrop-blur-md">
              <AlertCircle className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Empty Draft</p>
              <p className="text-slate-500 text-xs mt-1">Configure individual questions using the sidebar toolbox.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div 
                  key={q.id} 
                  className="bg-card border border-border rounded-[2.5rem] p-6 backdrop-blur-md hover:border-[#2FA8CC]/30 transition-all shadow-xl relative overflow-hidden group"
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
                      <div className="flex items-center border border-border bg-card rounded-xl px-2 h-9">
                        <span className="text-[9px] font-black text-[#2FA8CC]/70 mr-1.5 uppercase tracking-wider">Pts:</span>
                        <input 
                          type="number" 
                          className="w-8 h-6 bg-transparent outline-none text-center font-bold text-xs text-foreground"
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
                      placeholder="Enter question prompt..."
                      className="w-full bg-card border border-border rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:border-[#2FA8CC] transition-all resize-y min-h-[70px]"
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
                                  : 'border-border bg-white/[0.01] hover:border-white/10'
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
                                className="bg-transparent border-none outline-none text-xs text-foreground placeholder-slate-500 w-full focus:ring-0"
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

export default function CreateTestAdmin() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-20 bg-background min-h-screen text-foreground space-y-4">
        <Loader2 className="h-8 w-8 text-[#2FA8CC] animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest font-mono">Baking Dashboard...</p>
      </div>
    }>
      <AdminTestBuilderForm />
    </Suspense>
  );
}
