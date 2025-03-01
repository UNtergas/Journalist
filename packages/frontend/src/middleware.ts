import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { CONFIG } from "@/env.config";
import { ROLE, Role } from "@shared/frontend";

const JWT_SECRET = new TextEncoder().encode(CONFIG.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get("jwt");
  const { origin, pathname } = req.nextUrl;

  if (!cookie) {
    // Redirect unauthenticated users to the sign-in page
    if (pathname === "/signIn" || pathname === "/signUp" || pathname === "/reset-password") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/signIn", origin));
  }

  try {
    // Verify the JWT
    const { payload } = await jwtVerify(cookie.value, JWT_SECRET);
    const userRole = payload["role"] as Role;
   

    // Redirect authenticated users away from sign-in/sign-up
    if (pathname === "/signIn" || pathname === "/signUp") {
      let redirectUrl = "/";
      if (userRole === ROLE.USER) {
        redirectUrl = "/user";
      }
      const url = req.nextUrl.clone();
      url.pathname = redirectUrl;
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Invalid JWT:", err);
    return NextResponse.redirect(new URL("/signIn", origin));
  }
}

export const config = {
  matcher: [
    "/reset-password",
    "/signIn",
    "/signUp",
    "/user/:path*",
  ],
};

