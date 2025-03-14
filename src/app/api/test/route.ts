
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "Connected to MongoDB successfully" });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    return NextResponse.json({ error: "Failed to connect to MongoDB" }, { status: 500 });
  }
}
