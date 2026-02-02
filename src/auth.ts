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
  },
  providers: [
    ...authConfig.providers.filter((p) => (p as { id?: string }).id !== "guest"),
    CredentialsProvider({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        try {
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
        } catch (error) {
          console.error("Guest user creation failed:", error);
          return null;
        }
      },
    }),
  ],
});
