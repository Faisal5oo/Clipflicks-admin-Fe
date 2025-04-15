import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;

  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // Allow access to login page
  if (isLoginPage) return NextResponse.next();

  // If not authenticated, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',                 // home
    '/users/:path*',     // /users and /users/[id]
    '/videos/:path*',    // /videos and /videos/[id]
    '/settings',
    '/notifications',
  ],
};
