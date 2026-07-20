import { CitaRepository } from './reagendar.repository';
import { ReagendarCitaDto } from './reagendar.dto';

export class CitaService {
  private repository: CitaRepository;

  constructor() {
    this.repository = new CitaRepository();
  }

  async reagendarCita(dto: ReagendarCitaDto) {
    // 1. Verificar que la cita exista
    const citaActual = await this.repository.obtenerPorId(dto.id_cita);
    if (!citaActual) {
      throw new Error('La cita no existe.');
    }

    if (citaActual.estado === 'CANC') {
      throw new Error('No se puede reagendar una cita cancelada.');
    }

    // 2. Preparar fechas (Prisma requiere objetos Date)
    // Asumiendo que la hora viene en 'HH:mm:ss', la unimos a una fecha base (ej. 1970-01-01) 
    // como lo suele requerir el tipo db.Time() de Prisma
    const fechaDate = new Date(`${dto.nueva_fecha}T00:00:00.000Z`);
    const horaDate = new Date(`1970-01-01T${dto.nueva_hora}.000Z`);
    
    const barberoObjetivo = dto.cedula_barbero || citaActual.cedula_barbero;

    if (!barberoObjetivo) {
       throw new Error('No hay un barbero asignado a esta cita.');
    }

    // 3. Verificar disponibilidad (para evitar el Unique Constraint Error)
    const conflicto = await this.repository.verificarConflicto(fechaDate, horaDate, barberoObjetivo);
    if (conflicto && conflicto.id_cita !== dto.id_cita) {
      throw new Error('El barbero ya tiene una cita reservada en ese horario.');
    }

    // 4. Actualizar
    return await this.repository.reagendar(dto.id_cita, fechaDate, horaDate, dto.cedula_barbero);
  }
}