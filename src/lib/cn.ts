import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Pomocnicza funkcja do łączenia klas Tailwind CSS.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
