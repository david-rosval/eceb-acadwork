import { cookies } from "next/headers";
import { verifyRefreshToken, generateAccessToken } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      }
    })

    return NextResponse.json({ accessToken: newAccessToken, user });
  } catch (error) {
    console.error("[REFRESH_TOKEN_ERROR]", error);
    return NextResponse.json(
      { error: "Refresh token inválido o expirado" },
      { status: 403 }
    );
  }
}
