import { CitaRepository } from './cita.repository';
import { PagosService } from '../pagos/pagos.service';

export class CitaService {
  private repository = new CitaRepository();
  private pagosService = new PagosService();

  async reservar(body: any) {
    if (!body.fecha || !body.hora || !body.servicio || !body.cedula_cliente || !body.cedula_barbero) {
      throw new Error("Todos los campos son obligatorios");
    }

    const servicioInfo = await this.repository.buscarServicioPorId(parseInt(body.servicio));
    if (!servicioInfo) throw new Error("El servicio seleccionado no existe.");

    const fecha = new Date(`${body.fecha}T00:00:00`);
    const horaString = body.hora.substring(0, 5);
    const hora = new Date(`1970-01-01T${horaString}:00Z`);

    const nuevaCita = await this.repository.crear({
      fecha, hora, id_servicio: parseInt(body.servicio),
      cedula_cliente: body.cedula_cliente, cedula_barbero: body.cedula_barbero
    });

    const urlPago = await this.pagosService.generarLinkAnticipo(
      nuevaCita.id_cita,
      Number(servicioInfo.precio),
      servicioInfo.nombre
    );

    return {
      mensaje: "Cita pre-reservada. Completar pago para confirmar.",
      id_cita: nuevaCita.id_cita,
      url_pago: urlPago
    };
  }

  async obtenerCitasPOS(cedula_cliente: string) {
    const citas = await this.repository.buscarCitaConSaldos(cedula_cliente);

    return citas.map(cita => {
      const precioTotal = Number(cita.servicio?.precio || 0);
      const totalPagado = cita.pagos.reduce((sum, pago) => sum + Number(pago.valor), 0);
      return {
        id_cita: cita.id_cita,
        fecha: cita.fecha.toISOString().split('T')[0],
        servicio: cita.servicio?.nombre,
        precio_total: precioTotal,
        total_pagado_anticipo: totalPagado,
        saldo_a_cobrar: precioTotal - totalPagado,
        barbero: `${cita.barbero?.nombre} ${cita.barbero?.apellidos}`.trim()
      };
    });
  }


  async finalizar(citaId: number) {
    const cita = await this.repository.buscarPorId(citaId);
    if (!cita) throw new Error("Cita no encontrada");

    // Cambia el estado a CONF (Confirmada/Finalizada)
    return this.repository.actualizarEstado(citaId, 'CONF');
  }

  async cancelar(citaId: number) {
    const cita = await this.repository.buscarPorId(citaId);
    if (!cita) throw new Error("Cita no encontrada");

    if (cita.estado !== 'PENT') {
      throw new Error("Solo se pueden cancelar citas pendientes");
    }

    return this.repository.actualizarEstado(citaId, 'CANC');
  }

  async obtenerHistorialBarbero(barberoId: string, estadoOpcional?: string) {
    const estado = estadoOpcional || 'CONF'; // Por defecto finalizadas
    return this.repository.buscarHistorialBarbero(barberoId, estado);
  }

  async obtenerCitasCliente(cedulaCliente: string, tipo: 'pendientes' | 'terminadas') {
    if (tipo === 'pendientes') {
      return this.repository.buscarPorClienteYEstado(cedulaCliente, 'PENT', 'asc');
    } else {
      return this.repository.buscarPorClienteYEstado(cedulaCliente, 'CONF', 'desc');
    }
  }
}