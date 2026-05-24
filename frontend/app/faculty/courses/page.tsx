'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  Trash2, 
  UploadCloud, 
  X, 
  Loader2,
  ExternalLink,
  HelpCircle,
  Video
} from 'lucide-react';
import { getMyProfile } from '@/lib/api';

export default function FacultyCoursesPortal() {
  const [courses, setCourses] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [materialTitle, setMaterialTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const BACKEND_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProfileAndCourses();
  }, []);

  const fetchProfileAndCourses = async () => {
    setLoading(true);
    try {
      // 1. Fetch current logged in Faculty profile
      const prof = await getMyProfile();
      setFaculty(prof);

      // 2. Fetch all courses
      const res = await fetch(`${BACKEND_URL}/courses`);
      const coursesData = await res.json();

      if (prof && prof._id && Array.isArray(coursesData)) {
        // Filter courses to only show subjects mapped to this specific faculty member
        const mappedCourses = coursesData.map(course => {
          return {
            ...course,
            subjects: (course.subjects || []).filter((sub: any) => 
              (sub.teacherId === prof._id) || 
              (sub.teacherId && typeof sub.teacherId === 'object' && sub.teacherId._id === prof._id) ||
              (sub.facultyIds && Array.isArray(sub.facultyIds) && sub.facultyIds.includes(prof.userId))
            )
          };
        }).filter(course => course.subjects.length > 0);

        setCourses(mappedCourses);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Error fetching portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = (subjectId: string) => {
    setActiveSubjectId(subjectId);
    setMaterialTitle('');
    setFile(null);
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !materialTitle || !activeSubjectId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('title', materialTitle);
    formData.append('subjectId', activeSubjectId);
    formData.append('file', file);
    formData.append('type', file.type.includes('image') ? 'IMAGE' : 'PDF');

    try {
      const res = await fetch(`${BACKEND_URL}/materials`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setShowUploadModal(false);
        setMaterialTitle('');
        setFile(null);
        fetchProfileAndCourses();
      }
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this learning material?')) return;

    try {
      const res = await fetch(`${BACKEND_URL}/materials/${materialId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchProfileAndCourses();
      }
    } catch (err) {
      console.error('Error deleting material:', err);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-10 bg-[#050B14] min-h-screen text-slate-200 animate-in fade-in duration-500">
      
      {/* 1. Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1F4E79] to-[#0A101F] p-8 md:p-12 shadow-2xl border border-white/5">
        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2FA8CC]/10 text-[#2FA8CC] text-[10px] font-bold uppercase tracking-widest border border-[#2FA8CC]/20">
            Faculty Dashboard
          </span>
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 font-display">
              My Assigned <span className="text-[#2FA8CC]">Courses</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-lg">
              Manage study guides, upload lecture slideshows, and link textbooks to your assigned subjects.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2FA8CC]/5 blur-[120px] rounded-full" />
      </section>

      {/* 2. Main Content Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          Your Allocated Curriculum
          <span className="px-2 py-0.5 rounded-lg bg-white/5 text-xs text-slate-400 font-bold">{courses.length}</span>
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl space-y-4">
            <Loader2 className="h-8 w-8 text-[#2FA8CC] animate-spin" />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading Desk...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl max-w-2xl mx-auto">
            <HelpCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300 font-bold text-lg">No Subjects Assigned</p>
            <p className="text-slate-500 text-xs mt-1">You are currently not allocated to any subjects. Please contact administration for curriculum mapping.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {courses.map((course) => (
              <div 
                key={course._id} 
                className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl hover:border-white/10 transition-colors shadow-xl relative overflow-hidden"
              >
                {/* Course Header Banner */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-wider border border-white/5">
                      {course.course_id}
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1.5">{course.course_name}</h3>
                  </div>
                </div>

                {/* Subjects Column */}
                <div className="space-y-6">
                  {course.subjects.map((sub: any) => (
                    <div 
                      key={sub._id} 
                      className="p-5 bg-white/[0.01] border border-white/5 hover:border-[#2FA8CC]/20 rounded-2xl transition-all duration-300 relative group/sub"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-[#2FA8CC]/10 text-[#2FA8CC] border border-[#2FA8CC]/20 rounded-xl flex items-center justify-center">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white leading-none">{sub.subject_name}</h4>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 inline-block">{sub.subject_id}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleUploadClick(sub._id)}
                          className="h-10 px-5 bg-[#2FA8CC] hover:bg-[#2FA8CC]/80 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shrink-0 shadow-lg shadow-[#2FA8CC]/10 active:scale-95"
                        >
                          + Upload Material
                        </button>
                      </div>

                      {/* Materials List inside Subject */}
                      {(!sub.materials || sub.materials.length === 0) ? (
                        <p className="text-slate-500 text-xs italic py-4">No material resources uploaded yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {sub.materials.map((mat: any) => (
                            <div 
                              key={mat._id} 
                              className="p-4 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group/mat"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <FileText className="h-5 w-5 text-red-400 shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-white block truncate">{mat.title}</span>
                                  <a 
                                    href={`http://localhost:5000${mat.url}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[9px] text-[#2FA8CC] hover:underline font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1"
                                  >
                                    View Resource
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>

                              <button 
                                onClick={() => handleDeleteMaterial(mat._id)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL: UPLOAD FILE --- */}
      {showUploadModal && activeSubjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <UploadCloud className="text-[#2FA8CC]" />
                Publish Study Guide
              </h3>
              <p className="text-slate-400 text-xs mt-1">Upload educational PDFs or resource slides for this subject.</p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Material Title</label>
                <input 
                  required 
                  value={materialTitle}
                  onChange={e => setMaterialTitle(e.target.value)}
                  placeholder="e.g. Chapter 3: Electromagnetic induction"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#2FA8CC] transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Upload File (PDF or Image)</label>
                <div className="relative border-2 border-dashed border-white/10 hover:border-[#2FA8CC]/40 rounded-xl p-6 text-center cursor-pointer hover:bg-white/[0.01] transition-all group">
                  <input 
                    required 
                    type="file" 
                    accept="application/pdf, image/*"
                    onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="h-10 w-10 text-slate-500 mx-auto mb-2 group-hover:text-[#2FA8CC] transition-colors" />
                  {file ? (
                    <span className="text-xs font-bold text-white truncate max-w-full block">{file.name}</span>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-slate-300 block">Select PDF or Image</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block mt-1">Supports up to 10MB</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex-1 h-12 bg-[#2FA8CC] hover:bg-[#2FA8CC]/90 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Publish Material'
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 h-12 border border-white/10 hover:bg-white/5 text-slate-300 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
