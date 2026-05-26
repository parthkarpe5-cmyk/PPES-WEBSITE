'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  BookOpen, 
  Users, 
  Trash2, 
  Edit3, 
  ListOrdered, 
  IndianRupee, 
  AlertTriangle,
  X,
  Loader2,
  Calendar,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { getTeachers } from '@/lib/api';

export default function AdminCourseManager() {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal control
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // State for forms
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [activeCourse, setActiveCourse] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'course' | 'subject'; id: string } | null>(null);

  // Form Fields - Course
  const [courseName, setCourseName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [price, setPrice] = useState<string>('0');
  const [priceError, setPriceError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [startDate, setStartDate] = useState('');

  // Form Fields - Subject
  const [subjectName, setSubjectName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');

  const BACKEND_URL = 'http://localhost:5000/api';

  const todayStr = (() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, teachersRes] = await Promise.all([
        fetch(`${BACKEND_URL}/courses`),
        getTeachers()
      ]);
      const coursesData = await coursesRes.json();
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setTeachers(Array.isArray(teachersRes) ? teachersRes : []);
    } catch (error) {
      console.error('Error fetching course metadata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open modal to Create Course
  const openCreateCourse = () => {
    setEditingCourse(null);
    setCourseName('');
    setCourseId('');
    setCourseDesc('');
    setPrice('0');
    setPriceError(null);
    setIsPublished(false);
    setStartDate('');
    setShowCourseModal(true);
  };

  // Open modal to Edit Course
  const openEditCourse = (course: any) => {
    setEditingCourse(course);
    setCourseName(course.course_name || '');
    setCourseId(course.course_id || '');
    setCourseDesc(course.course_description || '');
    setPrice(String(course.price ?? 0));
    setPriceError(null);
    setIsPublished(course.isPublished || false);
    setStartDate(course.course_start_date ? new Date(course.course_start_date).toISOString().split('T')[0] : '');
    setShowCourseModal(true);
  };

  // Save/Update Course
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (price === '' || String(price).trim() === '') {
      setPriceError('This field is empty');
      return;
    }
    if (Number(price) < 0) {
      setPriceError('Price cannot be negative');
      return;
    }
    setPriceError(null);
    const payload = {
      course_name: courseName,
      course_id: courseId,
      course_description: courseDesc,
      price: Number(price),
      isPublished,
      course_start_date: startDate
    };

    try {
      const url = editingCourse 
        ? `${BACKEND_URL}/courses/${editingCourse._id}`
        : `${BACKEND_URL}/courses`;
      const method = editingCourse ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowCourseModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open modal to Manage Subjects for a Course
  const openManageSubjects = (course: any) => {
    setActiveCourse(course);
    setSubjectName('');
    setSubjectId('');
    setTeacherId('');
    setShowSubjectModal(true);
  };

  // Add Subject inline
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName || !subjectId || !activeCourse) return;

    try {
      const res = await fetch(`${BACKEND_URL}/subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_name: subjectName,
          subject_id: subjectId,
          teacherId: teacherId || null,
          courseId: activeCourse._id
        })
      });

      if (res.ok) {
        // Refresh Course Data and Active Course
        const freshCourseRes = await fetch(`${BACKEND_URL}/courses/${activeCourse._id}`);
        const freshCourse = await freshCourseRes.json();
        setActiveCourse(freshCourse);
        setSubjectName('');
        setSubjectId('');
        setTeacherId('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger custom confirmation dialog
  const triggerDelete = (type: 'course' | 'subject', id: string) => {
    setDeleteTarget({ type, id });
    setShowConfirmModal(true);
  };

  // Execute deletion upon confirmation
  const executeDelete = async () => {
    if (!deleteTarget) return;

    try {
      const url = deleteTarget.type === 'course'
        ? `${BACKEND_URL}/courses/${deleteTarget.id}`
        : `${BACKEND_URL}/subjects/${deleteTarget.id}`;

      const res = await fetch(url, { method: 'DELETE' });

      if (res.ok) {
        if (deleteTarget.type === 'subject' && activeCourse) {
          const freshCourseRes = await fetch(`${BACKEND_URL}/courses/${activeCourse._id}`);
          const freshCourse = await freshCourseRes.json();
          setActiveCourse(freshCourse);
        }
        setShowConfirmModal(false);
        setDeleteTarget(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-10 bg-slate-950 min-h-screen text-slate-200">
      
      {/* 1. Welcoming Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-8 md:p-12 shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2FA8CC]/10 text-[#2FA8CC] text-[10px] font-bold uppercase tracking-widest border border-[#2FA8CC]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2FA8CC] animate-pulse" />
              Academic Panel Live
            </span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 font-display">
                Course <span className="text-[#2FA8CC]">Manager</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-lg">
                Full dynamic control to configure classes, build relational subjects, and allocate faculty members instantly.
              </p>
            </div>
          </div>
          
          <button 
            onClick={openCreateCourse}
            className="group flex items-center gap-2 bg-[#2FA8CC] hover:bg-[#2FA8CC]/80 text-white font-bold h-14 px-8 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#2FA8CC]/20 shrink-0"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
            Create Course
          </button>
        </div>
        
        {/* Background glowing decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2FA8CC]/5 blur-[120px] rounded-full" />
      </section>

      {/* 2. Course Table / Grid list */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          Academic Catalog
          <span className="px-2 py-0.5 rounded-lg bg-white/5 text-xs text-slate-400 font-bold">{courses.length}</span>
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl space-y-4">
            <Loader2 className="h-8 w-8 text-[#2FA8CC] animate-spin" />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Syncing Catalog...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
            <HelpCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-lg">No Courses Setup</p>
            <p className="text-slate-600 text-xs mt-1">Get started by clicking "+ Create Course" above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course._id} 
                className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 hover:border-[#2FA8CC]/20 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/5">
                      {course.course_id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      course.isPublished ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {course.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#2FA8CC] transition-colors">
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

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => openManageSubjects(course)}
                      className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-[#2FA8CC]/10 hover:text-[#2FA8CC] text-slate-300 text-[11px] font-bold uppercase tracking-widest border border-white/5 transition-all flex items-center justify-center gap-1.5"
                    >
                      <ListOrdered className="h-3.5 w-3.5" />
                      Subjects
                    </button>
                    <button 
                      onClick={() => openEditCourse(course)}
                      className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all flex items-center justify-center"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      onClick={() => triggerDelete('course', course._id)}
                      className="h-10 w-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-300 hover:text-red-500 border border-white/5 transition-all flex items-center justify-center"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- FORM MODAL: CREATE / EDIT COURSE --- */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-[2rem] shadow-2xl p-6 md:p-8 space-y-6 relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowCourseModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {editingCourse ? <Edit3 className="text-[#2FA8CC]" /> : <Plus className="text-[#2FA8CC]" />}
              {editingCourse ? 'Modify Course' : 'Create Course'}
            </h3>

            <form onSubmit={handleCourseSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Course Name</label>
                  <input 
                    required 
                    value={courseName}
                    onChange={e => setCourseName(e.target.value)}
                    placeholder="e.g. Science Hub 10th"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] focus:ring-1 focus:ring-[#2FA8CC] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Course Code ID</label>
                  <input 
                    required 
                    value={courseId}
                    onChange={e => setCourseId(e.target.value)}
                    placeholder="e.g. SCI10-2026"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] focus:ring-1 focus:ring-[#2FA8CC] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                  <input 
                    type="date"
                    value={startDate}
                    min={editingCourse ? undefined : todayStr}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] transition-all"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price (INR)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="number"
                      value={price}
                      min="0"
                      onChange={e => {
                        const val = e.target.value;
                        setPrice(val);
                        if (val.trim() !== '') {
                          setPriceError(null);
                        }
                      }}
                      placeholder="999"
                      className={`w-full h-12 bg-white/5 border ${priceError ? 'border-red-500' : 'border-white/10'} rounded-xl pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] transition-all`}
                    />
                  </div>
                  {priceError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide mt-1 ml-1">{priceError}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Curriculum Description</label>
                <textarea 
                  value={courseDesc}
                  onChange={e => setCourseDesc(e.target.value)}
                  placeholder="Outline the curriculum milestones..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] transition-all"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox" 
                  id="publish" 
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  className="w-4.5 h-4.5 rounded bg-white/5 border-white/10 text-[#2FA8CC] focus:ring-[#2FA8CC]"
                />
                <label htmlFor="publish" className="text-xs text-slate-300 font-bold uppercase tracking-wider cursor-pointer">
                  Publish Immediately
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="submit"
                  className="flex-1 h-12 bg-[#2FA8CC] hover:bg-[#2FA8CC]/90 text-white font-bold rounded-xl transition-all"
                >
                  Save Course
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-6 h-12 border border-white/10 hover:bg-white/5 text-slate-300 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: MANAGE SUBJECTS --- */}
      {showSubjectModal && activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-[2.5rem] shadow-2xl p-6 md:p-8 space-y-6 relative flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowSubjectModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <BookOpen className="text-[#2FA8CC]" />
                Curriculum Subjects
              </h3>
              <p className="text-slate-400 text-xs mt-1 font-bold">Course: <span className="text-[#2FA8CC]">{activeCourse.course_name}</span></p>
            </div>

            {/* Subject Creation Form */}
            <form onSubmit={handleAddSubject} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Name</label>
                <input 
                  required 
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                  placeholder="e.g. Organic Chemistry"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#2FA8CC] transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject ID Code</label>
                <input 
                  required 
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  placeholder="e.g. CHE-101"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#2FA8CC] transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Faculty Mentor</label>
                <select 
                  value={teacherId}
                  onChange={e => setTeacherId(e.target.value)}
                  className="w-full h-11 bg-slate-800 border border-white/10 rounded-xl px-3 text-xs text-slate-300 focus:outline-none focus:border-[#2FA8CC] appearance-none"
                >
                  <option value="">Awaiting Allocation</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <button 
                type="submit" 
                className="col-span-1 md:col-span-3 h-11 bg-[#2FA8CC] hover:bg-[#2FA8CC]/80 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
              >
                + Add Subject
              </button>
            </form>

            {/* Subjects List */}
            <div className="flex-grow overflow-y-auto space-y-3 custom-scrollbar pr-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2">Subject List ({activeCourse.subjects?.length || 0})</span>
              
              {(!activeCourse.subjects || activeCourse.subjects.length === 0) ? (
                <p className="text-slate-500 text-xs italic py-6 text-center border border-dashed border-white/5 rounded-xl">No subjects added yet.</p>
              ) : (
                activeCourse.subjects.map((sub: any) => {
                  const facultyObj = teachers.find(t => 
                    t._id === sub.teacherId || 
                    (sub.teacherId && typeof sub.teacherId === 'object' && t._id === sub.teacherId._id) ||
                    (sub.facultyIds && Array.isArray(sub.facultyIds) && sub.facultyIds.includes(t.userId))
                  );
                  return (
                    <div 
                      key={sub._id}
                      className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-between hover:border-white/10 transition-colors"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block">{sub.subject_name}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{sub.subject_id}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Mentor</span>
                          <span className="text-[10px] text-[#2FA8CC] font-bold">{facultyObj ? facultyObj.name : 'Awaiting Allocation'}</span>
                        </div>
                        <button 
                          onClick={() => triggerDelete('subject', sub._id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM CONFIRMATION MODAL (No Alert system) --- */}
      {showConfirmModal && deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-6 text-center relative animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Confirm Deletion</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Are you absolutely sure? This action is permanent and will completely remove this {deleteTarget.type === 'course' ? 'Course and all its mapped subjects' : 'Subject'}.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={executeDelete}
                className="flex-grow h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
              >
                Delete
              </button>
              <button 
                onClick={() => {
                  setShowConfirmModal(false);
                  setDeleteTarget(null);
                }}
                className="px-6 h-12 border border-white/10 hover:bg-white/5 text-slate-300 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(47, 168, 204, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(47, 168, 204, 0.4);
        }
      `}</style>
    </div>
  );
}
