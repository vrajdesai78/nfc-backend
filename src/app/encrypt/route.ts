import { NextRequest, NextResponse } from "next/server";
import { encryptString } from "@/utils/crypto";

export async function POST(request: NextRequest) {
  try {
    const { data, password } = await request.json();

    if (typeof data !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Data and password must be strings" },
        { status: 400 }
      );
    }

    const encrypted = encryptString(data, password);
    return NextResponse.json({ encrypted });
  } catch (error) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
