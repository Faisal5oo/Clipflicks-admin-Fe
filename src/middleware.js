import { NextResponse } from 'next/server';
import cookie from 'cookie';

export function middleware(request) {
    console.log("Middleware triggered");
    
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const token = cookies.token;
    
    const loggedInUserNotAccessiblePaths = request.nextUrl.pathname.startsWith('/login');

    // Redirect logged-in users from the /login page to the homepage
    if (loggedInUserNotAccessiblePaths) {
        if (token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Redirect users without a token trying to access protected paths
    const protectedPaths = ['/dashboard', '/users', '/videos', '/settings', '/notifications'];
    if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
        if (!token) {
            // If no token, redirect to login page
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Allow the request to continue if no issues
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/dashboard/:path*', '/users/:path*', '/videos/:path*', '/settings', '/notifications'],
};
