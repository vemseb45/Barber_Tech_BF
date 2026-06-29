import { AgendaRepository } from './agenda.repository';
import { DiaSemana } from '@prisma/client';

export class AgendaService {
  private repository = new AgendaRepository();

  private diasMapeo: Record<number, DiaSemana> = {
    0: DiaSemana.Lunes,
    1: DiaSemana.Martes,
    2: DiaSemana.Miercoles,
    3: DiaSemana.Jueves,
    4: DiaSemana.Viernes,
    5: DiaSemana.Sabado,
    6: DiaSemana.Domingo,
  };

  async obtenerCedulaBarbero(barberoId: string) {
    return this.repository.obtenerCedulaPorId(barberoId);
  }

  async listarMiAgenda(barberoId: string, fecha?: string, fechaInicio?: string, fechaFin?: string) {
    const cedula = await this.obtenerCedulaBarbero(barberoId);
    if (!cedula) throw new Error("Barbero no existe");

    let citas = [];
    if (fechaInicio && fechaFin) {
      citas = await this.repository.buscarCitasRango(cedula, new Date(fechaInicio), new Date(fechaFin));
    } else if (fecha) {
      citas = await this.repository.buscarCitasFecha(cedula, new Date(fecha));
    } else {
      throw new Error("Debes enviar fecha o rango (fechaInicio y fechaFin)");
    }

    // Filtrar solo las citas pendientes 'PENT' 
    const citasPendientes = citas.filter(c => c.estado === 'PENT');
    return citasPendientes;
  }

  async calcularDisponibilidad(barberoId: string, fechaStr: string) {
    const cedula = await this.obtenerCedulaBarbero(barberoId);
    if (!cedula) throw new Error("Barbero no existe");

    // Forzar la creación de la fecha localmente para evitar desfases horarios
    const [y, m, d] = fechaStr.split('-').map(Number);
    const fechaObj = new Date(y, m - 1, d);

    let indexDia = fechaObj.getDay() - 1;
    if (indexDia === -1) indexDia = 6;
    const nombreDia = this.diasMapeo[indexDia];

    const agenda = await this.repository.buscarAgendaBarbero(cedula, nombreDia);
    if (!agenda) return [];

    // Obtener citas activas para el día
    const citas = await this.repository.buscarCitasFecha(cedula, fechaObj);
    const citasActivas = citas.filter(c => c.estado === 'PENT' || c.estado === 'CONF');

    // Construir lista de tiempos ocupados en bloques de 30 minutos
    const horasOcupadas: string[] = [];
    for (const cita of citasActivas) {
      const inicioCita = new Date(cita.hora);
      const duracion = cita.servicio?.duracion_minutos || 30;

      const tiempoTemp = new Date(inicioCita);
      const finCita = new Date(inicioCita.getTime() + duracion * 60000);

      while (tiempoTemp < finCita) {
        // SOLUCIÓN: Usar toISOString para forzar la lectura en UTC exacto
        horasOcupadas.push(tiempoTemp.toISOString().substring(11, 16));
        tiempoTemp.setUTCMinutes(tiempoTemp.getUTCMinutes() + 30); // Sumar minutos en UTC
      }
    }

    const bloques: any[] = [];
    const horaActual = new Date(agenda.hora_inicio);
    const horaFin = new Date(agenda.hora_fin);

    while (horaActual < horaFin) {
      // SOLUCIÓN: Extraer la hora exactamente como está en la DB ignorando la zona horaria local
      const horaDbStr = horaActual.toISOString().substring(11, 16);

      if (!horasOcupadas.includes(horaDbStr)) {
        // SOLUCIÓN: Obligar al formateador a usar UTC
        const horaFormateada = horaActual.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'UTC'
        });

        bloques.push({
          hora: horaFormateada,
          hora_db: `${horaDbStr}:00`,
          estado: "disponible"
        });
      }

      // Avanzar 30 minutos usando el reloj UTC
      horaActual.setUTCMinutes(horaActual.getUTCMinutes() + 30);
    }

    return bloques;
  }

  async configurarHorario(body: any) {
    let cedula = body.cedula_barbero;
    if (body.barberoId && !cedula) {
      cedula = await this.obtenerCedulaBarbero(body.barberoId);
    }

    if (!cedula) throw new Error("Barbero no encontrado");

    // Parses string "08:00" to a valid full Date object for Prisma Time field
    const crearDateConHora = (horaStr: string) => {
      return new Date(`1970-01-01T${horaStr}:00Z`);
    };

    const hora_inicio = crearDateConHora(body.hora_inicio);
    const hora_fin = crearDateConHora(body.hora_fin);

    if (hora_inicio >= hora_fin) {
      throw new Error("La hora de inicio debe ser menor a la hora de fin.");
    }

    return this.repository.guardarHorario({
      cedula_barbero: cedula,
      dia: body.dia as DiaSemana,
      hora_inicio,
      hora_fin
    });
  }

  async cargaMasiva(horarios: any[]) {
    let creados = 0;
    let actualizados = 0;
    const errores = [];

    const crearDateConHora = (horaStr: string) => new Date(`1970-01-01T${horaStr}:00Z`);

    for (const [index, row] of horarios.entries()) {
      try {
        const { cedula_barbero, dia, hora_inicio, hora_fin } = row;

        if (!cedula_barbero || !dia || !hora_inicio || !hora_fin) {
          errores.push({ fila: index + 2, error: "Campos incompletos" });
          continue;
        }

        const dateInicio = crearDateConHora(hora_inicio);
        const dateFin = crearDateConHora(hora_fin);

        if (dateInicio >= dateFin) {
          errores.push({ fila: index + 2, error: "Hora inicio debe ser menor a hora fin" });
          continue;
        }

        const existente = await this.repository.buscarAgendaBarbero(cedula_barbero, dia as DiaSemana);
        await this.repository.guardarHorario({
          cedula_barbero,
          dia: dia as DiaSemana,
          hora_inicio: dateInicio,
          hora_fin: dateFin
        });

        if (existente) actualizados++;
        else creados++;

      } catch (e: any) {
        errores.push({ fila: index + 2, error: e.message });
      }
    }

    return { creados, actualizados, errores };
  }

  async eliminarHorario(cedula: string, dia: string) {
    return this.repository.eliminarHorario(cedula, dia as DiaSemana);
  }

  async verTodosLosHorarios(barberoId?: string) {
    let cedula = undefined;
    if (barberoId) {
      cedula = await this.obtenerCedulaBarbero(barberoId) || undefined;
    }
    return this.repository.listarAgendas(cedula);
  }
}