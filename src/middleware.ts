import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use Edge-compatible auth config (no Prisma)
const { auth } = NextAuth(authConfig);

export const middleware = auth;

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
