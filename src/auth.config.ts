import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Log auth configuration status (only once at module load)
if (typeof process !== 'undefined') {
  console.log("[AUTH CONFIG] Initializing NextAuth configuration...");
  if (!process.env.AUTH_SECRET) {
    console.error("[AUTH CONFIG] ERROR: AUTH_SECRET is not set!");
    console.error("[AUTH CONFIG] This will cause 'Configuration' errors during login.");
    console.error("[AUTH CONFIG] Generate a secret with: openssl rand -base64 32");
  } else {
    console.log("[AUTH CONFIG] AUTH_SECRET is configured");
  }
  if (!process.env.DATABASE_URL) {
    console.error("[AUTH CONFIG] ERROR: DATABASE_URL is not set!");
    console.error("[AUTH CONFIG] Database connection will fail.");
  }
}

// Build providers array conditionally
// NOTE: CredentialsProvider is NOT included here because it causes "Configuration"
// errors when loaded in Edge Runtime (middleware). It's added only in auth.ts
// which runs in Node.js runtime.
const providers: NextAuthConfig["providers"] = [];

// Only add Google provider if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Edge-compatible auth config (no Prisma)
export const authConfig: NextAuthConfig = {
  debug: true,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login page with error
  },
  providers,
  logger: {
    error(code, ...message) {
      console.error("[AUTH ERROR]", code, JSON.stringify(message, null, 2));
    },
    warn(code, ...message) {
      console.warn("[AUTH WARN]", code, JSON.stringify(message, null, 2));
    },
    debug(code, ...message) {
      console.log("[AUTH DEBUG]", code, JSON.stringify(message, null, 2));
    },
  },
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
      const isAdminPage = nextUrl.pathname.startsWith("/admin");
      const isAdminApi = nextUrl.pathname.startsWith("/api/admin");

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

      // Admin pages/APIs require admin email
      if (isAdminPage || isAdminApi) {
        const adminEmails = process.env.ADMIN_EMAIL?.split(",").map(e => e.trim()) || [];
        const userEmail = auth?.user?.email;
        if (!isLoggedIn || !userEmail || !adminEmails.includes(userEmail)) {
          return Response.redirect(new URL("/collection", nextUrl.origin));
        }
      }

      // Redirect to collection if logged in and on login page
      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/collection", nextUrl.origin));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("[AUTH JWT] Setting user info in token:", { id: user.id, name: user.name });
        token.id = user.id;
        token.isGuest = (user as { isGuest?: boolean }).isGuest ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        console.log("[AUTH SESSION] Setting user info in session:", { id: token.id });
        session.user.id = token.id as string;
        session.user.isGuest = token.isGuest as boolean;
      }
      return session;
    },
  },
};
