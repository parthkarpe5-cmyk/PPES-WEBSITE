"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  // Roles: ADMIN, TEACHER, PAID_STUDENT, UNPAID_STUDENT
  const [role, setRole] = useState('UNPAID_STUDENT');
  const router = useRouter();

  useEffect(() => {
    // 1. Check localStorage for manual overrides
    const savedRole = localStorage.getItem('mockRole');
    if (savedRole) {
      setRole(savedRole);
      return;
    }

    // 2. Fallback: Sync with login cookies if available
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const userDataStr = getCookie('user-data');
    if (userDataStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataStr));
        if (userData.role) {
          // Normalize backend roles to the God Mode page expectations
          const normalizedRole = userData.role.toUpperCase();
          setRole(normalizedRole);
        }
      } catch (e) {
        console.error("Failed to parse user-data cookie", e);
      }
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
