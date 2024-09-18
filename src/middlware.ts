import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectToDB } from '@/lib/mongodb';
import User from './models/userModel';

export async function middleware(req: NextRequest) {
    await connectToDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    const user = await User.findOne({ email: token.email });

    if (!user) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (user.userRole !== 'editor') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/profile', '/posts/*', '/api/*'],
};
