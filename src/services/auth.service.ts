import bcrypt from "bcrypt";

import { UserRepository } from "@/repositories/user.repository";
import { LoginInput, RegisterInput } from "@/types/auth";

export class AuthService {
  static async register(data: RegisterInput) {
    const existingUser = await UserRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("Email đã tồn tại");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return user;
  }

  static async login(data: LoginInput) {
    const user = await UserRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
