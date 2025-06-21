import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Eliminar la cookie 'refreshToken' seteando maxAge = 0
  res.headers.append(
    "Set-Cookie",
    serialize("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    })
  );

  return res;
}
