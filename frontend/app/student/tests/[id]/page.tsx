"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from '@/lib/utils'
import { getAuthHeaders } from '@/lib/api'

export default function TakeTest() {
  const router = useRouter()
  const { id } = useParams()
  
  const [test, setTest] = useState<any>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const headers = getAuthHeaders();
        const res = await fetch(`http://localhost:5000/api/tests/${id}`, {
          headers: headers as any
        });
        if (!res.ok) {
          toast.error("Test not found")
          router.push('/student')
          return
        }
        const data = await res.json();
        setTest(data);
        
        // Timer logic - check localStorage first
        const savedTime = localStorage.getItem(`test_timer_${id}`);
        if (savedTime) {
          setTimeLeft(parseInt(savedTime, 10));
        } else {
          const initialTime = data.durationMinutes * 60;
          setTimeLeft(initialTime);
          localStorage.setItem(`test_timer_${id}`, initialTime.toString());
        }
      } catch (error) {
        toast.error("Error loading test");
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id, router]);

  useEffect(() => {
    if (!test || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer)
          handleAutoSubmit()
          return 0
        }
        localStorage.setItem(`test_timer_${id}`, newTime.toString());
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [test])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleAutoSubmit = () => {
    toast.error("Time is up! Submitting your answers automatically.")
    submitTest()
  }

  const submitTest = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value
      }));

      const headers = getAuthHeaders();
      const res = await fetch(`http://localhost:5000/api/tests/${id}/attempt`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...headers
        } as any,
        body: JSON.stringify({ answers: formattedAnswers })
      });

      if (!res.ok) throw new Error('Failed to submit test');
      
      const data = await res.json();
      
      // Cleanup local storage
      localStorage.removeItem(`test_timer_${id}`);
      
      if (data.status === 'pending_review') {
        toast.success("Test submitted! Your answers are pending manual review.");
      } else {
        toast.success(`Test submitted successfully! You scored ${data.score}/${data.maxScore}.`);
      }
      
      router.push('/student')
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit test. Please try again.");
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-bold uppercase tracking-wider">Loading Assessment...</div>
  if (!test || !test.questions || test.questions.length === 0) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-bold uppercase tracking-wider">Invalid test format.</div>

  const currentQ = test.questions[currentIdx]
  const progress = ((currentIdx + 1) / test.questions.length) * 100

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-24 p-6 lg:p-10 animate-in fade-in duration-500">
      {/* Test Header Card */}
      <div className="max-w-4xl mx-auto bg-card backdrop-blur-md border border-border rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2FA8CC]/10 text-[#2FA8CC] text-[10px] font-bold uppercase tracking-widest border border-[#2FA8CC]/20">
            Assessment Session
          </span>
          <h1 className="text-2xl font-black text-foreground font-display leading-tight">{test.title}</h1>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span>Question {currentIdx + 1} of {test.questions.length}</span>
            <span>•</span>
            <span className="text-[#2FA8CC]">{Math.round(progress)}% Complete</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2.5 px-5 py-3 rounded-2xl font-black border transition-all duration-300 shadow-lg text-sm",
            timeLeft < 300 
              ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
              : "bg-[#2FA8CC]/10 border-[#2FA8CC]/20 text-[#2FA8CC] shadow-[0_0_15px_rgba(47,168,204,0.1)]"
          )}>
            <Clock className="h-4.5 w-4.5" />
            <span className="font-mono text-base tracking-widest">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>
      
      {/* Progress Line */}
      <div className="max-w-4xl mx-auto mb-8">
        <Progress value={progress} className="h-2 bg-card" />
      </div>

      <main className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-card border border-border rounded-[2.5rem] shadow-2xl backdrop-blur-xl overflow-hidden relative group">
          <CardHeader className="pb-8 border-b border-border bg-card p-8 md:p-10">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-[#2FA8CC]/10 border border-[#2FA8CC]/20 text-[#2FA8CC] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {currentQ.type.replace('_', ' ')}
              </span>
              <span className="text-xs font-bold text-[#2FA8CC]/70 uppercase tracking-widest">{currentQ.points} Points</span>
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold leading-relaxed text-foreground font-display">
              {currentQ.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 md:p-10">
            
            {/* MCQ Type */}
            {currentQ.type === 'MCQ' && (
              <RadioGroup 
                value={answers[currentQ._id]} 
                onValueChange={(val) => setAnswers({...answers, [currentQ._id]: val})}
                className="space-y-4"
              >
                {currentQ.options?.map((opt: string, i: number) => {
                  const isSelected = answers[currentQ._id] === opt;
                  return (
                    <div key={i} className="flex items-center space-x-3 group cursor-pointer">
                      <RadioGroupItem value={opt} id={`opt-${i}`} className="border-border text-[#2FA8CC] focus:ring-[#2FA8CC] bg-transparent" />
                      <Label 
                        htmlFor={`opt-${i}`} 
                        className={cn(
                          "text-base font-semibold cursor-pointer w-full p-4 rounded-2xl border transition-all duration-300",
                          isSelected 
                            ? "border-[#FF6B00] bg-[#FF6B00]/10 shadow-[0_0_15px_rgba(255,107,0,0.15)] text-white" 
                            : "border-slate-200  bg-slate-50  hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/10 text-slate-700 dark:text-slate-300"
                        )}
                      >
                        {opt}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            )}

            {/* MULTIPLE_SELECT Type */}
            {currentQ.type === 'MULTIPLE_SELECT' && (
              <div className="space-y-4">
                {currentQ.options?.map((opt: string, i: number) => {
                  const currentArr = Array.isArray(answers[currentQ._id]) ? answers[currentQ._id] : [];
                  const isChecked = currentArr.includes(opt);
                  
                  const handleCheckboxChange = (checked: boolean) => {
                    let newArr = [...currentArr];
                    if (checked) {
                      newArr.push(opt);
                    } else {
                      newArr = newArr.filter((v: string) => v !== opt);
                    }
                    setAnswers({...answers, [currentQ._id]: newArr});
                  };

                  return (
                    <div key={i} className="flex items-center space-x-3 group cursor-pointer">
                      <Checkbox 
                        id={`opt-${i}`} 
                        checked={isChecked} 
                        onCheckedChange={(checked) => handleCheckboxChange(!!checked)}
                        className="border-border text-[#2FA8CC] focus:ring-[#2FA8CC] bg-transparent data-[state=checked]:bg-[#2FA8CC] data-[state=checked]:border-[#2FA8CC]"
                      />
                      <Label 
                        htmlFor={`opt-${i}`} 
                        className={cn(
                          "text-base font-semibold cursor-pointer w-full p-4 rounded-2xl border transition-all duration-300",
                          isChecked 
                            ? "border-[#FF6B00] bg-[#FF6B00]/10 shadow-[0_0_15px_rgba(255,107,0,0.15)] text-white" 
                            : "border-slate-200  bg-slate-50  hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/10 text-slate-700 dark:text-slate-300"
                        )}
                      >
                        {opt}
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}

            {/* DESCRIPTIVE Type */}
            {currentQ.type === 'DESCRIPTIVE' && (
              <div className="space-y-4">
                <Textarea 
                  placeholder="Type your detailed answer here..."
                  className="min-h-[250px] text-base leading-relaxed p-6 bg-slate-50  border-slate-200  focus:border-[#2FA8CC] focus:ring-1 focus:ring-[#2FA8CC] text-foreground placeholder-slate-400 dark:placeholder-white/20 rounded-2xl focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={answers[currentQ._id] || ''}
                  onChange={(e) => setAnswers({...answers, [currentQ._id]: e.target.value})}
                />
                <div className="flex items-start gap-2 text-[#2FA8CC]/70">
                  <HelpCircle className="h-4 w-4 mt-0.5" />
                  <p className="text-xs italic">Your answer is automatically saved as you type.</p>
                </div>
              </div>
            )}

            {/* CODING Type */}
            {currentQ.type === 'CODING' && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-[#050B14] rounded-2xl border border-slate-200  overflow-hidden font-mono text-sm shadow-2xl">
                  <div className="bg-slate-100  px-5 py-3 border-b border-slate-200  flex items-center justify-between text-xs text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest">
                    <span>solution.py</span>
                    <span className="text-[#2FA8CC]">Python 3</span>
                  </div>
                  <textarea 
                    placeholder="# Write your programming code solution here..."
                    className="w-full min-h-[300px] p-6 bg-transparent text-foreground font-mono placeholder-slate-400 dark:placeholder-white/20 border-none outline-none focus:ring-0 resize-y"
                    value={answers[currentQ._id] || ''}
                    onChange={(e) => setAnswers({...answers, [currentQ._id]: e.target.value})}
                  />
                </div>
                <div className="flex items-start gap-2 text-[#2FA8CC]/70">
                  <HelpCircle className="h-4 w-4 mt-0.5" />
                  <p className="text-xs italic">Ensure your programming code has proper indentation. Compilation checks will be performed post-submission.</p>
                </div>
              </div>
            )}

          </CardContent>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2FA8CC] opacity-50" />
        </Card>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8">
          <Button 
            variant="ghost" 
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="h-12 px-6 font-bold text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentIdx === test.questions.length - 1 ? (
            <Button 
              onClick={submitTest}
              className="h-12 px-10 bg-[#FF6B00] hover:bg-[#FF6B00]/80 text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#FF6B00]/10 active:scale-95 transition-all"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Submit Assessment
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentIdx(currentIdx + 1)}
              className="h-12 px-8 bg-[#2FA8CC] hover:bg-[#2FA8CC]/80 text-white font-bold uppercase tracking-wider rounded-xl active:scale-95 transition-all"
            >
              Next Question
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
