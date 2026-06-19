import bcrypt from "bcrypt";

import { UserRepository } from "@/repositories/user.repository";
import { RegisterInput } from "@/types/auth";

export class AuthService {
  static async register(data: RegisterInput) {
    const existingUser =
      await UserRepository.findByEmail(
        data.email
      );

    if (existingUser) {
      throw new Error(
        "Email đã tồn tại"
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        data.password,
        10
      );

    const user =
      await UserRepository.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      });

    return user;
  }
}