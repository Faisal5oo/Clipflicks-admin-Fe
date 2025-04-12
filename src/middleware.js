import { NextResponse } from 'next/server';
import cookie from 'cookie';

export function middleware(request) {
    console.log("Middleware triggered");

    // Safely parse cookies. If no cookies exist, it returns an empty object.
    let cookies = {};
    try {
        cookies = cookie.parse(request.headers.get('cookie') || '');
    } catch (error) {
        console.error("Error parsing cookies:", error);
    }

    const token = cookies.token;
    const loggedInUserNotAccessiblePaths = request.nextUrl.pathname.startsWith('/login');

    // Redirect logged-in users from the /login page to the homepage
    if (loggedInUserNotAccessiblePaths && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Define manually protected routes
    const protectedPaths = [
        '/', 
        '/users', 
        '/videos', 
        '/users/:id*', 
        '/videos/:id*',
        '/settings', 
        '/notifications'
    ];

    // Check if the request path is in the protectedPaths and if the user has no token
    if (protectedPaths.includes(request.nextUrl.pathname)) {
        if (!token) {
            // If no token, redirect to login page
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Allow the request to continue if no issues
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/', 
        '/login', 
        '/users', 
        '/videos', 
        '/settings', 
        '/notifications'
    ],
};
