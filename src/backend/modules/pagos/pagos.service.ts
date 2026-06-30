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

  async procesarWebhook(referencia: string, estadoBold: string) {
    const estadoFinal = estadoBold === "APPROVED" ? EstadoPago.Aprobado : EstadoPago.Fallido;
    await this.repository.actualizarPagoPorReferencia(referencia, estadoFinal);

    if (estadoFinal === EstadoPago.Aprobado) {
      const pago = await this.repository.buscarPagoPorReferencia(referencia);
      if (pago) {
        // Confirmamos la cita porque ya pagó el anticipo
        await this.citaRepo.actualizarEstado(pago.id_cita, 'CONF');
      }
    }
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