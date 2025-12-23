import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/my-account'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Check for access token in cookies
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      // Redirect to signin page if not authenticated
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signinUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};