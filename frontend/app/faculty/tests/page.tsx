"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Clock, 
  Award, 
  Trash2, 
  Plus, 
  HelpCircle, 
  Loader2,
  ChevronRight,
  TrendingUp,
  Edit3,
  Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function FacultyTestsDashboard() {
  const router = useRouter();
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'http://localhost:5000/api/tests';

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await fetch(BACKEND_URL);
      if (res.ok) {
        const data = await res.json();
        setTests(data);
      } else {
        toast.error("Failed to load assessments");
      }
    } catch (err) {
      console.error("Error loading tests:", err);
      toast.error("Could not reach tests backend server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this test? All student responses and progress will be permanently lost!')) return;

    try {
      const res = await fetch(`${BACKEND_URL}/${testId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success("Test deleted successfully");
        fetchTests();
      } else {
        toast.error("Failed to delete test");
      }
    } catch (err) {
      console.error("Error deleting test:", err);
      toast.error("Failed to delete test");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-10 bg-[#050B14] min-h-screen text-foreground animate-in fade-in duration-500">
      
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-8 md:p-12 shadow-2xl border border-border">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2FA8CC]/10 text-[#2FA8CC] text-[10px] font-bold uppercase tracking-widest border border-[#2FA8CC]/20">
              Faculty Portal
            </span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-2 font-display">
                Assessments & <span className="text-[#2FA8CC]">Tests</span>
              </h1>
              <p className="text-muted-foreground text-sm max-w-lg">
                Create and manage structured assessments. Design MCQ, multiple-select, descriptive, or coding challenges.
              </p>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={() => router.push('/faculty/tests/import')}
              className="h-12 px-6 bg-[#2FA8CC] hover:bg-[#2FA8CC]/80 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#2FA8CC]/20 flex items-center gap-2 active:scale-95 shrink-0"
            >
              <FileText className="h-5 w-5" />
              Bulk Import
            </button>
            <button 
              onClick={() => router.push('/faculty/tests/create')}
              className="h-12 px-6 bg-[#FF6B00] hover:bg-[#FF6B00]/80 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#FF6B00]/20 flex items-center gap-2 active:scale-95 shrink-0"
            >
              <Plus className="h-5 w-5" />
              Create New Test
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2FA8CC]/5 blur-[120px] rounded-full" />
      </section>

      {/* 2. Main content */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          Published Assessments
          <span className="px-2 py-0.5 rounded-lg bg-card text-xs text-muted-foreground font-bold">{tests.length}</span>
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-card border border-border rounded-3xl backdrop-blur-xl space-y-4">
            <Loader2 className="h-8 w-8 text-[#2FA8CC] animate-spin" />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading Assessments...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-3xl backdrop-blur-xl max-w-2xl mx-auto">
            <HelpCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-muted-foreground font-bold text-lg">No Tests Created Yet</p>
            <p className="text-slate-500 text-xs mt-1">Get started by creating your first automated or manual-graded assessment.</p>
            <Button 
              onClick={() => router.push('/faculty/tests/create')}
              className="mt-6 bg-[#2FA8CC] hover:bg-[#2FA8CC]/80 text-white rounded-xl"
            >
              Add First Test
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => {
              const totalPoints = test.questions?.reduce((acc: number, q: any) => acc + (q.points || 0), 0) || 0;
              return (
                <div 
                  key={test._id} 
                  className="bg-card border border-border rounded-[2rem] p-6 backdrop-blur-xl hover:border-white/10 transition-all duration-300 shadow-xl relative overflow-hidden group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="h-12 w-12 bg-[#2FA8CC]/10 text-[#2FA8CC] border border-[#2FA8CC]/20 rounded-2xl flex items-center justify-center">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-[#2FA8CC]/10 text-[#2FA8CC] border-[#2FA8CC]/30 font-bold text-[9px]">
                          {test.questions?.length || 0} Questions
                        </Badge>
                        <Badge variant="outline" className="bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 font-bold text-[9px]">
                          {totalPoints} Points
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-[#2FA8CC] transition-colors">{test.title}</h3>
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-2 leading-relaxed">{test.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">Duration</span>
                          <span className="text-xs font-bold text-foreground">{test.durationMinutes} Mins</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-slate-500" />
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">Passing Mark</span>
                          <span className="text-xs font-bold text-foreground">{test.passingScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border mt-6 pt-4">
                    {/* Review Submissions button — prominent for manual grading */}
                    <button
                      onClick={() => router.push(`/faculty/tests/${test._id}/review`)}
                      className="w-full h-10 bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/20 hover:border-[#FF6B00]/40 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider active:scale-95"
                    >
                      <Users className="h-4 w-4" />
                      Review Submissions
                    </button>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Release: {test.isManualRelease ? 'Manual Review' : 'Auto Release'}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => router.push(`/faculty/tests/create?edit=${test._id}`)}
                          className="p-2 bg-card hover:bg-[#2FA8CC]/10 text-muted-foreground hover:text-[#2FA8CC] border border-border rounded-xl transition-all"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTest(test._id)}
                          className="p-2 bg-card hover:bg-red-500/10 text-muted-foreground hover:text-red-400 border border-border rounded-xl transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Saffron side glow */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Subtle hover background highlight */}
                  <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-[#2FA8CC]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
