import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import { connectToDB } from '@/lib/mongodb';
import Comment from '@/models/commentModel';

export async function DELETE(req: NextRequest, { params }: { params: { commentId: string } }) {
    try {
        await connectToDB();

        // Oturum verilerini al
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "You are not allowed!" }, { status: 401 });
        }

        // Yorumu bul
        const comment = await Comment.findById(params.commentId).exec();
        if (!comment) {
            return NextResponse.json({ message: "Comment not found!" }, { status: 404 });
        }

        // Yorumu sil
        await Comment.findByIdAndDelete(params.commentId);

        return NextResponse.json({ message: "Comment removed successfully" }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error removing comment:', error.message);
            return NextResponse.json({ message: 'Failed to remove comment', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ message: 'Failed to remove comment', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
