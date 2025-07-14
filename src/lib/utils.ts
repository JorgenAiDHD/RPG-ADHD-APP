// Zmieniona lokalizacja dla funkcji `cn` zgodnie z konwencjami Shadcn UI.
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
