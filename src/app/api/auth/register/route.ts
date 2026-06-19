import { NextResponse } from "next/server";

import { AuthService } from "@/services/auth.service";
import { registerSchema } from "@/types/auth";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    // Validate input data  
    const data =
      registerSchema.parse(body);

    await AuthService.register(
      data
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Đăng ký thành công",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server Error",
      },
      {
        status: 400,
      }
    );
  }
}