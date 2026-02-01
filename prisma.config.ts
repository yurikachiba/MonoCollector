import { defineConfig } from 'prisma/config';

// Add sslmode=require for external databases (like Render)
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
  }
  // If URL doesn't have sslmode and is not localhost, add sslmode=require
  if (!url.includes('sslmode=') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    return url.includes('?') ? `${url}&sslmode=require` : `${url}?sslmode=require`;
  }
  return url;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: getDatabaseUrl(),
  },
});
