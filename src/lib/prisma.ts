import { Pool, PoolConfig } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Parses DATABASE_URL into individual components for pg Pool.
 * This handles special characters in passwords (including @) that would
 * otherwise cause authentication failures (P1010 errors).
 */
function parseConnectionString(connectionString: string): PoolConfig {
  // Parse from the end to handle @ in passwords correctly
  // Format: postgresql://user:password@host:port/database?params

  // Remove protocol
  const withoutProtocol = connectionString.replace(/^postgresql:\/\//, '');

  // Find host:port/database from the end (look for pattern like @hostname:port/db)
  // The host cannot contain @ so we find the last @ that's followed by host:port/db pattern
  const hostPortDbMatch = withoutProtocol.match(/@([^@:]+):(\d+)\/([^?]+)(\?.*)?$/);

  if (!hostPortDbMatch) {
    // Fallback: return as connection string and let pg handle it
    return { connectionString };
  }

  const [fullMatch, host, port, database, queryString] = hostPortDbMatch;

  // Everything before the matched part is user:password
  const credentials = withoutProtocol.slice(0, withoutProtocol.length - fullMatch.length);
  const colonIndex = credentials.indexOf(':');

  if (colonIndex === -1) {
    return { connectionString };
  }

  const user = credentials.slice(0, colonIndex);
  const password = credentials.slice(colonIndex + 1);

  // Decode password in case it's URL-encoded
  let decodedPassword: string;
  try {
    decodedPassword = decodeURIComponent(password);
  } catch {
    decodedPassword = password;
  }

  const config: PoolConfig = {
    user,
    password: decodedPassword,
    host,
    port: parseInt(port, 10),
    database,
  };

  // Handle SSL mode from query params
  if (queryString?.includes('sslmode=require')) {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

function createPrismaClient() {
  const rawConnectionString = process.env.DATABASE_URL;
  // During build time, DATABASE_URL may not be set - use a placeholder that will
  // fail at runtime if actually used without proper configuration
  const poolConfig = rawConnectionString
    ? parseConnectionString(rawConnectionString)
    : { connectionString: 'postgresql://build:build@localhost:5432/build' };
  const pool = new Pool(poolConfig);
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
