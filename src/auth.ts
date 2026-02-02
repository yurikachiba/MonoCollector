import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    ...authConfig.providers.filter((p) => (p as { id?: string }).id !== "guest"),
    CredentialsProvider({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        console.log("[AUTH] Guest login attempt started");
        try {
          // データベース接続テスト
          console.log("[AUTH] Testing database connection...");
          await prisma.$queryRaw`SELECT 1`;
          console.log("[AUTH] Database connection OK");

          // ゲストユーザーを作成
          const guestId = uuidv4();
          const guestName = `ゲスト${Math.random().toString(36).substring(2, 8)}`;
          console.log("[AUTH] Creating guest user:", { id: guestId, name: guestName });

          const guestUser = await prisma.user.create({
            data: {
              id: guestId,
              name: guestName,
              isGuest: true,
            },
          });
          console.log("[AUTH] Guest user created successfully:", guestUser.id);

          return {
            id: guestUser.id,
            name: guestUser.name,
            email: null,
            image: null,
            isGuest: true,
          };
        } catch (error) {
          console.error("[AUTH] Guest user creation failed:", error);
          console.error("[AUTH] Error type:", error instanceof Error ? error.constructor.name : typeof error);
          console.error("[AUTH] Error message:", error instanceof Error ? error.message : String(error));
          if (error instanceof Error && 'code' in error) {
            const errorCode = (error as Error & { code: string }).code;
            console.error("[AUTH] Error code:", errorCode);

            // Provide helpful messages for common errors
            if (errorCode === 'P2021' || errorCode === '42P01') {
              console.error("[AUTH] HINT: Table does not exist. Run 'npx prisma db push' to create tables.");
            } else if (errorCode === 'ECONNREFUSED' || errorCode === 'ENOTFOUND') {
              console.error("[AUTH] HINT: Cannot connect to database. Check DATABASE_URL and ensure database is running.");
            } else if (errorCode === 'P1001') {
              console.error("[AUTH] HINT: Cannot reach database server. Check hostname and port in DATABASE_URL.");
            } else if (errorCode === 'P1010' || errorCode === '28P01') {
              console.error("[AUTH] HINT: Authentication failed. Check username and password in DATABASE_URL.");
            }
          }
          return null;
        }
      },
    }),
  ],
});
