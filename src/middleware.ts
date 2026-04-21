import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only check /admin/** routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Get session from cookie
  const supabaseCookie = request.cookies.get("sb-session")?.value;

  if (!supabaseCookie) {
    const response = NextResponse.redirect(new URL("/?error=unauthorized", request.url));
    return response;
  }

  try {
    // Parse the session cookie to get user email
    const session = JSON.parse(supabaseCookie);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      const response = NextResponse.redirect(new URL("/?error=unauthorized", request.url));
      return response;
    }

    // Check if email is in admin list
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) => email.trim()) || [];

    if (!adminEmails.includes(userEmail)) {
      const response = NextResponse.redirect(new URL("/?error=unauthorized", request.url));
      return response;
    }
  } catch {
    const response = NextResponse.redirect(new URL("/?error=unauthorized", request.url));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
