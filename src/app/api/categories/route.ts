import { NextRequest, NextResponse } from 'next/server';
import Category, { ICategory } from '@/models/categoryModel';
import { connectToDB } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        await connectToDB();

        const categoryId = new URL(req.url).searchParams.get('categoryId');
        
        if (categoryId) {
            const category = await Category.findById(categoryId)
                .populate('posts')
                .exec();

            if (!category) {
                return NextResponse.json({ message: 'Category not found' }, { status: 404 });
            }

            return NextResponse.json({ category }, { status: 200 });
        } else {
            const categories: ICategory[] = await Category.find();
            return NextResponse.json({ count: categories.length, categories }, { status: 200 });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching categories:', error.message);
            return NextResponse.json({ error: 'Failed to fetch categories', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'Failed to fetch categories', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
