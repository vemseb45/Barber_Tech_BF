import { prisma } from '@/backend/shared/prisma';
import { TipoPago, EstadoPago, MetodoPago } from '@prisma/client';

export class PagosRepository {
  async crearPago(data: { id_cita: number; valor: number; tipo_pago: TipoPago; estado: EstadoPago; referencia_externa: string; metodo_pago: MetodoPago }) {
    return prisma.pago.create({ data });
  }

  async actualizarPagoPorReferencia(referencia_externa: string, estado: EstadoPago) {
    return prisma.pago.updateMany({
      where: { referencia_externa },
      data: { estado }
    });
  }


  async buscarPagoPorReferencia(referencia_externa: string) {
    return prisma.pago.findFirst({
      where: { referencia_externa }
    });
  }
}