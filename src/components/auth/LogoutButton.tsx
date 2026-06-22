// src/components/auth/LogoutButton.tsx

"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex h-12 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
    >
      Đăng xuất
    </button>
  );
}