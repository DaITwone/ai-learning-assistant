import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="animated-bg flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-2xl text-center">
        <Image
          src="/LogoAI.png"
          alt="Logo AI Learning Assistant"
          width={128}
          height={128}
          priority
          className="mx-auto rounded-md"
        />
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
          AI Learning Assistant
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Your AI-powered coding learning companion.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
          Giải thích khái niệm, phân tích source code, tạo quiz và lưu ghi chú
          học tập trong một không gian tập trung.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="flex h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:text-sky-800 sm:w-auto"
          >
            Tạo tài khoản
          </Link>
        </div>
      </section>
    </main>
  );
}
