'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  IndianRupee, 
  CheckCircle, 
  Lock, 
  Loader2, 
  HelpCircle,
  CreditCard,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getMyProfile, getTeachers } from '@/lib/api';

export default function StudentCoursesCatalog() {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  // Accordion state to show subjects/teachers inline
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});

  const BACKEND_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProfileAndCourses();
  }, []);

  const fetchProfileAndCourses = async () => {
    setLoading(true);
    try {
      const [profileData, coursesRes, teachersData] = await Promise.all([
        getMyProfile().catch(() => null),
        fetch(`${BACKEND_URL}/courses`),
        getTeachers().catch(() => [])
      ]);
      
      const coursesData = await coursesRes.json();
      setStudent(profileData);
      
      // Filter out draft courses so students only see published (Live) syllabi
      const publishedCourses = (Array.isArray(coursesData) ? coursesData : [])
        .filter((c: any) => c.isPublished);
      setCourses(publishedCourses);
      setTeachers(Array.isArray(teachersData) ? teachersData : []);
    } catch (err) {
      console.error('Error fetching student courses catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (courseId: string, price: number) => {
    // Redirect to the payment gateway with the amount and courseId
    window.location.href = `/test-payment?amount=${price}&courseId=${courseId}`;
  };

  const isCourseUnlocked = (courseId: string) => {
    if (!student || !student.unlockedCourses) return false;
    return student.unlockedCourses.includes(courseId);
  };

  const toggleSyllabus = (courseId: string) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  return (
    <div className="p-6 lg:p-8 space-y-10 bg-[#050B14] min-h-screen text-slate-200 animate-in fade-in duration-500">
      
      {/* 1. Welcoming Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-8 md:p-12 shadow-2xl border border-white/5">
        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2FA8CC]/10 text-[#2FA8CC] text-[10px] font-bold uppercase tracking-widest border border-[#2FA8CC]/20">
            Student Portal
          </span>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 font-display">
              Academic <span className="text-[#2FA8CC]">Catalog</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-lg">
              Unlock study resources, inspect lesson paths, and excel in your standard exams.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2FA8CC]/5 blur-[120px] rounded-full" />
      </section>

      {/* 2. Course Catalog Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          Available Syllabi
          <span className="px-2 py-0.5 rounded-lg bg-white/5 text-xs text-slate-400 font-bold">{courses.length}</span>
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl space-y-4">
            <Loader2 className="h-8 w-8 text-[#2FA8CC] animate-spin" />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading Catalog...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl max-w-xl mx-auto">
            <HelpCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300 font-bold text-lg">Catalog Empty</p>
            <p className="text-slate-500 text-xs mt-1">No courses have been published by the administrators yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const unlocked = isCourseUnlocked(course._id);
              const isExpanded = !!expandedCourses[course._id];
              return (
                <div 
                  key={course._id} 
                  className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 hover:border-[#2FA8CC]/20 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group shadow-lg relative overflow-hidden"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-wider border border-white/5">
                        {course.course_id}
                      </span>
                      {unlocked ? (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                          <CheckCircle className="h-3 w-3" />
                          Purchased
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-white/5 text-[9px] font-black uppercase tracking-widest">
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#2FA8CC] transition-colors leading-tight">
                      {course.course_name}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-3 mb-6 font-medium">
                      {course.course_description || "Comprehensive syllabus configured for active student engagement."}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-500 font-bold uppercase tracking-wider">
                        <BookOpen className="h-3.5 w-3.5 text-[#2FA8CC]" />
                        {course.subjects?.length || 0} Subjects
                      </span>
                      <span className="flex items-center text-white font-black text-base">
                        <IndianRupee className="h-4 w-4 text-[#2FA8CC]" />
                        {course.price}
                      </span>
                    </div>

                    {/* Inline Syllabus Details Accordion */}
                    <div className="space-y-2">
                      <button
                        onClick={() => toggleSyllabus(course._id)}
                        className="w-full h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest border border-white/5 transition-all flex items-center justify-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3.5 w-3.5 text-[#2FA8CC]" />
                            Hide Syllabus
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3.5 w-3.5 text-[#2FA8CC]" />
                            View Syllabus
                          </>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 py-1 custom-scrollbar animate-in slide-in-from-top-2 duration-300">
                          {(!course.subjects || course.subjects.length === 0) ? (
                            <p className="text-slate-500 text-[10px] italic py-2 text-center">No subjects configured yet.</p>
                          ) : (
                            course.subjects.map((sub: any) => {
                              const facultyObj = teachers.find(t => 
                                t._id === sub.teacherId || 
                                (sub.teacherId && typeof sub.teacherId === 'object' && t._id === sub.teacherId._id) ||
                                (sub.facultyIds && Array.isArray(sub.facultyIds) && sub.facultyIds.includes(t.userId))
                              );
                              return (
                                <div 
                                  key={sub._id} 
                                  className="p-2.5 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between gap-2"
                                >
                                  <div className="min-w-0">
                                    <span className="text-[11px] font-bold text-slate-200 block truncate">{sub.subject_name}</span>
                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{sub.subject_id}</span>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block leading-none">Mentor</span>
                                    <span className="text-[10px] text-[#2FA8CC] font-bold block mt-0.5">{facultyObj ? facultyObj.name : 'Awaiting Allocation'}</span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      {unlocked ? (
                        <Link 
                          href={`/courses/${course._id}`}
                          className="w-full h-11 bg-white/5 hover:bg-[#2FA8CC]/10 text-slate-200 hover:text-[#2FA8CC] text-xs font-bold uppercase tracking-widest rounded-xl border border-white/5 transition-all flex items-center justify-center gap-1.5"
                        >
                          View Study Hub
                        </Link>
                      ) : (
                        <button 
                          onClick={() => handlePurchase(course._id, course.price)}
                          disabled={buyingId === course._id}
                          className="w-full h-11 bg-[#2FA8CC] hover:bg-[#2FA8CC]/90 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#2FA8CC]/10 flex items-center justify-center gap-1.5"
                        >
                          {buyingId === course._id ? (
                            <>
                              <Loader2 className="h-4.5 w-4.5 animate-spin" />
                              Enrolling...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4" />
                              Buy Now
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(47, 168, 204, 0.15);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(47, 168, 204, 0.3);
        }
      `}</style>
    </div>
  );
}
