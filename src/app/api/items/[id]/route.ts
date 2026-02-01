import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/items/[id] - Get a single item
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const itemWithBase64 = {
      ...item,
      image: `data:image/jpeg;base64,${Buffer.from(item.image).toString('base64')}`
    };

    return NextResponse.json(itemWithBase64);
  } catch (error) {
    console.error('Failed to fetch item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

// PUT /api/items/[id] - Update an item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    const updateData: {
      name: string;
      category: string;
      icon: string;
      location: string;
      quantity: number;
      notes: string;
      isCollected: boolean;
      updatedAt: Date;
      image?: Uint8Array;
      tags?: string[];
    } = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      icon: formData.get('icon') as string,
      location: formData.get('location') as string,
      quantity: parseInt(formData.get('quantity') as string) || 1,
      notes: formData.get('notes') as string || "",
      isCollected: formData.get('isCollected') === 'true',
      updatedAt: new Date(),
    };

    const imageFile = formData.get('image');
    if (imageFile instanceof File) {
      updateData.image = new Uint8Array(await imageFile.arrayBuffer());
    }

    const tagsStr = formData.get('tags') as string;
    if (tagsStr) {
      updateData.tags = JSON.parse(tagsStr);
    }

    const item = await prisma.item.update({
      where: { id },
      data: updateData,
    });

    const itemWithBase64 = {
      ...item,
      image: `data:image/jpeg;base64,${Buffer.from(item.image).toString('base64')}`
    };

    return NextResponse.json(itemWithBase64);
  } catch (error) {
    console.error('Failed to update item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE /api/items/[id] - Delete an item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get item to know its category
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    await prisma.item.delete({
      where: { id },
    });

    // Update category item count
    await updateCategoryCount(item.category);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
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
