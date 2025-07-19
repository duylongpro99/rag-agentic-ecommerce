import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await currentUser();

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
