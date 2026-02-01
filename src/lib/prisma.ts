import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Parses DATABASE_URL and ensures the password is properly URL-encoded.
 * This handles special characters in passwords that would otherwise cause
 * authentication failures (P1010 errors).
 */
function parseConnectionString(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    // Re-encode the password to handle special characters
    if (url.password) {
      // Decode first (in case it's already encoded) then re-encode
      const decodedPassword = decodeURIComponent(url.password);
      url.password = encodeURIComponent(decodedPassword);
    }
    return url.toString();
  } catch {
    // If parsing fails, return the original string
    return connectionString;
  }
}

function createPrismaClient() {
  const rawConnectionString = process.env.DATABASE_URL;
  // During build time, DATABASE_URL may not be set - use a dummy client that will
  // fail gracefully at runtime if actually used without proper configuration
  if (!rawConnectionString) {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  const connectionString = parseConnectionString(rawConnectionString);
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
