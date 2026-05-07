import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // 1. Define Protected Routes
  const protectedPaths = ['/student', '/admin', '/faculty', '/live'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    // Determine which login page to send them to
    let loginRole = 'student'; // Default
    if (pathname.startsWith('/admin')) loginRole = 'admin_login';
    else if (pathname.startsWith('/faculty')) loginRole = 'faculty';
    else if (pathname.startsWith('/student')) loginRole = 'student';
    else if (pathname.startsWith('/live')) loginRole = 'student'; // Students usually join live

    return NextResponse.redirect(new URL(`/login/${loginRole}`, req.url));
  }

  // 2. Role-Based Access Control (if token exists)
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role as string;

      // Prevent cross-dashboard access
      if (pathname.startsWith('/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/student', req.url));
      }
      if (pathname.startsWith('/faculty') && userRole !== 'faculty') {
        return NextResponse.redirect(new URL('/student', req.url));
      }

      // If they are on a login page but already have a valid token, send them to their dashboard
      if (pathname.startsWith('/login')) {
        const dashboard = userRole === 'admin' ? '/admin' : userRole === 'faculty' ? '/faculty' : '/student';
        return NextResponse.redirect(new URL(dashboard, req.url));
      }

    } catch (err) {
      // Invalid token - clear it and go to root
      const response = NextResponse.redirect(new URL('/', req.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/student/:path*', 
    '/admin/:path*', 
    '/faculty/:path*', 
    '/live/:path*',
    '/login/:path*'
  ],
};