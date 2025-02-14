import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/db/connect";
import { createWaitlistEntry } from "@/backend/models/user";

export async function POST(req: Request) {
  console.log("API Route Accessed: /api/auth/signup");

  try {
    // Parse request body
    const { email } = await req.json();
    console.log("Received Email:", email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await connectToDatabase();
    console.log("Connected to Database");

    // Create waitlist entry
    const waitlistId = await createWaitlistEntry(db, {
      email,
      createdAt: new Date(),
    });
    console.log("Waitlist Entry Created:", waitlistId);

    return NextResponse.json(
      { message: "Email added to waitlist successfully. Thank you!", waitlistId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in API Route:", error.message);

      // Handle duplicate email error
      if (error.message === "Email is already on the waitlist") {
        return NextResponse.json(
          { message: "This email is already signed up for the waitlist" },
          { status: 409 } // HTTP status code for conflict
        );
      }

      return NextResponse.json(
        { message: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }

    console.error("Unknown error:", error);
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
