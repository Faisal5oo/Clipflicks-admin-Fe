// import { NextResponse } from 'next/server';
// import cookie from 'cookie';

// export function middleware(request) {
//     console.log("Middleware triggered");

//     // Safely parse cookies. If no cookies exist, it returns an empty object.
//     let cookies = {};
//     try {
//         cookies = cookie.parse(request.headers.get('cookie') || '');
//     } catch (error) {
//         console.error("Error parsing cookies:", error);
//     }

//     const token = cookies.token;
//     const loggedInUserNotAccessiblePaths = request.nextUrl.pathname.startsWith('/login');

//     // Redirect logged-in users from the /login page to the homepage
//     if (loggedInUserNotAccessiblePaths && token) {
//         return NextResponse.redirect(new URL('/', request.url));
//     }

//     // Define manually protected routes
//     const protectedPaths = [
//         '/', 
//         '/users', 
//         '/videos', 
//         '/users/:id*', 
//         '/videos/:id*',
//         '/settings', 
//         '/notifications'
//     ];

//     // Check if the request path is in the protectedPaths and if the user has no token
//     if (protectedPaths.includes(request.nextUrl.pathname)) {
//         if (!token) {
//             // If no token, redirect to login page
//             return NextResponse.redirect(new URL('/login', request.url));
//         }
//     }

//     // Allow the request to continue if no issues
//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/', 
//         '/login', 
//         '/users', 
//         '/videos', 
//         '/settings', 
//         '/notifications'
//     ],
// };

import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

export function middleware(request) {
    console.log("Middleware triggered");

    let cookies = {};
    try {
        const rawCookie = request.headers.get('cookie') || '';
        cookies = cookie.parse(rawCookie);
    } catch (error) {
        console.error("Error parsing cookies:", error);
    }

    const token = cookies.token;
    const isLoginPage = request.nextUrl.pathname.startsWith('/login');

    if (isLoginPage && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const protectedPaths = [
        '/', 
        '/users', 
        '/videos', 
        '/users/:id*', 
        '/videos/:id*',
        '/settings', 
        '/notifications'
    ];

    const currentPath = request.nextUrl.pathname;

    // Match static paths directly
    if (protectedPaths.includes(currentPath)) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Allow request if all good
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
