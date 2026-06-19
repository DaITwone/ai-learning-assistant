import { z } from "zod";

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