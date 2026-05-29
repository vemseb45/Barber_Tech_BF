import { NextRequest } from "next/server";
import { logoutController } from "@/backend/modules/auth/auth.controller";

export async function POST(req: NextRequest) {
  return logoutController(req);
}