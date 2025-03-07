import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateMemberId(): string {
  const digits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const char = chars[Math.floor(Math.random() * chars.length)];
  return `${digits}${char}`;
}

export function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, "");
  
  // Take only the first 10 digits
  const trimmed = cleaned.slice(0, 10);
  
  // Format as (XXX) XXX-XXXX
  if (trimmed.length === 10) {
    return `(${trimmed.slice(0, 3)}) ${trimmed.slice(3, 6)}-${trimmed.slice(6)}`;
  }
  
  return value;
} 