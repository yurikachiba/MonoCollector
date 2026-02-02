import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Execute raw SQL to create tables
    await prisma.$executeRawUnsafe(`
      -- User table
      CREATE TABLE IF NOT EXISTS "User" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          name TEXT,
          email TEXT UNIQUE,
          "emailVerified" TIMESTAMP,
          image TEXT,
          "isGuest" BOOLEAN DEFAULT FALSE,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    await prisma.$executeRawUnsafe(`
      -- Account table
      CREATE TABLE IF NOT EXISTS "Account" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          provider TEXT NOT NULL,
          "providerAccountId" TEXT NOT NULL,
          refresh_token TEXT,
          access_token TEXT,
          expires_at INTEGER,
          token_type TEXT,
          scope TEXT,
          id_token TEXT,
          session_state TEXT,
          UNIQUE(provider, "providerAccountId")
      );
    `);

    await prisma.$executeRawUnsafe(`
      -- Session table
      CREATE TABLE IF NOT EXISTS "Session" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          "sessionToken" TEXT UNIQUE NOT NULL,
          "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          expires TIMESTAMP NOT NULL
      );
    `);

    await prisma.$executeRawUnsafe(`
      -- VerificationToken table
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
          identifier TEXT NOT NULL,
          token TEXT UNIQUE NOT NULL,
          expires TIMESTAMP NOT NULL,
          UNIQUE(identifier, token)
      );
    `);

    await prisma.$executeRawUnsafe(`
      -- Item table
      CREATE TABLE IF NOT EXISTS "Item" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          icon TEXT NOT NULL,
          image BYTEA NOT NULL,
          "generatedIcon" TEXT,
          "iconStyle" TEXT,
          "iconColors" TEXT[] DEFAULT '{}',
          location TEXT NOT NULL,
          quantity INTEGER DEFAULT 1,
          notes TEXT DEFAULT '',
          tags TEXT[] DEFAULT '{}',
          "isCollected" BOOLEAN DEFAULT FALSE,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW(),
          "userId" TEXT REFERENCES "User"(id) ON DELETE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      -- Category table
      CREATE TABLE IF NOT EXISTS "Category" (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          icon TEXT NOT NULL,
          color TEXT NOT NULL,
          "itemCount" INTEGER DEFAULT 0
      );
    `);

    await prisma.$executeRawUnsafe(`
      -- Indexes
      CREATE INDEX IF NOT EXISTS "Item_category_idx" ON "Item"(category);
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Item_createdAt_idx" ON "Item"("createdAt");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Item_userId_idx" ON "Item"("userId");
    `);

    // Verify tables were created
    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    return NextResponse.json({
      status: "success",
      message: "Migration completed",
      tables: tables.map((t: { table_name: string }) => t.table_name),
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
