import { NextRequest } from "next/server";
import { PagosController } from "@/backend/modules/pagos/pagos.controller";

const controller = new PagosController();

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  
  const signature = req.headers.get("x-bold-signature");

  return controller.webhookBold(rawBody, signature);
}