import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/items - Get all items
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// POST /api/items - Create a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const item = await prisma.item.create({
      data: {
        id: body.id,
        name: body.name,
        category: body.category,
        icon: body.icon,
        image: body.image,
        location: body.location,
        quantity: body.quantity,
        notes: body.notes,
        tags: body.tags,
        isCollected: body.isCollected,
        createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
      },
    });

    // Update category item count
    await updateCategoryCount(body.category);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Failed to create item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

async function updateCategoryCount(categoryId: string) {
  const count = await prisma.item.count({
    where: { category: categoryId },
  });

  await prisma.category.update({
    where: { id: categoryId },
    data: { itemCount: count },
  });
}
