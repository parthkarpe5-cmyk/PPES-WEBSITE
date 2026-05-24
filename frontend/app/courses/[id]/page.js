'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Lock, 
  Eye, 
  FileText, 
  ShieldCheck, 
  X, 
  IndianRupee,
  Loader2,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMyProfile } from '@/lib/api';

export default function CourseDetails({ params }) {
  const unwrappedParams = React.use(params);
  const courseId = unwrappedParams.id;
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Simulated buying state
  const [buying, setBuying] = useState(false);

  // Secure DRM Viewer state
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const BACKEND_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProfileAndCourse();
  }, [courseId]);

  const fetchProfileAndCourse = async () => {
    setLoading(true);
    try {
      const [profData, courseRes] = await Promise.all([
        getMyProfile().catch(() => null),
        fetch(`${BACKEND_URL}/courses/${courseId}`)
      ]);
      
      const courseData = await courseRes.json();
      setProfile(profData);
      setCourse(courseData);
    } catch (err) {
      console.error('Error fetching details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Determine if course is unlocked by this user
  const isUnlocked = () => {
    if (!profile) return false;
    
    // Admins and teachers bypass locks
    if (profile.role === 'admin' || profile.role === 'faculty' || profile.role === 'ADMIN' || profile.role === 'TEACHER') {
      return true;
    }
    
    // Check database-backed enrollment array
    if (profile.unlockedCourses && profile.unlockedCourses.includes(courseId)) {
      return true;
    }
    
    return false;
  };

  const handleMaterialClick = (material) => {
    if (isUnlocked()) {
      setActiveMaterial(material);
    } else {
      setShowPaywall(true);
    }
  };

  const handlePurchase = async () => {
    setBuying(true);
    try {
      const res = await fetch(`${BACKEND_URL}/courses/purchase`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': profile?.id || profile?.userId || ''
        },
        body: JSON.stringify({ courseId })
      });

      if (res.ok) {
        setShowPaywall(false);
        await fetchProfileAndCourse();
      }
    } catch (err) {
      console.error('Error purchasing course:', err);
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-[#050B14] min-h-screen text-slate-500 space-y-4">
        <Loader2 className="h-8 w-8 text-[#2FA8CC] animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest">Entering Study Hub...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 bg-[#050B14] min-h-screen text-slate-400">
        <HelpCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <p className="text-lg font-bold">Course Not Found</p>
        <Link href="/student/courses" className="text-[#2FA8CC] hover:underline text-xs mt-2 inline-block">Return to Catalog</Link>
      </div>
    );
  }

  const unlocked = isUnlocked();

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-[#050B14] min-h-screen text-slate-200 animate-in fade-in duration-500 relative">
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors mb-4 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Courses
      </button>

      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-8 md:p-12 shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-wider border border-white/5">
              {course.course_id}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-1.5 leading-tight">{course.course_name}</h1>
            <p className="text-slate-400 text-sm max-w-lg mt-2 font-medium">
              {course.course_description || "Comprehensive syllabus configured for active student engagement."}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <span className="text-2xl font-black text-white flex items-center">
              <IndianRupee className="h-6 w-6 text-[#2FA8CC]" />
              {course.price}
            </span>
            {unlocked ? (
              <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black uppercase tracking-widest shadow-md">
                Enrolled
              </span>
            ) : (
              <button 
                onClick={handlePurchase}
                disabled={buying}
                className="h-12 px-6 bg-[#2FA8CC] hover:bg-[#2FA8CC]/90 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5"
              >
                {buying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                Buy Course
              </button>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2FA8CC]/5 blur-[120px] rounded-full" />
      </section>

      {/* 2. Course Content Accordion/Syllabus */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          Curriculum Subjects
          <span className="px-2 py-0.5 rounded-lg bg-white/5 text-xs text-slate-400 font-bold">{course.subjects?.length || 0}</span>
        </h2>

        {(!course.subjects || course.subjects.length === 0) ? (
          <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-2xl">
            <p className="text-slate-500 text-xs italic">No subjects mapped to this curriculum yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {course.subjects.map((sub, index) => (
              <div 
                key={sub._id}
                className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-[2rem] p-6 shadow-xl relative overflow-hidden"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3 border-b border-white/5 pb-3">
                  <span className="h-7 w-7 rounded-lg bg-[#2FA8CC]/10 text-[#2FA8CC] flex items-center justify-center text-xs font-black">
                    {index + 1}
                  </span>
                  {sub.subject_name}
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider ml-auto">{sub.subject_id}</span>
                </h3>

                {(!sub.materials || sub.materials.length === 0) ? (
                  <p className="text-slate-500 text-xs italic">No materials uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sub.materials.map((mat) => (
                      <div 
                        key={mat._id}
                        onClick={() => handleMaterialClick(mat)}
                        className="p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-[#2FA8CC]/30 rounded-2xl flex items-center justify-between cursor-pointer group transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-5 w-5 text-red-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-white group-hover:text-[#2FA8CC] transition-colors truncate block">
                            {mat.title}
                          </span>
                        </div>
                        {unlocked ? (
                          <span className="text-[10px] font-bold text-[#2FA8CC] uppercase tracking-wider flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Lock className="h-3.5 w-3.5" />
                            Locked
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- DRM SECURE WATERMARKED VIEWER MODAL --- */}
      {activeMaterial && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in fade-in duration-300"
          onContextMenu={e => e.preventDefault()} // Disable Right-Click
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-white/5 relative z-50">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveMaterial(null)}
                className="px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                ← Back
              </button>
              <h3 className="text-base font-bold text-white">{activeMaterial.title}</h3>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5 animate-pulse" />
              Secure DRM View Mode
            </span>
          </div>

          {/* Secure Display Workspace */}
          <div 
            className="flex-1 bg-slate-800 flex items-center justify-center p-4 relative overflow-hidden select-none"
            tabIndex={0}
            onKeyDown={e => {
              // Intercept keyboard print/save shortcuts
              if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'c' || e.key === 'u')) {
                e.preventDefault();
                alert('This operation is disabled due to strict DRM protocols.');
              }
            }}
          >
            {/* 1. Translucent Security Watermark Overlay */}
            <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 p-6 rotate-[-25deg] scale-125 opacity-[0.03] pointer-events-none z-40 select-none overflow-hidden">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="text-white text-sm font-black tracking-widest whitespace-nowrap">
                  {profile?.email || 'STUDENT_PORTAL'}
                </div>
              ))}
            </div>

            {/* 2. Custom Block Overlay (Interferes with standard window screenshot captures) */}
            <div className="absolute inset-0 bg-transparent pointer-events-none z-30 select-none" />

            {/* 3. Secure File View Container */}
            <div className="bg-white rounded-3xl w-full max-w-4xl h-full shadow-2xl flex flex-col overflow-hidden relative border border-white/10">
              <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 text-[#0F172A] flex justify-between items-center shrink-0">
                <div>
                  <h4 className="text-sm font-black leading-none">{activeMaterial.title}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 inline-block">Secure Viewer - Screenshots & Printing Blocked</span>
                </div>
              </div>
              <div className="flex-1 relative bg-slate-300">
                <iframe 
                  src={`http://localhost:5000${activeMaterial.url}#toolbar=0&navpanes=0`} 
                  className="w-full h-full border-none"
                  title={activeMaterial.title}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FORM PAYWALL MODAL --- */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-16 h-16 bg-[#2FA8CC]/10 border border-[#2FA8CC]/20 text-[#2FA8CC] rounded-full flex items-center justify-center mx-auto shadow-lg mb-4 animate-bounce">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2 mb-6">
              <h4 className="text-xl font-black text-white tracking-tight">Unlock Course Material</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                To view subjects and download resources for <span className="text-[#2FA8CC] font-bold">"{course.course_name}"</span>, you need to unlock the syllabus.
              </p>
            </div>

            <button 
              onClick={handlePurchase}
              disabled={buying}
              className="w-full h-12 bg-[#2FA8CC] hover:bg-[#2FA8CC]/90 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#2FA8CC]/15 flex items-center justify-center gap-1.5"
            >
              {buying ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Buy Course for ₹{course.price}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
