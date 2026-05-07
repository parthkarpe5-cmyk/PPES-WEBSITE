'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createDoubt, uploadImage, getSubjects, getTeachersForSubject } from '@/lib/api';
import Link from 'next/link';

export default function NewDoubt() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(searchParams.get('subject') || '');
  const [selectedTeacher, setSelectedTeacher] = useState<string>(searchParams.get('teacher') || '');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsData = await getSubjects();
        setSubjects(subjectsData);
        setPageLoading(false);

        // If subject is pre-selected, fetch its teachers
        if (selectedSubject) {
          const teachersData = await getTeachersForSubject(selectedSubject);
          setTeachers(teachersData);
        }
      } catch (err) {
        console.error('Failed to load subjects/teachers', err);
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    setSelectedTeacher('');

    if (subjectId) {
      try {
        const teachersData = await getTeachersForSubject(subjectId);
        setTeachers(teachersData);
      } catch (err) {
        console.error('Failed to load teachers', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !text.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!selectedSubject) {
      setError('Please select a subject');
      return;
    }

    if (!selectedTeacher) {
      setError('Please select a teacher');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      if (file) {
        imageUrl = await uploadImage(file);
      }

      const newDoubt = await createDoubt({
        title,
        subject_id: selectedSubject,
        teacher_id: selectedTeacher,
        initial_message: {
          text,
          image_url: imageUrl,
        },
      });

      if (newDoubt.success) {
        router.push(`/doubts/${newDoubt.doubt.id}`);
      } else {
        setError(newDoubt.message || 'Failed to create doubt.');
      }
    } catch (err: any) {
      console.error('Failed to create doubt:', err);
      setError(err?.response?.data?.message || 'Failed to create doubt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="p-8 text-center flex justify-center items-center h-screen"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <Link href="/doubts" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 inline-block">
          ← Back to Doubts
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Ask a New Doubt</h1>
        <p className="text-slate-600 mb-8">Choose a subject and teacher, then describe your doubt</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select a subject...</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Teacher <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              disabled={!selectedSubject}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="">
                {selectedSubject ? 'Select a teacher...' : 'Please select a subject first'}
              </option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doubt Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Doubt Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g., How does photosynthesis work?"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y"
              placeholder="Describe your doubt in detail..."
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Attachment (Optional, JPG/PNG max 2MB)
            </label>
            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !text.trim() || !selectedSubject || !selectedTeacher}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Submitting...' : 'Ask Doubt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
