import { NextResponse } from 'next/server';
import { PagosService } from './pagos.service';
import { getSessionUser } from '@/backend/shared/get-session-user';
import { WebhookSecurity } from './security/webhook.security';

export class PagosController {
  private service = new PagosService();

  async webhookBold(rawBody: string, signature: string | null) {
    try {
      const esValido = WebhookSecurity.validateBoldSignature(rawBody, signature);;

      if (!esValido) {
        console.error("[Bold Webhook] ¡Firma inválida o ausente!");
        return NextResponse.json({ success: false, message: 'Firma inválida' }, { status: 401 });
      }

      const body = JSON.parse(rawBody);


      this.service.procesarWebhookBold(body).catch((error) => {
        console.error("[Bold Webhook] Error asíncrono procesando pago:", error);
      });

      return NextResponse.json({ success: true, message: 'Recibido' }, { status: 200 });

    } catch (error) {
      console.error("[Bold Webhook] Error en Controller:", error);
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