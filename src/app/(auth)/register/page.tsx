"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const terms = formData.get("terms");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!terms) {
      setError("Bạn cần đồng ý với điều khoản sử dụng.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Đăng ký thất bại");
      }

      setSuccess("Đăng ký thành công! Đang chuyển hướng...");

      form.reset();

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="w-full max-w-md border shadow-lg">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">TẠO TÀI KHOẢN</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Bắt đầu hành trình học lập trình cùng trợ lý AI của bạn.
            </p>
          </div>

          {/* Hiển thị lỗi hoặc thông báo thành công */}
          {error && (
            <div className="mb-4 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                className="h-11"
                required
                disabled={loading}
              />
            </div>
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
                autoComplete="new-password"
                placeholder="••••••••"
                className="h-11"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="h-11"
                required
                disabled={loading}
              />
            </div>
            <div className="flex items-start space-x-2">
              {/* Thêm name và value cho Checkbox của shadcn để FormData nhận diện được */}
              <Checkbox
                id="terms"
                name="terms"
                value="true"
                className="mt-1"
                disabled={loading}
              />
              <Label
                htmlFor="terms"
                className="cursor-pointer text-sm leading-5 font-normal text-muted-foreground"
              >
                Tôi đồng ý sử dụng AI Learning Assistant như một công cụ hỗ trợ
                học tập.
              </Label>
            </div>
            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? (
                <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                "Đăng ký"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
