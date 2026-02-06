import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/showcase - Get admin's item icons for landing page showcase
// This is a public API that returns only the generated icons (no personal data)
export async function GET() {
  try {
    const adminEmails = process.env.ADMIN_EMAIL?.split(',').map(e => e.trim()) || [];

    if (adminEmails.length === 0) {
      return NextResponse.json({ icons: [] });
    }

    // Find admin users
    const adminUsers = await prisma.user.findMany({
      where: {
        email: { in: adminEmails },
      },
      select: { id: true },
    });

    if (adminUsers.length === 0) {
      return NextResponse.json({ icons: [] });
    }

    const adminUserIds = adminUsers.map((u: { id: string }) => u.id);

    // Get admin's items with generated icons
    const items = await prisma.item.findMany({
      where: {
        userId: { in: adminUserIds },
        generatedIcon: { not: null },
      },
      select: {
        id: true,
        generatedIcon: true,
        iconStyle: true,
        iconColors: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 12, // Limit to 12 icons for the showcase grid
    });

    const icons = items.map((item: { id: string; generatedIcon: string | null; iconStyle: string | null; iconColors: string[] }) => ({
      id: item.id,
      icon: item.generatedIcon,
      style: item.iconStyle,
      colors: item.iconColors,
    }));

    return NextResponse.json({ icons });
  } catch (error) {
    console.error('Failed to fetch showcase icons:', error);
    return NextResponse.json({ icons: [] });
  }
}
