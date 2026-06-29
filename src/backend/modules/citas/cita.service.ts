import { CitaRepository } from './cita.repository';

export class CitaService {
  private repository = new CitaRepository();

  async reservar(body: any) {
    if (!body.fecha || !body.hora || !body.servicio || !body.cedula_cliente || !body.cedula_barbero) {
      throw new Error("Todos los campos son obligatorios");
    }

    const fecha = new Date(`${body.fecha}T00:00:00`);

    // Extraemos solo los primeros 5 caracteres (HH:mm) para asegurarnos de que el formato no falle
    const horaString = body.hora.substring(0, 5);
    const hora = new Date(`1970-01-01T${horaString}:00Z`);
    return this.repository.crear({
      fecha,
      hora,
      id_servicio: parseInt(body.servicio),
      cedula_cliente: body.cedula_cliente,
      cedula_barbero: body.cedula_barbero
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