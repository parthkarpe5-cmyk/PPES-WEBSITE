"use client";
import React, { useState, useEffect } from 'react';
import { useRole } from '@/components/RoleContext';

export default function TeacherDashboard() {
  const { role } = useRole();
  const [courses, setCourses] = useState([]);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [uploadData, setUploadData] = useState({ title: '', file: null });

  const [users, setUsers] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState(null);

  const fetchData = () => {
    Promise.all([
      fetch('http://localhost:5000/api/courses').then(res => res.json()),
      fetch('http://localhost:5000/api/users').then(res => res.json())
    ]).then(([coursesData, usersData]) => {
      const teachers = Array.isArray(usersData) ? usersData.filter(u => u.role === 'TEACHER') : [];
      // For prototype, just pick the first teacher as the "logged in" teacher
      const me = teachers[0];
      setCurrentTeacher(me);
      
      if (me && Array.isArray(coursesData)) {
        // Filter courses to only show subjects assigned to this teacher
        const filteredCourses = coursesData.map(course => {
          return {
            ...course,
            subjects: (course.subjects || []).filter(sub => sub.teacherId === me._id)
          };
        }).filter(course => course.subjects.length > 0); // Only show courses where teacher has subjects
        
        setCourses(filteredCourses);
      } else {
        setCourses([]);
      }
    }).catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (role !== 'TEACHER' && role !== 'ADMIN') {
    return (
      <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2 style={{ color: '#ef4444' }}>Access Denied</h2>
        <p>You do not have permission to view the Teacher dashboard.</p>
      </div>
    );
  }

  const handleUploadClick = (subjectId) => {
    setActiveSubjectId(subjectId);
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('subjectId', activeSubjectId);
    formData.append('file', uploadData.file);

    try {
      const res = await fetch('http://localhost:5000/api/materials', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setShowUploadModal(false);
        setUploadData({ title: '', file: null });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    try {
      await fetch(`http://localhost:5000/api/materials/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Teacher Dashboard <span className="badge badge-primary">Dynamic Uploading</span></h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage materials for your assigned subjects.</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {courses.map(course => (
          <div key={course._id} className="card">
            <h2>{course.title}</h2>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {course.subjects?.map(subject => (
                <div key={subject._id} className="glass" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 0 }}>{subject.name}</h3>
                    <button 
                      onClick={() => handleUploadClick(subject._id)}
                      className="btn btn-primary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                      + Upload Material
                    </button>
                  </div>
                  
                  {subject.materials?.length > 0 && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                      <ul style={{ listStyleType: 'none' }}>
                        {subject.materials.map(material => (
                          <li key={material._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              📄 {material.title} 
                              <a href={`http://localhost:5000${material.url}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginLeft: '0.5rem' }}>(View File)</a>
                            </span>
                            <button 
                              onClick={() => handleDeleteMaterial(material._id)}
                              className="btn btn-outline" 
                              style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: '#ef4444', borderColor: '#ef4444' }}
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <form className="card" style={{ width: '400px' }} onSubmit={handleUploadSubmit}>
            <h2>Upload Material</h2>
            <div className="input-group">
              <label className="input-label">Title</label>
              <input required className="input-field" value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} />
            </div>
            <div className="input-group">
              <label className="input-label">File (PDF/Image)</label>
              <input required type="file" className="input-field" onChange={e => setUploadData({...uploadData, file: e.target.files[0]})} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Upload</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowUploadModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
