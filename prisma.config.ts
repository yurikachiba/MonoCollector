import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Use process.env with fallback for CI environments where DATABASE_URL is not set
    // prisma generate doesn't need a real database connection
    url: process.env.DATABASE_URL ?? 'postgresql://placeholder:5432/placeholder',
  },
});
