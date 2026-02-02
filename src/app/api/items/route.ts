import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

interface PrismaItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  image: Uint8Array;
  generatedIcon: string | null;
  iconStyle: string | null;
  iconColors: string[];
  location: string;
  quantity: number;
  notes: string;
  tags: string[];
  isCollected: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}

// GET /api/items - Get all items for current user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const items = await prisma.item.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const itemsWithBase64 = items.map((item: PrismaItem) => ({
      ...item,
      image: `data:image/jpeg;base64,${Buffer.from(item.image).toString('base64')}`
    }));

    return NextResponse.json(itemsWithBase64);
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
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  console.log(`[${requestId}] POST /api/items - Starting item creation`);

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', requestId },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Log all form data keys for debugging
    const formDataKeys = Array.from(formData.keys());
    console.log(`[${requestId}] FormData keys:`, formDataKeys);

    // Log form data values (except image binary)
    formDataKeys.forEach(key => {
      if (key !== 'image') {
        const value = formData.get(key);
        console.log(`[${requestId}] FormData[${key}]:`, value);
      }
    });

    const imageFile = formData.get('image');
    console.log(`[${requestId}] Image validation:`, {
      exists: !!imageFile,
      isFile: imageFile instanceof File,
      type: imageFile instanceof File ? imageFile.type : typeof imageFile,
      size: imageFile instanceof File ? imageFile.size : 'N/A',
      name: imageFile instanceof File ? imageFile.name : 'N/A',
    });

    if (!imageFile || !(imageFile instanceof File) || imageFile.size === 0) {
      console.error(`[${requestId}] Image validation failed:`, {
        imageFile: imageFile,
        isFile: imageFile instanceof File,
        size: imageFile instanceof File ? imageFile.size : 'undefined',
      });
      return NextResponse.json(
        { error: 'Image is required', requestId },
        { status: 400 }
      );
    }

    console.log(`[${requestId}] Converting image to buffer...`);
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    console.log(`[${requestId}] Image buffer size: ${imageBuffer.length} bytes`);

    const tagsStr = formData.get('tags') as string;
    const tags = tagsStr ? JSON.parse(tagsStr) : [];
    console.log(`[${requestId}] Parsed tags:`, tags);

    // Extract and validate required fields
    const id = formData.get('id');
    const name = formData.get('name');
    const category = formData.get('category');
    const icon = formData.get('icon');
    const location = formData.get('location');

    // Validate required string fields (location can be empty string)
    const missingFields: string[] = [];
    if (!id || typeof id !== 'string') missingFields.push('id');
    if (!name || typeof name !== 'string') missingFields.push('name');
    if (!category || typeof category !== 'string') missingFields.push('category');
    if (!icon || typeof icon !== 'string') missingFields.push('icon');
    // Location is optional in UI but required in DB, allow empty string
    if (location === null || location === undefined || typeof location !== 'string') missingFields.push('location');

    if (missingFields.length > 0) {
      console.error(`[${requestId}] Missing required fields:`, missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}`, requestId },
        { status: 400 }
      );
    }

    // Safely parse quantity - ensure it's a valid integer
    const quantityStr = formData.get('quantity') as string;
    const quantity = quantityStr ? parseInt(quantityStr, 10) : 1;
    const safeQuantity = Number.isNaN(quantity) ? 1 : quantity;

    // Safely handle notes - ensure it's a string
    const notesValue = formData.get('notes');
    const notes = typeof notesValue === 'string' ? notesValue : '';

    // Safely handle createdAt
    const createdAtStr = formData.get('createdAt') as string;
    let createdAt: Date;
    try {
      createdAt = createdAtStr ? new Date(createdAtStr) : new Date();
      if (isNaN(createdAt.getTime())) {
        createdAt = new Date();
      }
    } catch {
      createdAt = new Date();
    }

    // Validate tags is an array of strings
    const safeTags = Array.isArray(tags) ? tags.filter((t): t is string => typeof t === 'string') : [];

    // Handle generated icon fields
    const generatedIcon = formData.get('generatedIcon') as string | null;
    const iconStyle = formData.get('iconStyle') as string | null;
    const iconColorsStr = formData.get('iconColors') as string;
    const iconColors = iconColorsStr ? JSON.parse(iconColorsStr) : [];
    const safeIconColors = Array.isArray(iconColors) ? iconColors.filter((c): c is string => typeof c === 'string') : [];

    const itemData = {
      id: id as string,
      name: name as string,
      category: category as string,
      icon: icon as string,
      image: imageBuffer,
      generatedIcon: generatedIcon || null,
      iconStyle: iconStyle || null,
      iconColors: safeIconColors,
      location: location as string,
      quantity: safeQuantity,
      notes: notes,
      tags: safeTags,
      isCollected: formData.get('isCollected') === 'true',
      createdAt: createdAt,
      updatedAt: new Date(),
      userId: session.user.id,
    };

    console.log(`[${requestId}] Creating item in database:`, {
      id: itemData.id,
      name: itemData.name,
      category: itemData.category,
      icon: itemData.icon,
      location: itemData.location,
      quantity: itemData.quantity,
      notes: itemData.notes,
      tags: itemData.tags,
      isCollected: itemData.isCollected,
      createdAt: itemData.createdAt,
      updatedAt: itemData.updatedAt,
      imageSize: itemData.image.length,
    });

    const item = await prisma.item.create({
      data: itemData,
    });
    console.log(`[${requestId}] Item created successfully:`, item.id);

    // Update category item count
    console.log(`[${requestId}] Updating category count for: ${item.category}`);
    await updateCategoryCount(item.category);
    console.log(`[${requestId}] Category count updated`);

    // Convert Buffer back to Base64 for the response
    const itemResponse = {
      ...item,
      image: `data:image/jpeg;base64,${Buffer.from(item.image).toString('base64')}`
    };

    console.log(`[${requestId}] Item creation completed successfully`);
    return NextResponse.json(itemResponse, { status: 201 });
  } catch (error) {
    console.error(`[${requestId}] Failed to create item:`, error);
    console.error(`[${requestId}] Error name:`, error instanceof Error ? error.name : 'Unknown');
    console.error(`[${requestId}] Error message:`, error instanceof Error ? error.message : String(error));
    console.error(`[${requestId}] Error stack:`, error instanceof Error ? error.stack : 'No stack');

    // Handle Prisma-specific errors
    let errorDetails = 'Failed to create item';
    if (error instanceof Error) {
      errorDetails = error.message;
      // Check for Prisma validation errors
      if ('code' in error) {
        const prismaError = error as Error & { code: string; meta?: Record<string, unknown> };
        console.error(`[${requestId}] Prisma error code:`, prismaError.code);
        console.error(`[${requestId}] Prisma error meta:`, prismaError.meta);
        errorDetails = `Prisma error (${prismaError.code}): ${error.message}`;
        if (prismaError.meta) {
          errorDetails += ` Meta: ${JSON.stringify(prismaError.meta)}`;
        }
      }
    }

    return NextResponse.json(
      { error: 'Failed to create item', details: errorDetails, requestId },
      { status: 500 }
    );
  }
}

const defaultCategories: Record<string, { name: string; icon: string; color: string }> = {
  food: { name: '食品・食材', icon: '🍎', color: '#FF6B6B' },
  kitchen: { name: 'キッチン用品', icon: '🍳', color: '#4ECDC4' },
  clothes: { name: '衣類', icon: '👕', color: '#45B7D1' },
  electronics: { name: '電子機器', icon: '📱', color: '#96CEB4' },
  books: { name: '本・書籍', icon: '📚', color: '#FFEAA7' },
  cosmetics: { name: 'コスメ・美容', icon: '💄', color: '#DDA0DD' },
  stationery: { name: '文房具', icon: '✏️', color: '#98D8C8' },
  toys: { name: 'おもちゃ・ホビー', icon: '🎮', color: '#F7DC6F' },
  cleaning: { name: '掃除用品', icon: '🧹', color: '#85C1E9' },
  medicine: { name: '薬・医療品', icon: '💊', color: '#F1948A' },
  furniture: { name: '家具・インテリア', icon: '🪑', color: '#D7BDE2' },
  sports: { name: 'スポーツ用品', icon: '⚽', color: '#82E0AA' },
  other: { name: 'その他', icon: '📦', color: '#AEB6BF' },
};

async function updateCategoryCount(categoryId: string) {
  const count = await prisma.item.count({
    where: { category: categoryId },
  });

  const defaultCategory = defaultCategories[categoryId] || defaultCategories.other;

  await prisma.category.upsert({
    where: { id: categoryId },
    update: { itemCount: count },
    create: {
      id: categoryId,
      name: defaultCategory.name,
      icon: defaultCategory.icon,
      color: defaultCategory.color,
      itemCount: count,
    },
  });
}
