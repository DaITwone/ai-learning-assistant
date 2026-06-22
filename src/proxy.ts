// src/middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const isAuthRoute = nextUrl.pathname.startsWith("/login") || 
                      nextUrl.pathname.startsWith("/register");
  const isProtectedRoute = nextUrl.pathname.startsWith("/chat") ||
                           nextUrl.pathname.startsWith("/quizzes") ||
                           nextUrl.pathname.startsWith("/notes") ||
                           nextUrl.pathname.startsWith("/roadmap");

  // Chưa đăng nhập -> vào protected route -> redirect login
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Đã đăng nhập -> vào auth route -> redirect chat
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/chat", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};