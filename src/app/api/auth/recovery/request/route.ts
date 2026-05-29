import { NextRequest } from "next/server";
import { requestResetController } from "@/backend/modules/auth/recovery/recovery.controller";

export async function POST(req: NextRequest) {
  return requestResetController(req);
}