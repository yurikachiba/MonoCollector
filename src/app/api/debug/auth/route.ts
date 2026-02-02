import { NextResponse } from "next/server";

// デバッグ用：環境変数の設定状態を確認（値は表示しない）
export async function GET() {
  return NextResponse.json({
    AUTH_SECRET: !!process.env.AUTH_SECRET,
    AUTH_SECRET_LENGTH: process.env.AUTH_SECRET?.length ?? 0,
    AUTH_URL: process.env.AUTH_URL ?? "not set",
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST ?? "not set",
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });
}
