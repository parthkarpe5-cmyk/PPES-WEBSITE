import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';
import { jwtVerify } from 'jose'; // Use jose for middleware as it's Edge compatible

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  // 1. If trying to access role routes but no token, go to respective login
  const protectedRoutes = ['/admin', '/faculty', '/student', '/dashboard'];
  const isProtectedRoute = protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path));

  if (isProtectedRoute && !token) {
    const role = protectedRoutes.find(path => req.nextUrl.pathname.startsWith(path))?.replace('/', '');
    // If it's a generic dashboard or specific role, redirect to login
    if (role && role !== 'dashboard') {
      const loginPath = role === 'admin' ? 'admin_login' : role;
      return NextResponse.redirect(new URL(`/login/${loginPath}`, req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;

      // 2. Prevent role mismatch (e.g., student in /admin dashboard)
      if (req.nextUrl.pathname.startsWith('/dashboard/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard/student', req.url));
      }

      if (req.nextUrl.pathname.startsWith('/dashboard/faculty') && role !== 'faculty') {
        return NextResponse.redirect(new URL('/dashboard/student', req.url));
      }

    } catch (err) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/faculty/:path*', '/student/:path*'], // Secure all dashboard routes
};