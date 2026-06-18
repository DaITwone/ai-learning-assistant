import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-90">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-black">
            TẠO TÀI KHOẢN
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Bắt đầu hành trình học lập trình cùng trợ lý AI của bạn.
          </p>
        </div>

        <form className="space-y-4">
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Họ và tên"
            className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-black"
          />

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Địa chỉ email"
            className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-black"
          />

          <input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Mật khẩu"
            className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-black"
          />

          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu"
            className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-black"
          />

          <label className="flex items-start gap-2 text-sm leading-5 text-slate-600">
            <input type="checkbox" className="mt-0.5 h-4 w-4" />
            Tôi đồng ý sử dụng AI Learning Assistant như một công cụ hỗ trợ học
            tập.
          </label>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-black text-sm font-medium text-white transition hover:opacity-90"
            >
              Đăng ký
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-black hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}
