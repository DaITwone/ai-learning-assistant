// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }
}

// Mặc định, trong NextAuth, object session.user không có trường id. 
// Nhưng trong project sau khi login thường sẽ muốn truy cập: session.user.id