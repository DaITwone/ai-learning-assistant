import Image from "next/image";
import Link from "next/link";
import TypingText from "../components/auth/TypingText";

export default function Home() {
  return (
    <main className="animated-bg flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-2xl px-2 text-center sm:px-4">
        <Image
          src="/LogoAI.png"
          alt="Logo AI Learning Assistant"
          width={128}
          height={128}
          priority
          className="mx-auto h-20 w-20 rounded-md sm:h-24 sm:w-24 md:h-32 md:w-32"
        />

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 sm:text-sm">
          AI Learning Assistant
        </p>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          Your AI-powered personal learning companion.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
          <TypingText
            text="Học nhanh hơn với AI. Tìm hiểu kiến thức mới,
tạo quiz, lưu ghi chú và xây dựng lộ trình học tập
trong một không gian tập trung."
            speed={35}
          />
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Đăng nhập
          </Link>

          <Link
            href="/register"
            className="flex h-12 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:text-sky-800 sm:w-auto"
          >
            Tạo tài khoản
          </Link>
        </div>
      </section>
    </main>
  );
}
