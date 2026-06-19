import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="w-full max-w-md border shadow-lg">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              TẠO TÀI KHOẢN
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Bắt đầu hành trình học lập trình cùng trợ lý AI của bạn.
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>

              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="email@gmail.com"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>

              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </Label>

              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="h-11"
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" className="mt-1" />

              <Label
                htmlFor="terms"
                className="cursor-pointer text-sm leading-5 font-normal text-muted-foreground"
              >
                Tôi đồng ý sử dụng AI Learning Assistant như một công cụ hỗ trợ
                học tập.
              </Label>
            </div>

            <Button type="submit" className="h-11 w-full">
              Đăng ký
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