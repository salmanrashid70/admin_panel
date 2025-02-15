import { connectDB } from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import { NextRequest, NextResponse } from "next/server";

/// Create a new Admin User
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Parse request body once
        const body = await request.json();

        console.log(`Creating: ${JSON.stringify(body)}`);

        const { name, email, role, password } = body;

        if (!name || name.trim() === "") {
            return NextResponse.json({ error: 'Name is required.' }, { status: 400});
        }

        if (!email || email.trim() === "") {
            return NextResponse.json({ error: 'Email is required.'}, { status: 400});
        }

        if (!password || password.trim() === "") {
            return NextResponse.json({ error: 'Password is required.'}, { status: 400});
        }

        if (!role || role.trim() === "") {
            return NextResponse.json({ error: 'Role is required.'}, { status: 400});
        }

        const existingUser = await AdminUser.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists.' }, { status: 400});
        }

        const newUser = new AdminUser({ name, email, role, password });
        await newUser.save();

        return NextResponse.json({message: 'User created successfully.', user: newUser}, {status: 201});
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Internal server error"}, {status: 500});
    }
}
