import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers";
import AdminUser from "@/models/AdminUser";
import { NextRequest, NextResponse } from "next/server";
import formatError from "../../utils/formatError";

const generateToken = async (userId: string) => {
    try {
        const user = await AdminUser.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Something went wrong while generating tokens.");
    }
}

export async function POST(request: NextRequest) {
    const cookieStore = await cookies()
    try {
        await connectDB();
        const body = await request.json();

        const { email, password } = body;

        const validationErrors: Record<string, string> = {};

        if (!email || email.trim() === "") {
            validationErrors.email = "Email is required.";
        }

        if (!password || password.trim() === "") {
            validationErrors.password = "Password is required.";
        }

        if (Object.keys(validationErrors).length > 0) {
            return formatError("Validation failed", 400, null, validationErrors);
        }

        const existingUser = await AdminUser.findOne({ email });

        if (!existingUser) {
            return formatError("User is not found.", 400, null, validationErrors);
        }

        const isPasswordCorrect = await existingUser.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            return formatError("Password is not valid.", 400, null, {
                password: "Password is not valid."
            });
        }

        const { accessToken, refreshToken } = await generateToken(existingUser._id);

        cookieStore.set("adminAccessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 // 1 day
        });

        cookieStore.set("adminRefreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        return NextResponse.json({ message: "Login successfull", user: existingUser }, { status: 200});
    } catch (error) {
        console.error("Error from login route:", error);
        return formatError("Internal server error", 500, error, {});
    }
}