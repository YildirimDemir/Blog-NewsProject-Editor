import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file = data.get('file') as File | null;

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const filePath = join(process.cwd(), 'public', 'uploads', file.name);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${file.name}`;
    return NextResponse.json({ success: true, url: fileUrl });
}
