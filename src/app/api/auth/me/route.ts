import { NextRequest } from "next/server";
import { meController } from "@/backend/modules/auth/auth.controller";

export async function GET(req: NextRequest) {
  return meController(req);
}