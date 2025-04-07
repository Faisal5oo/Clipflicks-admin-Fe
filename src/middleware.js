import { NextResponse } from 'next/server'
import cookie from 'cookie';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    console.log("Middleware triggered")
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const token = cookies.token;    
    const loggedInUserNotAccessiblePaths = request.nextUrl.pathname.startsWith('/login')

    if(loggedInUserNotAccessiblePaths){
        if(token){
            return NextResponse.redirect(new URL('/', request.url))
        }
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/users/:path*', '/videos/:path*', '/settings', '/notifications'],
}