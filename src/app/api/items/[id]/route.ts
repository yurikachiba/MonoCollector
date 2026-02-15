import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/items/[id] - Get a single item
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const item = await prisma.item.findUnique({
      where: { id, userId: session.user.id },
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify item belongs to user
    const existingItem = await prisma.item.findUnique({
      where: { id, userId: session.user.id },
    });
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const rawName = (formData.get('name') as string) || '';
    const rawLocation = (formData.get('location') as string) || '';

    // Validate field lengths
    if (rawName.length > 50) {
      return NextResponse.json(
        { error: 'Name must be 50 characters or less' },
        { status: 400 }
      );
    }
    if (rawLocation.length > 50) {
      return NextResponse.json(
        { error: 'Location must be 50 characters or less' },
        { status: 400 }
      );
    }

    const updateData: {
      name: string;
      category: string;
      icon: string;
      location: string;
      quantity: number;
      notes: string;
      isCollected: boolean;
      updatedAt: Date;
      image?: Uint8Array<ArrayBuffer>;
      tags?: string[];
      generatedIcon?: string | null;
      iconStyle?: string | null;
      iconColors?: string[];
    } = {
      name: rawName,
      category: formData.get('category') as string,
      icon: formData.get('icon') as string,
      location: rawLocation,
      quantity: parseInt(formData.get('quantity') as string) || 1,
      notes: formData.get('notes') as string || "",
      isCollected: formData.get('isCollected') === 'true',
      updatedAt: new Date(),
    };

    const imageFile = formData.get('image');
    if (imageFile instanceof File) {
      const buffer = await imageFile.arrayBuffer();
      updateData.image = new Uint8Array(buffer) as Uint8Array<ArrayBuffer>;
    }

    const tagsStr = formData.get('tags') as string;
    // "undefined" 文字列の場合はスキップ
    if (tagsStr && tagsStr !== 'undefined') {
      const parsedTags = JSON.parse(tagsStr);
      updateData.tags = Array.isArray(parsedTags)
        ? parsedTags.filter((t): t is string => typeof t === 'string' && t.length <= 30).slice(0, 10)
        : [];
    }

    // Handle generated icon fields
    const generatedIcon = formData.get('generatedIcon') as string | null;
    if (generatedIcon !== null) {
      updateData.generatedIcon = generatedIcon || null;
    }

    const iconStyle = formData.get('iconStyle') as string | null;
    if (iconStyle !== null) {
      updateData.iconStyle = iconStyle || null;
    }

    const iconColorsStr = formData.get('iconColors') as string;
    // "undefined" 文字列の場合はスキップ
    if (iconColorsStr && iconColorsStr !== 'undefined') {
      const iconColors = JSON.parse(iconColorsStr);
      updateData.iconColors = Array.isArray(iconColors) ? iconColors.filter((c): c is string => typeof c === 'string') : [];
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get item to know its category (and verify ownership)
    const item = await prisma.item.findUnique({
      where: { id, userId: session.user.id },
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
