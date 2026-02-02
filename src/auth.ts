import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
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
        // ゲストユーザーを作成
        const guestUser = await prisma.user.create({
          data: {
            id: uuidv4(),
            name: `ゲスト${Math.random().toString(36).substring(2, 8)}`,
            isGuest: true,
          },
        });
        return {
          id: guestUser.id,
          name: guestUser.name,
          email: null,
          image: null,
          isGuest: true,
        };
      },
    }),
  ],
  callbacks: {
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
});
