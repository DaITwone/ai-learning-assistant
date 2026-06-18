import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-90">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-black">
            CHÀO MỪNG TRỞ LẠI
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Biến việc học trở nên đơn giản và hiệu quả hơn.
          </p>
        </div>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Địa chỉ email"
            className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-black"
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-black"
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="h-4 w-4" />
              Ghi nhớ đăng nhập
            </label>

            <Link
              href="/forgot-password"
              className="font-medium text-black hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-black text-sm font-medium text-white transition hover:opacity-90"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-medium text-black hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </main>
  );
}
