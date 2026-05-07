"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  // Roles: ADMIN, TEACHER, PAID_STUDENT, UNPAID_STUDENT
  const [role, setRole] = useState('UNPAID_STUDENT');
  const router = useRouter();

  // In a real app, this would be an API call to verify the session
  useEffect(() => {
    const savedRole = localStorage.getItem('mockRole');
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const changeRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('mockRole', newRole);
    router.push('/');
  };

  return (
    <RoleContext.Provider value={{ role, changeRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
