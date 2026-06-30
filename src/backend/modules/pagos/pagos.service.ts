import { PagosRepository } from './pagos.repository';
import { BoldService } from './bold.service';
import { CitaRepository } from '../citas/cita.repository';
import { TipoPago, EstadoPago, MetodoPago } from '@prisma/client';

export class PagosService {
    private repository = new PagosRepository();
    private citaRepo = new CitaRepository();

    async generarLinkAnticipo(id_cita: number, precioTotal: number, nombreServicio: string) {
        const anticipo = Math.round(precioTotal * 0.20);
        const refPago = `RES-${id_cita}-${Date.now()}`;

        const paymentUrl = await BoldService.createPaymentLink(
            refPago,
            `Anticipo 20% - ${nombreServicio}`,
            anticipo
        );

        await this.repository.crearPago({
            id_cita,
            valor: anticipo,
            tipo_pago: TipoPago.Anticipo,
            metodo_pago: MetodoPago.PSE,
            estado: EstadoPago.Pendiente,
            referencia_externa: refPago
        });

        return paymentUrl;
    }

    async procesarWebhookBold(payload: any) {
        const tipoEvento = payload.type;
        const referenciaExterna = payload.data?.metadata?.reference;
        const paymentId = payload.data?.payment_id;

        if (!referenciaExterna) return;

        let estadoFinal: EstadoPago;
        if (tipoEvento === 'SALE_APPROVED') estadoFinal = EstadoPago.Aprobado;
        else if (tipoEvento === 'SALE_REJECTED') estadoFinal = EstadoPago.Fallido;
        else return; // Ignoramos eventos de anulación por ahora

        await this.ejecutarIdempotenciaYActualizar(referenciaExterna, estadoFinal);
    }


    private async ejecutarIdempotenciaYActualizar(referencia: string, estadoFinal: EstadoPago) {
        const pago = await this.repository.buscarPagoPorReferencia(referencia);

        if (!pago) {
            console.warn(`[Bold Webhook] Pago no encontrado para referencia: ${referencia}`);
            return;
        }

        if (pago.estado === EstadoPago.Aprobado) {
            console.log(`[Bold Webhook] Ignorado. Pago ${referencia} ya estaba Aprobado.`);
            return;
        }

        await this.repository.actualizarPagoPorReferencia(referencia, estadoFinal);

        if (estadoFinal === EstadoPago.Aprobado && pago.tipo_pago === TipoPago.Anticipo) {
            await this.citaRepo.actualizarEstado(pago.id_cita, 'CONF');
        }
    }


    async sincronizarEstadoFallback(referenciaExterna: string) {
        const apiKey = process.env.BOLD_API_KEY;
        if (!apiKey) throw new Error("Falta BOLD_API_KEY en las variables de entorno");

        const url = `https://integrations.api.bold.co/payments/webhook/notifications/${referenciaExterna}?is_external_reference=true`;

        const respuesta = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `x-api-key ${apiKey}`
            }
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el estado de Bold en el Fallback");
        }

        const data = await respuesta.json();

        if (data.notifications && data.notifications.length > 0) {
            const notificacionMasReciente = data.notifications[0];
            await this.procesarWebhookBold(notificacionMasReciente);
            return notificacionMasReciente.type; // Retornamos el estado para el cliente
        }

        return null;
    }


    async liquidarCitaPOS(id_cita: number, monto: number, metodoPago: MetodoPago) {
        await this.repository.crearPago({
            id_cita,
            valor: monto,
            tipo_pago: TipoPago.Liquidacion,
            estado: EstadoPago.Aprobado,
            metodo_pago: metodoPago,
            referencia_externa: `POS-${id_cita}-${Date.now()}`
        });

        await this.citaRepo.actualizarEstado(id_cita, 'CONF');
    }
}