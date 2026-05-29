import { NextRequest } from "next/server";
import { registerController } from "@/backend/modules/auth/auth.controller";

export async function POST(req: NextRequest) {
  return registerController(req);
}