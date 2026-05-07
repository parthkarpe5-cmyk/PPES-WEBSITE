"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  const pathParts = pathname.split('/').filter(p => p);

  return (
    <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
      <Link href="/" style={{ color: 'var(--primary)' }}>Courses</Link>
      {pathParts.map((part, idx) => {
        const href = `/${pathParts.slice(0, idx + 1).join('/')}`;
        const isLast = idx === pathParts.length - 1;
        const formattedPart = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');

        return (
          <React.Fragment key={href}>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            {isLast ? (
              <span style={{ color: 'var(--text-main)' }}>{formattedPart}</span>
            ) : (
              <Link href={href} style={{ color: 'var(--primary)' }}>{formattedPart}</Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
