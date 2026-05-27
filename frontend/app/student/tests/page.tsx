"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Loader2, 
  ArrowRight,
  Play,
  ClipboardCheck,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getAuthHeaders } from '@/lib/api';

export default function StudentTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchTestData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [testsRes, attemptsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/tests`, { headers: headers as any }),
        fetch(`${BACKEND_URL}/api/tests/attempts/me`, { headers: headers as any })
      ]);

      if (testsRes.ok) {
        const testsData = await testsRes.json();
        setTests(testsData);
      } else {
        toast.error("Failed to load assessments");
      }

      if (attemptsRes.ok) {
        const attemptsData = await attemptsRes.json();
        setAttempts(attemptsData);
      }
    } catch (err) {
      console.error("Error loading test data:", err);
      toast.error("Could not sync assessments from the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  // Helper: Find attempt for a test
  const getAttemptForTest = (testId: string) => {
    return attempts.find(att => {
      // populate query returns populate object or string ID
      const attTestId = typeof att.testId === 'object' && att.testId !== null ? att.testId._id : att.testId;
      return attTestId === testId;
    });
  };

  // Filter logic
  const filteredTests = tests.filter(test => {
    const attempt = getAttemptForTest(test._id);
    if (filter === 'available') return !attempt;
    if (filter === 'completed') return !!attempt;
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10 transition-colors duration-300 animate-in fade-in duration-500">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* 1. Header Section */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-8 md:p-12 shadow-2xl border border-border">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2FA8CC]/10 text-[#2FA8CC] text-[10px] font-bold uppercase tracking-widest border border-[#2FA8CC]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2FA8CC] animate-pulse" />
                Student Desk Assessments
              </span>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-2 font-display">
                  Academic <span className="text-[#2FA8CC]">Tests</span>
                </h1>
                <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
                  Evaluate your learnings, tackle challenging quizzes, and track detailed grading and performance evaluations right here.
                </p>
              </div>
            </div>
            
            <button 
              onClick={fetchTestData}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border hover:border-[#2FA8CC]/30 hover:bg-white/10 text-foreground font-bold text-xs uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Sync Desk
            </button>
          </div>
          
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2FA8CC]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF6B00]/5 blur-[100px] rounded-full translate-y-1/3" />
        </section>

        {/* 2. Filters Grid */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
          <div className="flex gap-2">
            {(['all', 'available', 'completed'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  filter === t 
                    ? 'bg-[#2FA8CC] text-white shadow-lg shadow-[#2FA8CC]/15'
                    : 'bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground border border-border/40'
                }`}
              >
                {t === 'all' ? 'All Assessments' : t === 'available' ? 'Available' : 'Taken / Finished'}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Showing {filteredTests.length} total quizzes
          </span>
        </div>

        {/* 3. Main content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-card border border-border/40 rounded-[2rem] shadow-sm space-y-4">
            <Loader2 className="h-10 w-10 text-[#2FA8CC] animate-spin" />
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest animate-pulse">Compiling available tests...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border/40 rounded-[2.5rem] shadow-sm max-w-2xl mx-auto">
            <HelpCircle className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">No Assessments Found</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-sm mx-auto">
              There are no {filter !== 'all' ? filter : ''} assessments configured in this segment yet. Please check back later!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTests.map((test) => {
              const attempt = getAttemptForTest(test._id);
              const totalPoints = test.questions?.reduce((acc: number, q: any) => acc + (q.points || 0), 0) || 0;
              const hasTaken = !!attempt;

              return (
                <article 
                  key={test._id} 
                  className="group relative flex flex-col justify-between rounded-[2rem] border border-border/60 bg-card p-6 shadow-sm hover:border-[#2FA8CC]/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-2xl bg-[#2FA8CC]/10 text-[#2FA8CC] border border-[#2FA8CC]/20 flex items-center justify-center">
                        <FileText className="h-6 w-6" />
                      </div>
                      
                      {hasTaken ? (
                        attempt.status === 'pending_review' ? (
                          <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest text-[9px] font-bold py-1 px-2.5 rounded-full">
                            Pending Review
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest text-[9px] font-bold py-1 px-2.5 rounded-full">
                            Graded
                          </Badge>
                        )
                      ) : (
                        <Badge className="bg-[#2FA8CC]/10 text-[#2FA8CC] border border-[#2FA8CC]/20 uppercase tracking-widest text-[9px] font-bold py-1 px-2.5 rounded-full">
                          Ready
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-foreground group-hover:text-[#2FA8CC] transition-colors duration-300">
                        {test.title}
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                        {test.description || "No specific detailed description provided for this academic assessment module."}
                      </p>
                    </div>

                    {/* Test Stats Details */}
                    <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4 text-xs font-semibold text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#2FA8CC]/80" />
                        <div>
                          <span className="text-[10px] text-muted-foreground/60 block uppercase font-bold">Duration</span>
                          <span className="text-foreground font-bold">{test.durationMinutes} Mins</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-[#FF6B00]/80" />
                        <div>
                          <span className="text-[10px] text-muted-foreground/60 block uppercase font-bold">Points</span>
                          <span className="text-foreground font-bold">{totalPoints} Marks</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission Attempt Grading Info or Action Button */}
                  <div className="mt-6 border-t border-border/40 pt-4 flex items-center justify-between gap-4">
                    {hasTaken ? (
                      <div className="w-full bg-muted/30 border border-border/30 rounded-2xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <ClipboardCheck className="h-5 w-5 text-emerald-500" />
                          <div>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase block">Your Score</span>
                            <span className="text-xs font-bold text-foreground">
                              {attempt.status === 'pending_review' 
                                ? 'Manual Review' 
                                : `${attempt.score} / ${attempt.maxScore} pts`
                              }
                            </span>
                          </div>
                        </div>
                        {attempt.status === 'completed' && (
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase block">Percentage</span>
                            <span className="text-xs font-black text-[#2FA8CC]">
                              {attempt.maxScore > 0 ? Math.round((attempt.score / attempt.maxScore) * 100) : 0}%
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                          {test.questions?.length || 0} Questions
                        </span>
                        
                        <Button 
                          asChild 
                          className="h-10 rounded-xl bg-[#2FA8CC] text-white hover:bg-[#1F4E79] px-4 font-bold text-xs uppercase tracking-wider transition-all"
                        >
                          <Link href={`/student/tests/${test._id}`} className="flex items-center gap-1">
                            <Play className="h-3 w-3 fill-current" />
                            Start Test
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Aesthetic border indicator */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2FA8CC] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Radial spotlight effect */}
                  <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-[#2FA8CC]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}