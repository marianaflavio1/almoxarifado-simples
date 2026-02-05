import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Padroniza texto para letras maiúsculas
export function toUpperText(str: string): string {
  return str.trim().toUpperCase();
}
