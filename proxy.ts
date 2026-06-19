export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: ["/chat/:path*", "/quizzes/:path*", "/notes/:path*", "/roadmap/:path*"],
};

/**
 * proxy.ts dùng để bảo vệ route trước khi request tới page hoặc API.
 * 
 * proxy.ts không tạo JWT. Nó dùng JWT đã được tạo trước đó để chặn hoặc cho phép truy cập các route được bảo vệ.
 * 
 * Request
   ↓
   proxy.ts
   ↓
   auth()
   ↓
   Đọc JWT Cookie
   ↓
   Kiểm tra đăng nhập
   ↓
   Cho đi tiếp hoặc redirect
 */