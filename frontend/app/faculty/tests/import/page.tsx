"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  HelpCircle, 
  Download, 
  Loader2,
  Edit2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Question {
  id: string;
  type: 'MCQ' | 'MULTIPLE_SELECT' | 'DESCRIPTIVE' | 'CODING';
  text: string;
  points: number;
  options: string[];
  correctAnswer: string | string[];
}

export default function BulkTestImportPage() {
  const router = useRouter();
  
  // View states: 'upload' or 'preview'
  const [viewState, setViewState] = useState<'upload' | 'preview'>('upload');
  
  // Test configurations
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [passingScore, setPassingScore] = useState('60');
  const [postTestMessage, setPostTestMessage] = useState('');
  const [isManualRelease, setIsManualRelease] = useState(true);
  
  // Questions list
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Parsing states
  const [parsing, setParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Template instruction tab state: 'csv' | 'txt' | 'docx'
  const [templateTab, setTemplateTab] = useState<'csv' | 'txt' | 'docx'>('csv');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const BACKEND_URL = 'http://localhost:5000/api/tests';

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Upload file to Backend Parser
  const handleFileUpload = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'txt', 'docx'].includes(ext || '')) {
      toast.error("Invalid file format. Please upload CSV, TXT, or DOCX files.");
      return;
    }

    setParsing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${BACKEND_URL}/import`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        // Safely parse error — server may return HTML on unexpected errors
        let errorMsg = 'Failed to parse file';
        try {
          const errData = await res.json();
          errorMsg = errData.error || errorMsg;
        } catch {
          const raw = await res.text().catch(() => '');
          if (raw && !raw.startsWith('<!')) errorMsg = raw;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();

      // Ensure each question has a local unique ID
      const mappedQuestions = (data.questions || []).map((q: any) => ({
        id: q._id || q.id || (Date.now() + Math.random()).toString(),
        type: q.type,
        text: q.text || '',
        points: q.points || 5,
        options: q.options || ['', '', '', ''],
        correctAnswer: q.correctAnswer || (q.type === 'MULTIPLE_SELECT' ? [] : '')
      }));

      // Batch state updates first, then defer toast to avoid setState-in-render
      setTitle(data.title || '');
      setDescription(data.description || '');
      setQuestions(mappedQuestions);
      setViewState('preview');
      setTimeout(() => toast.success("File parsed! Review & edit before publishing."), 0);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to parse the file. Verify its structure.");
    } finally {
      setParsing(false);
    }
  };

  // Question validation rules
  const validateQuestion = (q: Question) => {
    const errors: string[] = [];
    if (!q.text || q.text.trim() === '') {
      errors.push('Question text cannot be empty.');
    }
    if (q.points <= 0) {
      errors.push('Points must be a positive number.');
    }

    if (q.type === 'MCQ' || q.type === 'MULTIPLE_SELECT') {
      const emptyCount = q.options.filter(o => !o || o.trim() === '').length;
      if (emptyCount > 0) {
        errors.push('All 4 options must be non-empty.');
      }

      if (q.type === 'MCQ') {
        if (!q.correctAnswer || (typeof q.correctAnswer === 'string' && q.correctAnswer.trim() === '')) {
          errors.push('Select a correct answer choice.');
        } else if (!q.options.includes(q.correctAnswer as string)) {
          errors.push('Correct answer must match one of the option texts.');
        }
      } else {
        // MULTIPLE_SELECT
        const correctAnswers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
        if (correctAnswers.length === 0) {
          errors.push('Select at least one correct answer.');
        } else {
          const invalidAnswers = correctAnswers.filter(ans => !q.options.includes(ans));
          if (invalidAnswers.length > 0) {
            errors.push('All selected correct answers must match option texts.');
          }
        }
      }
    }
    return errors;
  };

  // Get total errors across all draft questions
  const totalErrors = questions.reduce((acc, q) => acc + validateQuestion(q).length, 0);

  // Edit / update single question details
  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } as Question : q));
  };

  // Update option values in MCQs/Multi-selects
  const updateOption = (qId: string, optIndex: number, val: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const oldVal = q.options[optIndex];
        const newOptions = [...q.options];
        newOptions[optIndex] = val;

        let newCorrect = q.correctAnswer;
        if (q.type === 'MCQ' && q.correctAnswer === oldVal) {
          newCorrect = val;
        } else if (q.type === 'MULTIPLE_SELECT' && Array.isArray(q.correctAnswer)) {
          newCorrect = q.correctAnswer.map(v => v === oldVal ? val : v);
        }

        return {
          ...q,
          options: newOptions,
          correctAnswer: newCorrect
        };
      }
      return q;
    }));
  };

  // Toggle option checkmark state for MCQ or MULTIPLE_SELECT
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

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.info("Question deleted from draft");
  };

  const addQuestion = (type: 'MCQ' | 'MULTIPLE_SELECT' | 'DESCRIPTIVE' | 'CODING') => {
    const newQ: Question = {
      id: Date.now().toString() + Math.random().toString(),
      type,
      text: '',
      points: 5,
      options: type === 'MCQ' || type === 'MULTIPLE_SELECT' ? ['', '', '', ''] : [],
      correctAnswer: type === 'MULTIPLE_SELECT' ? [] : ''
    };
    setQuestions([...questions, newQ]);
    toast.success(`Added ${type} question`);
  };

  // Submit and Publish the finalized test
  const handlePublish = async () => {
    if (!title || title.trim() === '') {
      toast.error("Test Title is required.");
      return;
    }
    if (questions.length === 0) {
      toast.error("Please add at least one question.");
      return;
    }

    if (totalErrors > 0) {
      toast.error(`Please resolve the ${totalErrors} validation error(s) before publishing.`);
      return;
    }

    try {
      const payload = {
        title,
        description,
        durationMinutes: parseInt(duration, 10) || 30,
        passingScore: parseInt(passingScore, 10) || 60,
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

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save test');
      }

      toast.success("Bulk test imported and published successfully!");
      router.push('/faculty/tests');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to publish test. Please try again.");
    }
  };

  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

  return (
    <div className="p-6 lg:p-8 space-y-10 bg-[#050B14] min-h-screen text-foreground animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-6 md:p-8 shadow-2xl border border-border">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2FA8CC]/10 text-[#2FA8CC] text-[10px] font-bold uppercase tracking-widest border border-[#2FA8CC]/20">
              Curriculum Management
            </span>
            <h1 className="text-3xl font-black tracking-tight text-foreground mt-2 font-display">
              Bulk Import <span className="text-[#2FA8CC]">Assessments</span>
            </h1>
            <p className="text-muted-foreground text-xs mt-1">
              {viewState === 'upload' 
                ? 'Upload CSV, TXT, or Word Documents to generate assessments automatically.'
                : `Previewing draft with ${questions.length} questions (Total points: ${totalPoints})`}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => {
                if (viewState === 'preview' && !confirm('Discard imported draft and go back?')) return;
                router.push('/faculty/tests');
              }}
              variant="outline" 
              className="border-border hover:bg-white/5 text-muted-foreground rounded-xl h-11"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            {viewState === 'preview' && (
              <Button 
                onClick={handlePublish}
                disabled={totalErrors > 0}
                className={`text-white font-bold uppercase tracking-widest rounded-xl h-11 px-6 shadow-lg transition-all ${
                  totalErrors > 0 
                    ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                    : 'bg-[#FF6B00] hover:bg-[#FF6B00]/80 shadow-[#FF6B00]/20'
                }`}
              >
                <Save className="h-4 w-4 mr-2" />
                Publish Test
              </Button>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2FA8CC]/5 blur-[100px] rounded-full" />
      </section>

      {/* Main Content Area */}
      {viewState === 'upload' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* File Upload Zone */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-foreground tracking-tight">Upload Assessment File</h2>
            
            <form 
              onDragEnter={handleDrag} 
              onSubmit={(e) => e.preventDefault()}
              className="relative"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                multiple={false}
                accept=".csv,.txt,.docx"
                onChange={handleFileChange}
              />
              
              <div 
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
                className={`flex flex-col items-center justify-center p-12 rounded-[2.5rem] border-2 border-dashed transition-all duration-300 cursor-pointer min-h-[300px] relative overflow-hidden group ${
                  dragActive 
                    ? 'border-[#FF6B00] bg-[#FF6B00]/5 shadow-[0_0_30px_rgba(255,107,0,0.1)]' 
                    : 'border-border bg-card hover:border-[#2FA8CC]/40 hover:bg-white/[0.04]'
                }`}
              >
                {parsing ? (
                  <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 text-[#2FA8CC] animate-spin mx-auto" />
                    <p className="text-[#2FA8CC] text-sm font-bold uppercase tracking-wider">Parsing Document...</p>
                    <p className="text-slate-500 text-xs">Extracting questions, answers, and points...</p>
                  </div>
                ) : (
                  <div className="text-center space-y-4 z-10">
                    <div className="h-16 w-16 bg-[#2FA8CC]/10 text-[#2FA8CC] border border-[#2FA8CC]/20 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110 duration-300">
                      <Upload className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-foreground font-bold text-lg">Drag & Drop your file here</p>
                      <p className="text-muted-foreground text-xs mt-1">or click to browse from folders</p>
                    </div>
                    <Badge variant="outline" className="bg-card border-border text-muted-foreground text-[10px] px-3 py-1 font-bold">
                      Supports: CSV, TXT, DOCX (Max 5MB)
                    </Badge>
                  </div>
                )}
                {/* Visual Glows */}
                <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-[#2FA8CC]/5 blur-3xl rounded-full opacity-50" />
                <div className="absolute -left-10 -top-10 h-32 w-32 bg-[#FF6B00]/5 blur-3xl rounded-full opacity-50" />
              </div>
            </form>
          </div>

          {/* Guidelines & Templates Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Format Guidelines</h2>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
              
              {/* Tab Selector */}
              <div className="grid grid-cols-3 gap-1 bg-card p-1 rounded-xl">
                {(['csv', 'txt', 'docx'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTemplateTab(tab)}
                    className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      templateTab === tab 
                        ? 'bg-[#2FA8CC] text-white shadow-md' 
                        : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Guidelines Body */}
              <div className="space-y-4 min-h-[220px]">
                {templateTab === 'csv' && (
                  <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                    <p>Format your CSV with the following exact columns:</p>
                    <code className="block bg-black/40 p-3 rounded-lg text-muted-foreground font-mono text-[10px] whitespace-nowrap overflow-x-auto border border-border">
                      Type,Question Text,Points,Option A,Option B,Option C,Option D,Correct Answer
                    </code>
                    <ul className="list-disc pl-4 space-y-1.5">
                      <li><strong>Type</strong>: Must be MCQ, MULTIPLE_SELECT, DESCRIPTIVE, or CODING.</li>
                      <li><strong>Options</strong>: Exactly 4 option fields must be provided for MCQ/Multi-select.</li>
                      <li><strong>Correct Answer</strong>: Specify either the option letter (e.g. <code>A</code>, <code>B</code>) or the exact option text. For Multi-select, separate with <code>|</code> (e.g. <code>A|C</code>).</li>
                    </ul>
                  </div>
                )}

                {templateTab === 'txt' && (
                  <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                    <p>TXT files should block questions separated by blank lines:</p>
                    <pre className="block bg-black/40 p-3 rounded-lg text-muted-foreground font-mono text-[10px] overflow-x-auto max-h-[160px] border border-border">
{`Question 1
Type: MCQ
Points: 5
Text: What is the capital of France?
Options:
- Paris
- London
- Berlin
- Rome
Correct Answer: Paris`}
                    </pre>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Use <code>Type: MULTIPLE_SELECT</code> for multi-choice.</li>
                      <li>For Multi-select, correct answers can be separated by <code>|</code> (e.g. <code>Paris|Berlin</code>).</li>
                    </ul>
                  </div>
                )}

                {templateTab === 'docx' && (
                  <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                    <p>DOCX format follows the exact same paragraph structures as the TXT format. Make sure questions are cleanly separated by a blank line.</p>
                    <p>The parser will extract all text paragraphs in Word and parse them block-by-block.</p>
                  </div>
                )}
              </div>

              {/* Template Download Buttons */}
              <div className="border-t border-border pt-4">
                <a 
                  href={`/templates/template.${templateTab}`} 
                  download={`template.${templateTab}`}
                  className="w-full h-11 bg-card hover:bg-white/10 text-foreground font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-border flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="h-4 w-4 text-[#FF6B00]" />
                  Download {templateTab.toUpperCase()} Template
                </a>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Draft Preview and Editor View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Metadata & Summary Configs */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-lg font-bold text-foreground tracking-tight">Test Details</h2>
            
            <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-5">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Test Title</label>
                <input 
                  required 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Assessment"
                  className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm text-foreground focus:outline-none focus:border-[#2FA8CC] transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  required 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Assessment instructions..."
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
                  <label className="text-xs font-bold text-foreground block">Manual Release</label>
                  <span className="text-[10px] text-slate-500 block leading-tight">Hide scores until review</span>
                </div>
                <Switch 
                  checked={isManualRelease}
                  onCheckedChange={setIsManualRelease}
                  className="data-[state=checked]:bg-[#FF6B00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Post-Test Message</label>
                <input 
                  value={postTestMessage}
                  onChange={e => setPostTestMessage(e.target.value)}
                  placeholder="e.g. Well done! Results will follow soon."
                  className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm text-foreground focus:outline-none focus:border-[#2FA8CC] transition-all"
                />
              </div>
            </div>

            {/* Validation Banner Summary */}
            <div className={`p-5 rounded-2xl border transition-all ${
              totalErrors > 0 
                ? 'bg-red-500/10 border-red-500/20 text-red-200' 
                : 'bg-green-500/10 border-green-500/20 text-green-200'
            }`}>
              <div className="flex items-center gap-3">
                {totalErrors > 0 ? (
                  <XCircle className="h-6 w-6 text-red-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">
                    {totalErrors > 0 ? 'Validation Blocks' : 'All Clear'}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {totalErrors > 0 
                      ? `There are ${totalErrors} active formatting issues. Correct them to enable publishing.`
                      : 'No issues found! The draft is valid and ready to publish.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Add Custom Question Toolbar */}
            <div className="bg-[#2FA8CC]/5 rounded-2xl p-6 border border-[#2FA8CC]/10 space-y-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Add More Questions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => addQuestion('MCQ')}
                  className="bg-card border border-border text-foreground hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
                >
                  + MCQ
                </Button>
                <Button 
                  onClick={() => addQuestion('MULTIPLE_SELECT')}
                  className="bg-card border border-border text-foreground hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
                >
                  + Multi-Sel
                </Button>
                <Button 
                  onClick={() => addQuestion('DESCRIPTIVE')}
                  className="bg-card border border-border text-foreground hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
                >
                  + Descr
                </Button>
                <Button 
                  onClick={() => addQuestion('CODING')}
                  className="bg-card border border-border text-foreground hover:bg-[#2FA8CC]/10 hover:border-[#2FA8CC]/30 rounded-xl text-xs flex gap-2 h-10 font-bold"
                >
                  + Coding
                </Button>
              </div>
            </div>

          </div>

          {/* Right Column: Questions Preview and Interactive Edit Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Question Catalog ({questions.length})</h2>
              <button 
                onClick={() => {
                  if(confirm("Are you sure you want to reset? You will lose this draft.")) {
                    setViewState('upload');
                    setQuestions([]);
                  }
                }}
                className="text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-wider hover:underline"
              >
                Clear Import
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((q, index) => {
                const errors = validateQuestion(q);
                const isMCQ = q.type === 'MCQ';
                const isMS = q.type === 'MULTIPLE_SELECT';

                return (
                  <div 
                    key={q.id} 
                    className={`bg-card border rounded-[2.5rem] p-6 backdrop-blur-xl shadow-xl relative overflow-hidden group transition-all duration-300 ${
                      errors.length > 0 
                        ? 'border-red-500/20 hover:border-red-500/40' 
                        : 'border-border hover:border-[#2FA8CC]/20'
                    }`}
                  >
                    
                    {/* Error Banner inside individual card */}
                    {errors.length > 0 && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-2 text-red-400 text-xs">
                        <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="font-bold block uppercase tracking-wider text-[10px]">Import Validation Error</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-red-300/90 font-medium">
                            {errors.map((err, eIdx) => (
                              <li key={eIdx}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Question Card Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border ${
                          errors.length > 0 
                            ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                            : 'bg-[#2FA8CC]/10 border-[#2FA8CC]/20 text-[#2FA8CC]'
                        }`}>
                          {index + 1}
                        </div>

                        {/* Select type drop down */}
                        <select 
                          value={q.type}
                          onChange={(e) => {
                            const newType = e.target.value as any;
                            const emptyOptions = newType === 'MCQ' || newType === 'MULTIPLE_SELECT' 
                              ? (q.options?.length === 4 ? q.options : ['', '', '', '']) 
                              : [];
                            updateQuestion(q.id, { 
                              type: newType, 
                              options: emptyOptions,
                              correctAnswer: newType === 'MULTIPLE_SELECT' ? [] : ''
                            });
                          }}
                          className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-[#2FA8CC] transition-all font-bold uppercase tracking-wider"
                        >
                          <option value="MCQ" className="bg-[#050B14]">MCQ</option>
                          <option value="MULTIPLE_SELECT" className="bg-[#050B14]">Multi-Select</option>
                          <option value="DESCRIPTIVE" className="bg-[#050B14]">Descriptive</option>
                          <option value="CODING" className="bg-[#050B14]">Coding</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-border bg-card rounded-xl px-2 h-9">
                          <span className="text-[9px] font-black text-[#2FA8CC]/70 mr-1.5 uppercase tracking-wider">Pts:</span>
                          <input 
                            type="number" 
                            className="w-8 h-6 bg-transparent outline-none text-center font-bold text-xs text-foreground"
                            value={q.points}
                            onChange={(e) => updateQuestion(q.id, { points: parseInt(e.target.value, 10) || 0 })}
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

                    {/* Question Text Textarea */}
                    <div className="space-y-4">
                      <textarea 
                        placeholder="Type question content here..."
                        className="w-full bg-card border border-border rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:border-[#2FA8CC] transition-all resize-y min-h-[70px]"
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                      />
                      
                      {/* MCQ / MULTIPLE_SELECT Options Grid (Strictly 4) */}
                      {(isMCQ || isMS) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = isMCQ 
                              ? q.correctAnswer === opt && opt !== ''
                              : Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt) && opt !== '';
                              
                            return (
                              <div 
                                key={oIdx} 
                                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                                  isCorrect 
                                    ? 'border-[#FF6B00] bg-[#FF6B00]/10 shadow-[0_0_15px_rgba(255,107,0,0.15)]' 
                                    : 'border-border bg-white/[0.01] hover:border-white/10'
                                }`}
                              >
                                <input 
                                  type={isMCQ ? "radio" : "checkbox"}
                                  name={`correct-${q.id}`}
                                  checked={isCorrect}
                                  onChange={() => toggleCorrectAnswer(q.id, opt, isMS)}
                                  className="h-4 w-4 accent-[#FF6B00] cursor-pointer"
                                />
                                <input 
                                  type="text"
                                  placeholder={`Option ${['A', 'B', 'C', 'D'][oIdx]}`}
                                  value={opt}
                                  onChange={(e) => updateOption(q.id, oIdx, e.target.value)}
                                  className="bg-transparent border-none outline-none text-xs text-foreground placeholder-slate-500 w-full focus:ring-0"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Descriptive/Coding Answer Key Placeholder */}
                      {(q.type === 'DESCRIPTIVE' || q.type === 'CODING') && (
                        <div className="space-y-1.5 mt-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Reference Model Answer (Optional)</label>
                          <textarea 
                            placeholder="Provide reference guidelines or code solution here..."
                            className="w-full bg-card border border-border rounded-2xl p-4 text-xs text-muted-foreground focus:outline-none focus:border-[#2FA8CC] transition-all resize-y min-h-[60px]"
                            value={typeof q.correctAnswer === 'string' ? q.correctAnswer : ''}
                            onChange={(e) => updateQuestion(q.id, { correctAnswer: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Decorative colored glow strip */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-opacity ${
                      errors.length > 0 
                        ? 'bg-red-500 opacity-80' 
                        : 'bg-[#2FA8CC] opacity-30 group-hover:opacity-100'
                    }`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
