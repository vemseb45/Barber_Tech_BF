import { NextRequest } from "next/server";
import { verify2faController } from "@/backend/modules/auth/auth.controller";

export async function POST(req: NextRequest) {
  return verify2faController(req);
}