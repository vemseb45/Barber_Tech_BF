import { NextRequest } from "next/server";
import { PagosController } from "@/backend/modules/pagos/pagos.controller";

const controller = new PagosController();

export async function POST(req: NextRequest) {
  return controller.webhookBold(req);
}