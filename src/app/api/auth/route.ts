import { NextResponse } from 'next/server';

interface AuthRequestBody {
    password?: string;
}

const APP_PASSWORD = process.env.APP_PASSWORD_DEV;

if (!APP_PASSWORD) {
    console.error('APP_PASSWORD_DEV is not defined in the environment variables.');
}

export async function POST(request :Request) {
    try {
        if (!APP_PASSWORD) {
            return NextResponse.json(
                { success: false, message: 'Server error: APP_PASSWORD is not defined.' },
                { status: 500 }
            );
        }

        const body: AuthRequestBody = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json(
                { success: false, message: 'Password is required.' },
                { status: 400 }
            );
        }

        if (password === APP_PASSWORD) {
            // set session storage or cookie here in the future
            const response = NextResponse.json(
                { success: true, message: 'Login successful.' },
                { status: 200 }
            );
            return response;
        } else {
            return NextResponse.json(
                { success: false, message: 'Invalid password.' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { success: false, message: 'Invalid JSON format.' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: 'Server error.' },
            { status: 500 }
        );
    }
}