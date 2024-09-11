import { NextRequest, NextResponse } from "next/server";
import { decryptString } from "@/utils/crypto";

export async function POST(request: NextRequest) {
  try {
    const { encryptedData, password } = await request.json();

    if (typeof encryptedData !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "EncryptedData and password must be strings" },
        { status: 400 }
      );
    }

    const decrypted = decryptString(encryptedData, password);
    return NextResponse.json({ decrypted });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid input or decryption failed" },
      { status: 400 }
    );
  }
}
