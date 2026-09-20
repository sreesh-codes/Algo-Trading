import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!token.isActive) {
      return NextResponse.redirect(new URL("/login?error=account_disabled", req.url));
    }

    if (path.startsWith("/admin") && token.role !== "ADMIN") {
      // Create a 403 response or redirect to dashboard
      return new NextResponse(
        "403 - FORBIDDEN. Admins only.",
        { status: 403, headers: { "content-type": "text/plain" } }
      );
    }

    // Protect candidate-only routes from admins if needed
    const candidateRoutes = ["/competition", "/submissions", "/markets"];
    const isCandidateRoute = candidateRoutes.some(r => path.startsWith(r));
    
    if (isCandidateRoute && token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/competition/:path*",
    "/submissions/:path*",
    "/markets/:path*",
    "/profile/:path*"
  ]
};
