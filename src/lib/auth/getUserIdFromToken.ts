"use server"

import { cookies } from "next/headers";
import { verifyRefreshToken } from "./jwt";


export async function getUserIdFromToken(): Promise<string | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("refreshToken")?.value;

  if (!token) return null;

  try {
    const decoded = verifyRefreshToken(token);
    const userId = decoded.sub as string
    return userId;
  } catch {
    console.error("Token inválido o expirado");
    return null;
  }
}
