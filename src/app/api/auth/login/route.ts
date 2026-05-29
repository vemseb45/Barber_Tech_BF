import { NextRequest } from "next/server";
import { loginController } from "@/backend/modules/auth/auth.controller";

export async function POST(req: NextRequest) {
  return loginController(req);
}