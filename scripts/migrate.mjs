import pg from 'pg';
const { Client } = pg;

const sql = `
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

-- Session table
CREATE TABLE IF NOT EXISTS "Session" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    expires TIMESTAMP NOT NULL
);

-- VerificationToken table
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMP NOT NULL,
    UNIQUE(identifier, token)
);

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

-- Category table
CREATE TABLE IF NOT EXISTS "Category" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    "itemCount" INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS "Item_category_idx" ON "Item"(category);
CREATE INDEX IF NOT EXISTS "Item_createdAt_idx" ON "Item"("createdAt");
CREATE INDEX IF NOT EXISTS "Item_userId_idx" ON "Item"("userId");
`;

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected! Running migrations...');

    await client.query(sql);

    console.log('Migration completed successfully!');

    // Verify tables
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('Created tables:');
    result.rows.forEach(row => console.log('  -', row.table_name));

  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
