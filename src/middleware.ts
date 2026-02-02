import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import type { NextRequest } from "next/server";

// Use Edge-compatible auth config (no Prisma)
const { auth } = NextAuth(authConfig);

export default async function middleware(request: NextRequest) {
  return auth(request as any);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
