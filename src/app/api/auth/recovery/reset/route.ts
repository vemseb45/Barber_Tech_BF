import { NextRequest } from "next/server";
import { resetPasswordController } from "@/backend/modules/auth/recovery/recovery.controller";

export async function POST(req: NextRequest) {
  return resetPasswordController(req);
}