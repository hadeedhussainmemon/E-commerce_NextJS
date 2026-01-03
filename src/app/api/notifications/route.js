
import { NextResponse } from 'next/server';

export async function GET() {
    // Mock Notifications for Admin
    return NextResponse.json([
        {
            id: 1,
            title: 'Welcome to your new store!',
            message: 'Your system is ready to go.',
            time: 'Just now',
            isRead: false,
            type: 'info'
        },
        {
            id: 2,
            title: 'System Update',
            message: 'Backend successfully migrated to Next.js',
            time: '1 min ago',
            isRead: false,
            type: 'success'
        }
    ]);
}
