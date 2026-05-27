"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  Award,
  Send,
  ChevronDown,
  ChevronUp,
  FileText,
  Code
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const BACKEND_URL = 'http://localhost:5000/api/tests';

interface Answer {
  questionId: string;
  value: any;
  manualMark: number | null;
}

interface Attempt {
  _id: string;
  studentId: string;
  student: { name: string; usn: string; userId: string };
  answers: Answer[];
  score: number;
  maxScore: number;
  status: 'completed' | 'pending_review';
  gradedAt: string | null;
  createdAt: string;
}

interface Question {
  _id: string;
  type: 'MCQ' | 'MULTIPLE_SELECT' | 'DESCRIPTIVE' | 'CODING';
  text: string;
  points: number;
  options?: string[];
  correctAnswer?: any;
}

interface TestData {
  _id: string;
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  questions: Question[];
}

function ReviewPageInner() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  const [test, setTest] = useState<TestData | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);
  // marks[attemptId][questionId] = mark value (string for input control)
  const [marks, setMarks] = useState<Record<string, Record<string, string>>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/${testId}/attempts`);
      if (!res.ok) throw new Error('Failed to load attempts');
      const data = await res.json();
      setTest(data.test);
      setAttempts(data.attempts);

      // Pre-fill marks from existing manualMark values
      const prefilled: Record<string, Record<string, string>> = {};
      for (const attempt of data.attempts) {
        prefilled[attempt._id] = {};
        for (const answer of attempt.answers) {
          if (answer.manualMark !== null && answer.manualMark !== undefined) {
            prefilled[attempt._id][answer.questionId] = String(answer.manualMark);
          }
        }
      }
      setMarks(prefilled);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [testId]);

  const setMark = (attemptId: string, questionId: string, val: string) => {
    setMarks(prev => ({
      ...prev,
      [attemptId]: { ...(prev[attemptId] || {}), [questionId]: val }
    }));
  };

  const handleSubmitGrades = async (attempt: Attempt) => {
    if (!test) return;

    const manualQuestions = test.questions.filter(
      q => q.type === 'DESCRIPTIVE' || q.type === 'CODING'
    );

    // Build manualMarks payload
    const manualMarks = manualQuestions.map(q => {
      const rawMark = marks[attempt._id]?.[q._id];
      const mark = rawMark !== undefined && rawMark !== '' ? parseFloat(rawMark) : null;
      return { questionId: q._id, mark: mark ?? 0 };
    });

    // Validate: all manual questions must have a mark
    const missing = manualQuestions.filter(q => {
      const v = marks[attempt._id]?.[q._id];
      return v === undefined || v === '';
    });
    if (missing.length > 0) {
      toast.error(`Please enter marks for all ${missing.length} manual question(s) before submitting.`);
      return;
    }

    // Validate: marks must be within range
    for (const q of manualQuestions) {
      const v = parseFloat(marks[attempt._id]?.[q._id] || '0');
      if (v < 0 || v > q.points) {
        toast.error(`Mark for "${q.text.slice(0, 40)}..." must be between 0 and ${q.points}.`);
        return;
      }
    }

    setSubmitting(attempt._id);
    try {
      const res = await fetch(`${BACKEND_URL}/attempts/${attempt._id}/grade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manualMarks, gradedBy: 'faculty' })
      });

      if (!res.ok) {
        let msg = 'Failed to submit grades';
        try { const d = await res.json(); msg = d.error || msg; } catch {}
        throw new Error(msg);
      }

      const result = await res.json();
      setTimeout(() => toast.success(`Graded! Score: ${result.score}/${result.maxScore}`), 0);
      await fetchData(); // Refresh list
      setExpandedAttempt(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit grades');
    } finally {
      setSubmitting(null);
    }
  };

  const pendingAttempts = attempts.filter(a => a.status === 'pending_review');
  const completedAttempts = attempts.filter(a => a.status === 'completed');

  const getManualQuestions = () =>
    test?.questions.filter(q => q.type === 'DESCRIPTIVE' || q.type === 'CODING') || [];

  const getAnswerForQuestion = (attempt: Attempt, questionId: string): Answer | undefined =>
    attempt.answers.find(a => a.questionId === questionId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050B14] space-y-4">
        <Loader2 className="h-8 w-8 text-[#FF6B00] animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading Submissions...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050B14]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-white font-bold">Test not found</p>
        <button onClick={() => router.push('/faculty/tests')} className="mt-4 text-[#2FA8CC] text-sm underline">← Back to Tests</button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-[#050B14] min-h-screen text-slate-200 animate-in fade-in duration-500">

      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-6 md:p-8 shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] font-bold uppercase tracking-widest border border-[#FF6B00]/20">
              Manual Grading
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white mt-2">
              Review <span className="text-[#2FA8CC]">Submissions</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-xl">{test.title}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-black text-[#FF6B00]">{pendingAttempts.length}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-green-400">{completedAttempts.length}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Graded</p>
            </div>
            <Button
              onClick={() => router.push('/faculty/tests')}
              variant="outline"
              className="border-white/10 hover:bg-white/5 text-slate-300 rounded-xl h-11"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/5 blur-[100px] rounded-full" />
      </section>

      {/* Manual Questions Reference */}
      {getManualQuestions().length > 0 && (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Questions Requiring Manual Grading</h3>
          <div className="space-y-2">
            {getManualQuestions().map((q, idx) => (
              <div key={q._id} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${q.type === 'CODING' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  {q.type === 'CODING' ? <Code className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`text-[9px] font-bold border-0 ${q.type === 'CODING' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {q.type}
                    </Badge>
                    <span className="text-[10px] text-[#FF6B00] font-bold">Max: {q.points} pts</span>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2">{q.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No submissions state */}
      {attempts.length === 0 && (
        <div className="text-center py-24 bg-white/[0.02] border border-white/5 rounded-3xl">
          <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-bold text-lg">No Submissions Yet</p>
          <p className="text-slate-500 text-xs mt-1">Students haven't submitted this test yet.</p>
        </div>
      )}

      {/* Pending Review Attempts */}
      {pendingAttempts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FF6B00] animate-pulse" />
            Pending Review
            <span className="px-2 py-0.5 rounded-lg bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold">{pendingAttempts.length}</span>
          </h2>

          {pendingAttempts.map(attempt => {
            const isExpanded = expandedAttempt === attempt._id;
            const isSubmitting = submitting === attempt._id;
            const manualQs = getManualQuestions();

            return (
              <div key={attempt._id} className="bg-white/[0.02] border border-[#FF6B00]/20 rounded-[2rem] overflow-hidden shadow-xl">

                {/* Attempt Header — click to expand */}
                <button
                  onClick={() => setExpandedAttempt(isExpanded ? null : attempt._id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-2xl flex items-center justify-center">
                      <User className="h-5 w-5 text-[#FF6B00]" />
                    </div>
                    <div>
                      <p className="text-white font-bold">{attempt.student.name}</p>
                      <p className="text-slate-500 text-xs font-mono">{attempt.student.usn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Auto Score</p>
                      <p className="text-white font-bold text-sm">{attempt.score} / {attempt.maxScore} pts</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 text-[9px] font-bold">
                        Pending Review
                      </Badge>
                      {isExpanded
                        ? <ChevronUp className="h-4 w-4 text-slate-400" />
                        : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </div>
                  </div>
                </button>

                {/* Expanded grading panel */}
                {isExpanded && (
                  <div className="border-t border-white/5 p-6 space-y-6">

                    {/* Show MCQ/Multi-select answers (read-only context) */}
                    {test.questions
                      .filter(q => q.type === 'MCQ' || q.type === 'MULTIPLE_SELECT')
                      .map((q, qIdx) => {
                        const answer = getAnswerForQuestion(attempt, q._id);
                        const studentVal = answer?.value;
                        const isCorrect = q.type === 'MCQ'
                          ? String(studentVal) === String(q.correctAnswer)
                          : JSON.stringify([...(Array.isArray(studentVal) ? studentVal : [])].sort()) ===
                            JSON.stringify([...(Array.isArray(q.correctAnswer) ? q.correctAnswer : [])].sort());

                        return (
                          <div key={q._id} className="p-4 bg-white/[0.01] rounded-2xl border border-white/5 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-[#2FA8CC]/10 text-[#2FA8CC] border-[#2FA8CC]/20 text-[9px] font-bold">{q.type}</Badge>
                              <span className="text-[10px] text-slate-500 font-bold">{q.points} pts — auto-graded</span>
                              {isCorrect
                                ? <CheckCircle2 className="h-4 w-4 text-green-400 ml-auto" />
                                : <AlertCircle className="h-4 w-4 text-red-400 ml-auto" />}
                            </div>
                            <p className="text-sm text-slate-300">{q.text}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {(q.options || []).map((opt, i) => {
                                const isStuAns = q.type === 'MCQ' ? studentVal === opt : Array.isArray(studentVal) && studentVal.includes(opt);
                                const isCorrectOpt = q.type === 'MCQ' ? q.correctAnswer === opt : Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt);
                                return (
                                  <span key={i} className={`text-xs px-3 py-1 rounded-lg font-medium border ${
                                    isCorrectOpt ? 'border-green-500/40 bg-green-500/10 text-green-300' :
                                    isStuAns ? 'border-red-500/40 bg-red-500/10 text-red-300' :
                                    'border-white/5 bg-white/[0.02] text-slate-400'
                                  }`}>{opt}</span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                    {/* Manual grading questions */}
                    {manualQs.map((q) => {
                      const answer = getAnswerForQuestion(attempt, q._id);
                      const currentMark = marks[attempt._id]?.[q._id] ?? '';

                      return (
                        <div key={q._id} className="p-5 bg-[#FF6B00]/5 rounded-2xl border border-[#FF6B00]/15 space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-[9px] font-bold border-0 ${q.type === 'CODING' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {q.type} — Manual
                            </Badge>
                            <span className="text-[10px] text-[#FF6B00] font-bold ml-auto">Max: {q.points} pts</span>
                          </div>

                          <p className="text-sm text-white font-medium">{q.text}</p>

                          {/* Student's answer */}
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Student's Answer</p>
                            <div className={`p-4 rounded-xl border border-white/5 bg-black/30 min-h-[80px] ${q.type === 'CODING' ? 'font-mono text-xs text-green-300' : 'text-sm text-slate-300'}`}>
                              {answer?.value
                                ? String(answer.value)
                                : <span className="text-slate-600 italic">No answer submitted.</span>}
                            </div>
                          </div>

                          {/* Mark input */}
                          <div className="flex items-center gap-4">
                            <div className="space-y-1 flex-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Awarded Marks (0 – {q.points})
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={q.points}
                                step={0.5}
                                value={currentMark}
                                onChange={e => setMark(attempt._id, q._id, e.target.value)}
                                placeholder={`0 – ${q.points}`}
                                className="w-full h-12 bg-white/5 border border-[#FF6B00]/30 focus:border-[#FF6B00] rounded-xl px-4 text-sm text-white font-bold outline-none transition-all"
                              />
                            </div>
                            {/* Quick mark buttons */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest opacity-0">Quick</label>
                              <div className="flex gap-1">
                                {[0, Math.round(q.points / 2), q.points].map(v => (
                                  <button
                                    key={v}
                                    onClick={() => setMark(attempt._id, q._id, String(v))}
                                    className={`px-3 h-12 rounded-xl text-xs font-black border transition-all ${
                                      currentMark === String(v)
                                        ? 'bg-[#FF6B00] border-[#FF6B00] text-white'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-[#FF6B00]/40 hover:text-white'
                                    }`}
                                  >
                                    {v}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Submit button */}
                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={() => handleSubmitGrades(attempt)}
                        disabled={isSubmitting}
                        className="bg-[#FF6B00] hover:bg-[#FF6B00]/80 text-white font-bold uppercase tracking-widest rounded-xl h-12 px-8 shadow-lg shadow-[#FF6B00]/20"
                      >
                        {isSubmitting
                          ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</>
                          : <><Send className="h-4 w-4 mr-2" />Submit Grades</>}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Orange accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-[#FF6B00]/40 via-[#FF6B00] to-[#FF6B00]/40" />
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Attempts */}
      {completedAttempts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            Graded
            <span className="px-2 py-0.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-bold">{completedAttempts.length}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedAttempts.map(attempt => {
              const pct = attempt.maxScore > 0 ? Math.round((attempt.score / attempt.maxScore) * 100) : 0;
              return (
                <div key={attempt._id} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-5 flex items-center gap-4 hover:border-white/10 transition-all group relative overflow-hidden">
                  <div className="h-11 w-11 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate">{attempt.student.name}</p>
                    <p className="text-slate-500 text-xs font-mono">{attempt.student.usn}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-black text-lg">{attempt.score}<span className="text-slate-500 text-sm font-normal">/{attempt.maxScore}</span></p>
                    <p className={`text-xs font-bold ${pct >= 60 ? 'text-green-400' : 'text-red-400'}`}>{pct}%</p>
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050B14] space-y-4">
        <Loader2 className="h-8 w-8 text-[#FF6B00] animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading...</p>
      </div>
    }>
      <ReviewPageInner />
    </Suspense>
  );
}
