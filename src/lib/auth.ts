import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { AuthService } from "@/services/auth.service";
import { loginSchema } from "@/types/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Nếu chưa đăng nhập sẽ tự động chuyển hướng về /login
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        try {
          return await AuthService.login(parsed.data);
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Lấy id user vừa đăng nhập bỏ vào token.
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});