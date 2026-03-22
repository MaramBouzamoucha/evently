import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // 🔴 NON CONNECTÉ → redirect login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 🔐 ADMIN uniquement
    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/access-denied", req.url));
    }

    // 🔐 ORGANIZER ou ADMIN
    if (
      pathname.startsWith("/organizer") &&
      token.role !== "ORGANIZER" &&
      token.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/access-denied", req.url));
    }

    // 🔐 PROFILE → juste connecté
    if (pathname.startsWith("/profile") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // ⚠️ important → on gère nous-même les règles
    },
  }
);

// 📌 Routes protégées
export const config = {
  matcher: [
    "/admin/:path*",
    "/organizer/:path*",
    "/profile",
  ],
};