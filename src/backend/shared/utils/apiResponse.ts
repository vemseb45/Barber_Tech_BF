import { NextResponse } from "next/server";

export function apiResponse(
  success: boolean,
  message: string,
  data: any = null,
  status: number = 200
) {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status }
  );
}