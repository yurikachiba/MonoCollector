import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Edge-compatible auth config (no Prisma)
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        // This will be overridden in auth.ts with Prisma
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/login";
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      const isPublicPage =
        nextUrl.pathname === "/" ||
        nextUrl.pathname === "/terms" ||
        nextUrl.pathname === "/privacy";
      const isProtectedPage = nextUrl.pathname.startsWith("/collection");

      // API auth routes should always be accessible
      if (isApiAuthRoute) {
        return true;
      }

      // Public pages (home, terms, privacy) should always be accessible
      if (isPublicPage) {
        return true;
      }

      // Protected pages require login
      if (isProtectedPage && !isLoggedIn) {
        return false;
      }

      // Redirect to collection if logged in and on login page
      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/collection", nextUrl.origin));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isGuest = (user as { isGuest?: boolean }).isGuest ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isGuest = token.isGuest as boolean;
      }
      return session;
    },
  },
};
