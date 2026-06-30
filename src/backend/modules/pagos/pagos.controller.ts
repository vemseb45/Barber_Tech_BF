import { NextResponse } from 'next/server';
import { PagosService } from './pagos.service';
import { getSessionUser } from '@/backend/shared/get-session-user';

export class PagosController {
  private service = new PagosService();

  async webhookBold(request: Request) {
    try {
      const body = await request.json();
      const referencia = body.payload?.reference;
      const estado = body.payload?.status;

      if (referencia && estado) {
        await this.service.procesarWebhook(referencia, estado);
      }
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false }, { status: 500 });
    }
  }

  async postLiquidarPos(request: Request) {
    try {
      const session = await getSessionUser();
      if (!session || session.rol !== 'Admin') {
        return NextResponse.json({ success: false, message: 'No autorizado. Solo Admin.' }, { status: 403 });
      }

      const body = await request.json();
      if (!body.id_cita || !body.monto || !body.metodo_pago) {
        return NextResponse.json({ success: false, message: 'Faltan datos para liquidar' }, { status: 400 });
      }

      await this.service.liquidarCitaPOS(body.id_cita, body.monto, body.metodo_pago);
      
      return NextResponse.json({ success: true, message: 'Cita liquidada exitosamente en el POS' });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
  }
}