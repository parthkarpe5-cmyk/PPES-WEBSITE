"use client";
import React, { useState, useEffect } from 'react';
import { useRole } from '@/components/RoleContext';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function CourseDetails({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const { role } = useRole();
  const [course, setCourse] = useState(null);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!course) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading course...</div>;

  const handleMaterialClick = (material) => {
    if (role === 'PAID_STUDENT' || role === 'ADMIN' || role === 'TEACHER') {
      setActiveMaterial(material);
    } else {
      setShowPaywall(true);
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumbs />
      
      <div className="card" style={{ marginBottom: '3rem', border: 'none', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{course.title}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{course.description}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>
              ₹{course.price}
            </div>
            {role === 'UNPAID_STUDENT' && (
              <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                Buy Now
              </button>
            )}
            {role === 'PAID_STUDENT' && (
              <span className="badge badge-success" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                Enrolled
              </span>
            )}
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Course Content</h2>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {course.subjects?.map((subject, index) => (
          <div key={subject._id} className="glass" style={{ padding: '1.5rem', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>{index + 1}.</span> {subject.name}
            </h3>
            
            {subject.materials?.length > 0 ? (
              <ul style={{ listStyleType: 'none', display: 'grid', gap: '0.5rem' }}>
                {subject.materials.map(material => (
                  <li 
                    key={material._id}
                    onClick={() => handleMaterialClick(material)}
                    style={{ 
                      padding: '1rem', 
                      background: 'rgba(0,0,0,0.2)', 
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: '1px solid transparent',
                      transition: 'border-color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: '#ef4444' }}>📄</span> {material.title}
                    </span>
                    {role === 'UNPAID_STUDENT' ? (
                      <span style={{ color: 'var(--text-muted)' }}>🔒 Locked</span>
                    ) : (
                      <span style={{ color: 'var(--primary)' }}>👁️ View</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No materials uploaded yet.</p>
            )}
          </div>
        ))}
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', textAlign: 'center', position: 'relative' }}>
            <button 
              onClick={() => setShowPaywall(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)', fontSize: '1.5rem' }}
            >
              ×
            </button>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
            <h2 style={{ marginBottom: '1rem' }}>Unlock This Course</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              To view "{course.title}" materials, you need to purchase the course. Join thousands of students already learning!
            </p>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
              Pay ₹{course.price} to Unlock
            </button>
          </div>
        </div>
      )}

      {/* Secure Viewer Modal */}
      {activeMaterial && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '1rem 1.5rem', background: '#1e293b', borderBottom: '1px solid #334155' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => setActiveMaterial(null)} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }}>
                ← Back
              </button>
              <h3 style={{ margin: 0 }}>{activeMaterial.title}</h3>
            </div>
            <span className="badge badge-warning">Secure View Mode</span>
          </div>
          
          <div 
            style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#334155' }}
            onContextMenu={(e) => e.preventDefault()} // Disable right-click
            onKeyDown={(e) => {
              // Intercept common print/save shortcuts
              if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'c')) {
                e.preventDefault();
                alert('This action is disabled for security reasons.');
              }
            }}
            tabIndex="0" // Needed for keydown on div
          >
            {/* Watermark overlay */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexWrap: 'wrap', opacity: 0.1, pointerEvents: 'none',
              overflow: 'hidden', zIndex: 10
            }}>
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} style={{ padding: '4rem', transform: 'rotate(-45deg)', fontSize: '1.5rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {role === 'PAID_STUDENT' ? 'Student@example.com' : role}
                </div>
              ))}
            </div>

            <div style={{ background: 'white', width: '80%', height: '90%', color: 'black', boxShadow: '0 0 20px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #ccc', background: '#f8fafc', color: '#0f172a' }}>
                <h4 style={{ margin: 0 }}>{activeMaterial.title}</h4>
                <p style={{ fontSize: '0.75rem', margin: 0, color: '#64748b' }}>Secure View - Right click and printing disabled</p>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <iframe 
                  src={`http://localhost:5000${activeMaterial.url}#toolbar=0`} 
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title={activeMaterial.title}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
