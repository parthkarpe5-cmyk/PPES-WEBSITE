"use client";

import React, { useState, useEffect } from 'react';
import { useRole } from '@/components/RoleContext';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Calendar, 
  BookOpen, 
  User, 
  IndianRupee, 
  Info,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export default function GodAdminDashboard() {
  const { role } = useRole();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal / Form State
  const [showModal, setShowModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState({
    course_name: '',
    course_id: '',
    course_start_date: '',
    course_description: '',
    price: 0,
    isPublished: false,
    subjects: [] // Array of { subject_name, subject_id, teacher_id }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/courses'),
        fetch('http://localhost:5000/api/users')
      ]);
      
      const coursesData = await coursesRes.json();
      const usersData = await usersRes.json();
      
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setUsers(Array.isArray(usersData) ? usersData.filter(u => u.role === 'TEACHER' || u.role === 'faculty') : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to sync data with server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/20">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-deepBlue mb-2">Access Denied</h2>
        <p className="text-foreground/60">You do not have permission to view the God Mode dashboard.</p>
      </div>
    );
  }

  const openCreateModal = () => {
    setEditingCourseId(null);
    setFormData({
      course_name: '',
      course_id: '',
      course_start_date: '',
      course_description: '',
      price: 0,
      isPublished: false,
      subjects: []
    });
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourseId(course._id);
    setFormData({
      course_name: course.course_name || course.title || '',
      course_id: course.course_id || '',
      course_start_date: course.course_start_date ? new Date(course.course_start_date).toISOString().split('T')[0] : '',
      course_description: course.course_description || course.description || '',
      price: course.price || 0,
      isPublished: course.isPublished || false,
      subjects: (course.subjects || []).map(s => ({
        _id: s._id,
        subject_name: s.subject_name || s.name || '',
        subject_id: s.subject_id || s.code || '',
        teacher_id: s.teacherId || s.teacher_id || ''
      }))
    });
    setShowModal(true);
  };

  const addSubjectField = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { subject_name: '', subject_id: '', teacher_id: '' }]
    });
  };

  const removeSubjectField = (index) => {
    const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index][field] = value;
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.course_name || !formData.course_id) {
      return toast.error("Course Name and ID are required");
    }

    try {
      const method = editingCourseId ? 'PUT' : 'POST';
      const url = editingCourseId 
        ? `http://localhost:5000/api/courses/${editingCourseId}`
        : 'http://localhost:5000/api/courses';

      const courseRes = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!courseRes.ok) throw new Error("Failed to save course");
      const savedCourse = await courseRes.json();
      const courseMongoId = editingCourseId || savedCourse._id;

      // Handle Subjects (Dynamic Creation/Linking)
      // For a production-level "God Admin", we ensure subjects are synced
      // Note: This prototype approach recreates/updates subjects linked to the course
      for (const subject of formData.subjects) {
        const subData = {
          ...subject,
          courseId: courseMongoId,
          course_id: formData.course_id,
          teacher_id: subject.teacher_id || null
        };

        if (subject._id) {
          // Update existing
          await fetch(`http://localhost:5000/api/subjects/${subject._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subData)
          });
        } else {
          // Create new
          await fetch('http://localhost:5000/api/subjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subData)
          });
        }
      }

      toast.success(editingCourseId ? "Course updated successfully" : "Course created successfully");
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course and all its subjects?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Course removed");
        fetchData();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-sky/10 pb-8">
        <div>
          <h1 className="text-4xl font-black text-deepBlue flex items-center gap-3 tracking-tighter">
            <span className="p-3 bg-sky/10 rounded-2xl text-sky">
              <ShieldCheck size={32} />
            </span>
            God-Admin <span className="text-sky/40 font-light text-2xl">| Systems Control</span>
          </h1>
          <p className="text-foreground/50 mt-2 font-medium">Full CRUD control over Courses, Subjects, and Academic Structures.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="group flex items-center gap-2 bg-sky text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-sky/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Create New Course
        </button>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-sky/5 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="glass-card group hover:bg-white transition-all duration-500">
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 bg-sky/10 text-sky text-[10px] font-black uppercase tracking-widest rounded-full">
                    {course.course_id || 'NO-ID'}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(course)} className="p-2 hover:bg-sky/10 text-sky rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDeleteCourse(course._id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-deepBlue mb-2 line-clamp-1">{course.course_name || course.title}</h3>
                <p className="text-foreground/60 text-sm line-clamp-2 mb-6 flex-grow">
                  {course.course_description || course.description || "No description provided."}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-foreground/40">
                      <BookOpen size={14} />
                      {course.subjects?.length || 0} Subjects
                    </span>
                    <span className="font-bold text-sky text-lg">
                      ₹{course.price}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-sky/5 flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${course.isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-saffron/10 text-saffron'}`}>
                      {course.isPublished ? 'Live' : 'Draft Mode'}
                    </span>
                    <span className="text-[10px] text-foreground/30 font-medium italic">
                      Start: {course.course_start_date ? new Date(course.course_start_date).toLocaleDateString() : 'TBA'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-10 md:p-20 bg-deepBlue/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[80vh] md:max-h-[85vh] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(0,0,0,0.3)] flex flex-col relative animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-sky/10 flex justify-between items-center bg-sky/5">
              <h2 className="text-2xl font-black text-deepBlue tracking-tight flex items-center gap-3">
                {editingCourseId ? <Edit className="text-sky" /> : <Plus className="text-sky" />}
                {editingCourseId ? 'Edit Course Module' : 'Configure New Course'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-sky/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 space-y-10">
              {/* Course Basics */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 text-sky font-black uppercase text-xs tracking-widest">
                  <Info size={14} />
                  Core Specifications
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-deepBlue/50 uppercase ml-2">Course Name</label>
                    <input 
                      required
                      className="form-input"
                      placeholder="e.g. Master Class 10"
                      value={formData.course_name}
                      onChange={e => setFormData({...formData, course_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-deepBlue/50 uppercase ml-2">Course Unique ID</label>
                    <input 
                      required
                      className="form-input"
                      placeholder="e.g. C10-2026"
                      value={formData.course_id}
                      onChange={e => setFormData({...formData, course_id: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-deepBlue/50 uppercase ml-2">Start Date</label>
                    <input 
                      type="date"
                      className="form-input"
                      value={formData.course_start_date}
                      onChange={e => setFormData({...formData, course_start_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-deepBlue/50 uppercase ml-2">Price (INR)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-sky/40" size={18} />
                      <input 
                        type="number"
                        className="form-input pl-12"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-deepBlue/50 uppercase ml-2">Course Description</label>
                  <textarea 
                    className="form-input min-h-[100px] py-4"
                    placeholder="Provide a detailed overview of the curriculum..."
                    value={formData.course_description}
                    onChange={e => setFormData({...formData, course_description: e.target.value})}
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-md border-2 border-sky/20 text-sky focus:ring-sky"
                    checked={formData.isPublished}
                    onChange={e => setFormData({...formData, isPublished: e.target.checked})}
                  />
                  <span className="text-sm font-bold text-deepBlue/70 group-hover:text-sky transition-colors">Publish this course immediately</span>
                </label>
              </section>

              {/* Dynamic Subjects */}
              <section className="space-y-6 pt-6 border-t border-sky/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sky font-black uppercase text-xs tracking-widest">
                    <BookOpen size={14} />
                    Curriculum Subjects
                  </div>
                  <button 
                    type="button"
                    onClick={addSubjectField}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-sky/10 text-sky px-4 py-2 rounded-full hover:bg-sky hover:text-white transition-all"
                  >
                    <Plus size={14} /> Add Subject
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.subjects.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-sky/10 rounded-3xl bg-sky/5">
                      <p className="text-foreground/40 text-sm italic font-medium">No subjects added yet. Start by clicking "+ Add Subject".</p>
                    </div>
                  )}
                  {formData.subjects.map((sub, index) => (
                    <div key={index} className="p-6 bg-white border border-sky/10 rounded-3xl shadow-sm space-y-4 animate-in slide-in-from-right-4 duration-300">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-sky/40 uppercase tracking-widest">Subject Entry #{index + 1}</span>
                        <button 
                          type="button" 
                          onClick={() => removeSubjectField(index)}
                          className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-deepBlue/40 uppercase ml-1">Name</label>
                          <input 
                            placeholder="e.g. Advanced Maths"
                            className="form-input h-12 text-sm"
                            value={sub.subject_name}
                            onChange={e => handleSubjectChange(index, 'subject_name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-deepBlue/40 uppercase ml-1">Unique ID</label>
                          <input 
                            placeholder="e.g. MATH-101"
                            className="form-input h-12 text-sm"
                            value={sub.subject_id}
                            onChange={e => handleSubjectChange(index, 'subject_id', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-deepBlue/40 uppercase ml-1">Faculty Mentor</label>
                          <select 
                            className="form-input h-12 text-sm appearance-none"
                            value={sub.teacher_id}
                            onChange={e => handleSubjectChange(index, 'teacher_id', e.target.value)}
                          >
                            <option value="">Unassigned</option>
                            {users.map(u => (
                              <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </form>

            {/* Modal Footer */}
            <div className="p-8 border-t border-sky/10 bg-white flex gap-4">
              <button 
                type="submit" 
                onClick={handleSubmit}
                className="flex-grow bg-deepBlue text-white py-5 rounded-[1.25rem] font-black uppercase tracking-widest hover:bg-sky shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <Save size={20} />
                {editingCourseId ? 'Commit Changes' : 'Initialize Module'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="px-10 border-2 border-sky/20 text-sky font-black uppercase tracking-widest rounded-[1.25rem] hover:bg-sky/5 transition-all"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled JSX for the custom form elements */}
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(47, 168, 204, 0.1);
          border-radius: 2rem;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
        }
        .form-input {
          width: 100%;
          height: 3.5rem;
          background: #f8fafc;
          border: 2px solid rgba(47, 168, 204, 0.1);
          border-radius: 1rem;
          padding: 0 1.25rem;
          color: #0f172a;
          font-weight: 500;
          outline: none;
          transition: all 0.3s ease;
        }
        .form-input:focus {
          border-color: #2FA8CC;
          background: white;
          box-shadow: 0 0 0 4px rgba(47, 168, 204, 0.1);
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

