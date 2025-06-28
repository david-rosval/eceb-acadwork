import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formattedUserName(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return "Usuario Anónimo"
  const firstNameFirstLetter = firstName?.trim().charAt(0).toUpperCase()
  const lastNameFirstLetter = lastName?.trim().charAt(0).toUpperCase()
  return `${firstNameFirstLetter}+${lastNameFirstLetter}`.trim()
}