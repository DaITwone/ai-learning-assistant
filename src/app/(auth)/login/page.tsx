"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng.");
        return;
      }

      router.push("/chat");
      router.refresh();
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="w-full max-w-md border shadow-lg">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              CHÀO MỪNG TRỞ LẠI{" "}
              <span className="inline-block origin-[70%_70%] animate-wave">
                👋
              </span>
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Tiếp tục hành trình học tập của bạn.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className="h-11"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-11"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" disabled={loading} />

                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-sm font-normal text-muted-foreground"
                >
                  Ghi nhớ đăng nhập
                </Label>
              </div>

              <Link
                href="/forgot-password"
                className="text-sm font-medium hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-semibold text-foreground hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
