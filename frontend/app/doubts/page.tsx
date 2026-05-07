'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSubjects, getTeachersForSubject, getDoubts, MOCK_USER } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, BookOpen, Users } from 'lucide-react';

export default function DoubtsDashboard() {
  const isTeacher = MOCK_USER.role === 'teacher';
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(isTeacher ? MOCK_USER.id : null);
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'unanswered'>('all');

  useEffect(() => {
    if (isTeacher) {
      fetchTeacherSubjectsAndDoubts();
    } else {
      fetchSubjects();
    }
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await getSubjects();
      setSubjects(data);
      setSelectedSubject(null);
      setSelectedTeacher(null);
      setTeachers([]);
      setDoubts([]);
    } catch (error) {
      console.error('Failed to load subjects', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherSubjectsAndDoubts = async () => {
    try {
      setLoading(true);
      const allSubjects = await getSubjects();
      // keep only subjects that include this teacher
      const mySubjects = allSubjects.filter((s: any) => Array.isArray(s.teachers) && s.teachers.includes(MOCK_USER.id));
      setSubjects(mySubjects);
      setSelectedSubject(null);
      setTeachers([]);
      // fetch doubts assigned to this teacher
      const doubtsData = await getDoubts({ teacher_id: MOCK_USER.id });
      setDoubts(doubtsData);
    } catch (error) {
      console.error('Failed to load teacher subjects/doubts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubject = async (subjectId: string) => {
    try {
      setSelectedSubject(subjectId);
      setSelectedTeacher(null);
      setLoading(true);
      const teachersData = await getTeachersForSubject(subjectId);
      setTeachers(teachersData);
      setDoubts([]);
    } catch (error) {
      console.error('Failed to load teachers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeacher = async (teacherId: string) => {
    try {
      setSelectedTeacher(teacherId);
      setLoading(true);
      const doubtsData = await getDoubts({ subject_id: selectedSubject || undefined, teacher_id: teacherId });
      setDoubts(doubtsData);
    } catch (error) {
      console.error('Failed to load doubts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSubjectFilter = async (subjectId: string | null) => {
    try {
      setSelectedSubject(subjectId);
      setLoading(true);
      const params: any = { teacher_id: MOCK_USER.id };
      if (subjectId) params.subject_id = subjectId;
      const doubtsData = await getDoubts(params);
      setDoubts(doubtsData);
    } catch (err) {
      console.error('Failed to filter doubts for teacher', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoubts = doubts.filter((doubt) => {
    if (filter === 'open') return doubt.status === 'open';
    if (filter === 'resolved') return doubt.status === 'resolved';
    if (filter === 'unanswered') return doubt.status === 'open' && !doubt.assigned_teacher_id;
    return true;
  });

  if (loading && !isTeacher && !selectedSubject) {
    return <div className="p-8 text-center flex justify-center items-center h-screen"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Doubts & Questions</h1>
          <p className="text-slate-600">Select a subject and teacher to view and ask doubts</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {isTeacher ? (
          // Teacher view: subject filter + list of doubts assigned to this teacher
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Doubts Assigned To You</h2>
                <p className="text-sm text-slate-500">Filter by subject to narrow down doubts</p>
              </div>
            </div>

            <div className="mb-6">
              <select
                value={selectedSubject || ''}
                onChange={(e) => handleTeacherSubjectFilter(e.target.value || null)}
                className="w-64 px-4 py-2 border border-slate-300 rounded-lg"
              >
                <option value="">All subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : filteredDoubts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
                  <p className="text-slate-500">No doubts assigned to you{selectedSubject ? ' for this subject' : ''}.</p>
                </div>
              ) : (
                filteredDoubts.map((doubt) => (
                  <Link key={doubt.id} href={`/doubts/${doubt.id}`} className="block bg-white p-6 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{doubt.title}</h3>
                        <p className="text-sm text-slate-600">Updated {formatDistanceToNow(new Date(doubt.updated_at || doubt.created_at))} ago</p>
                        <p className="text-xs text-slate-500 mt-1">Subject: {doubt.subject_id}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${doubt.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>{doubt.status.toUpperCase()}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        ) : (
          // Student flow (unchanged)
          (!selectedSubject ? (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Select a Subject
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <button key={subject.id} onClick={() => handleSelectSubject(subject.id)} className="group bg-white p-6 rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:shadow-md transition text-left">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center justify-between">
                      {subject.name}
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition" />
                    </h3>
                    <p className="text-sm text-slate-600">{subject.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : !selectedTeacher ? (
            <div>
              <button onClick={fetchSubjects} className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6">← Back to Subjects</button>

              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Users className="h-5 w-5" />Teachers in {subjects.find(s => s.id === selectedSubject)?.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teachers.map((teacher) => (
                  <button key={teacher.id} onClick={() => handleSelectTeacher(teacher.id)} className="group bg-white p-6 rounded-lg border-2 border-slate-200 hover:border-blue-500 hover:shadow-md transition text-left">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 flex items-center justify-between">{teacher.name}<ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition" /></h3>
                    <p className="text-sm text-slate-600">{teacher.email}</p>
                    <p className="text-xs text-slate-500 mt-2">Subjects: {teacher.subjects.join(', ')}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
                <button onClick={fetchSubjects} className="text-blue-600 hover:text-blue-700 font-medium">Subjects</button>
                <ChevronRight className="h-4 w-4" />
                <button onClick={() => { setSelectedSubject(null); setSelectedTeacher(null); }} className="text-blue-600 hover:text-blue-700 font-medium">{subjects.find(s => s.id === selectedSubject)?.name}</button>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-slate-900">{teachers.find(t => t.id === selectedTeacher)?.name}</span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Doubts with {teachers.find(t => t.id === selectedTeacher)?.name}</h2>
                {MOCK_USER.role === 'student' && (
                  <Link href={`/doubts/new?subject=${selectedSubject}&teacher=${selectedTeacher}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">Ask a Doubt</Link>
                )}
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {(['all', 'open', 'resolved', 'unanswered'] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                ) : filteredDoubts.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-lg border border-slate-200"><p className="text-slate-500 mb-4">No doubts found.</p>{MOCK_USER.role === 'student' && (<Link href={`/doubts/new?subject=${selectedSubject}&teacher=${selectedTeacher}`} className="text-blue-600 font-medium hover:underline">Ask your first doubt with this teacher</Link>)}</div>
                ) : (
                  filteredDoubts.map((doubt) => (
                    <Link key={doubt.id} href={`/doubts/${doubt.id}`} className="block bg-white p-6 rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{doubt.title}</h3>
                          <p className="text-sm text-slate-600">Updated {formatDistanceToNow(new Date(doubt.updated_at || doubt.created_at))} ago</p>
                        </div>
                        <div className="flex flex-col items-end gap-2"><span className={`px-3 py-1 rounded-full text-xs font-medium ${doubt.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>{doubt.status.toUpperCase()}</span></div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
