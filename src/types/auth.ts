import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Tên phải từ 2 ký tự"),

  email: z
    .email("Email không hợp lệ"),

  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export type RegisterInput =
  z.infer<typeof registerSchema>;