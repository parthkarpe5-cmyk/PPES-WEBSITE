"use client";
import React, { useState, useEffect } from 'react';
import { useRole } from '@/components/RoleContext';

export default function AdminDashboard() {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState('COURSES');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', price: 0, isPublished: false });
  
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [newSubject, setNewSubject] = useState({ name: '', teacherId: '' });

  const fetchData = () => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => setCourses(Array.isArray(data) ? data : []));
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (role !== 'ADMIN') {
    return (
      <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2 style={{ color: '#ef4444' }}>Access Denied</h2>
        <p>You do not have permission to view the God Mode dashboard.</p>
      </div>
    );
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        setShowCourseModal(false);
        setNewCourse({ title: '', description: '', price: 0, isPublished: false });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await fetch(`http://localhost:5000/api/courses/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubject.name, courseId: activeCourseId, teacherId: newSubject.teacherId || null })
      });
      if (res.ok) {
        setShowSubjectModal(false);
        setNewSubject({ name: '', teacherId: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm('Delete subject?')) return;
    try {
      await fetch(`http://localhost:5000/api/subjects/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePaid = async (userId, isCurrentlyPaid) => {
    // For prototype, we just unlock the first course. In real app, we pass specific courseId
    if (courses.length === 0) return alert('No courses available to unlock');
    const courseId = courses[0]._id;
    try {
      await fetch(`http://localhost:5000/api/users/${userId}/unlock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, isUnlocked: !isCurrentlyPaid })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard <span className="badge badge-warning">God Mode</span></h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'COURSES' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('COURSES')}
        >
          Courses Management
        </button>
        <button 
          className={`btn ${activeTab === 'USERS' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('USERS')}
        >
          User Management
        </button>
      </div>

      {activeTab === 'COURSES' && (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {courses.map(course => (
            <div key={course._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{course.title}</h3>
                <button onClick={() => handleDeleteCourse(course._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>✖</button>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{course.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{course.price}</span>
                <span className={`badge ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Subjects ({course.subjects?.length || 0})</p>
                  <button 
                    onClick={() => { setActiveCourseId(course._id); setShowSubjectModal(true); }}
                    className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  >+ Add Subject</button>
                </div>
                <ul style={{ listStyleType: 'none', fontSize: '0.875rem' }}>
                  {course.subjects?.map(s => {
                    const assignedTeacher = users.find(u => u._id === s.teacherId);
                    return (
                    <li key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                      <span>- {s.name} {assignedTeacher ? <span style={{color: 'var(--primary)', fontSize: '0.75rem'}}>(Teacher: {assignedTeacher.name})</span> : <span style={{color: '#ef4444', fontSize: '0.75rem'}}>(Unassigned)</span>}</span>
                      <button onClick={() => handleDeleteSubject(s._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Del</button>
                    </li>
                  )})}
                </ul>
              </div>
            </div>
          ))}
          <div 
            className="card" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', cursor: 'pointer', border: '2px dashed var(--border)' }}
            onClick={() => setShowCourseModal(true)}
          >
            <span style={{ fontSize: '3rem', color: 'var(--border)' }}>+ New Course</span>
          </div>
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="card">
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem 0' }}>Name</th>
                <th style={{ padding: '1rem 0' }}>Email</th>
                <th style={{ padding: '1rem 0' }}>Role</th>
                <th style={{ padding: '1rem 0' }}>Access Control</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const isPaid = user.unlockedCourses?.length > 0;
                return (
                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 0' }}>{user.name}</td>
                  <td style={{ padding: '1rem 0', color: 'var(--text-muted)' }}>{user.email}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span className={`badge ${user.role === 'ADMIN' ? 'badge-warning' : user.role === 'TEACHER' ? 'badge-primary' : 'badge-success'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    {user.role === 'STUDENT' ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                          type="checkbox" 
                          checked={isPaid} 
                          onChange={() => handleTogglePaid(user._id, isPaid)} 
                        />
                        <span style={{ fontSize: '0.875rem' }}>Paid (Unlock First Course)</span>
                      </label>
                    ) : (
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>N/A</span>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <form className="card" style={{ width: '400px' }} onSubmit={handleCreateCourse}>
            <h2>Create Course</h2>
            <div className="input-group">
              <label className="input-label">Title</label>
              <input required className="input-field" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea required className="input-field" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label">Price</label>
              <input required type="number" className="input-field" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: Number(e.target.value)})} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input type="checkbox" checked={newCourse.isPublished} onChange={e => setNewCourse({...newCourse, isPublished: e.target.checked})} />
              <span>Published</span>
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowCourseModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <form className="card" style={{ width: '400px' }} onSubmit={handleAddSubject}>
            <h2>Add Subject</h2>
            <div className="input-group">
              <label className="input-label">Subject Name</label>
              <input required className="input-field" value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="input-label">Assign Teacher</label>
              <select 
                className="input-field" 
                value={newSubject.teacherId} 
                onChange={e => setNewSubject({ ...newSubject, teacherId: e.target.value })}
              >
                <option value="">Unassigned</option>
                {users.filter(u => u.role === 'TEACHER').map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowSubjectModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
