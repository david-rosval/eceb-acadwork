import { cookies } from "next/headers";
import { verifyRefreshToken, generateAccessToken } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token ausente" },
        { status: 401 }
      );
    }

    const payload = verifyRefreshToken(refreshToken);
    const userId = payload.sub as string;

    const newAccessToken = generateAccessToken(userId);

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("[REFRESH_TOKEN_ERROR]", error);
    return NextResponse.json(
      { error: "Refresh token inválido o expirado" },
      { status: 403 }
    );
  }
}
