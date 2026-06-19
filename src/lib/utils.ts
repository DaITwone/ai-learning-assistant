import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * cn()
 * Giúp ghép nhiều class với nhau.
 * Hỗ trợ class có điều kiện
 * Tự động xử lý xung đột TailwindCSS.
 */

/**
 * Nhiều class
    ↓
   clsx()
    ↓
   1 chuỗi class
    ↓
   twMerge()
    ↓
   Loại bỏ xung đột Tailwind
    ↓
   className cuối cùng
 */