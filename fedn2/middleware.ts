import { NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_PREFIX = "/admin";

// Protect all /admin routes so only ADMIN role can pass
export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();

  const role = (req.auth as any)?.user?.role;

  if (!role || role.toUpperCase() !== "ADMIN") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
