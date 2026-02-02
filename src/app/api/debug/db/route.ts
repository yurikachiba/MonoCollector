import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // データベース接続テスト
    const userCount = await prisma.user.count();
    const guestCount = await prisma.user.count({
      where: { isGuest: true },
    });

    // テスト用ゲストユーザー作成を試行
    const testId = `test-${Date.now()}`;
    const testUser = await prisma.user.create({
      data: {
        id: testId,
        name: `テスト${Math.random().toString(36).substring(2, 8)}`,
        isGuest: true,
      },
    });

    // 作成したテストユーザーを削除
    await prisma.user.delete({
      where: { id: testId },
    });

    return NextResponse.json({
      status: "ok",
      database: "connected",
      userCount,
      guestCount,
      testUserCreation: "success",
      testUserId: testUser.id,
    });
  } catch (error) {
    console.error("Database debug error:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "failed",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
