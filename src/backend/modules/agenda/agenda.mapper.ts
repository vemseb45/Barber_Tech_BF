export class AgendaMapper {
  static toCitaResponseList(citas: any[]) {
    return citas.map(cita => {
      const horaDate = new Date(cita.hora);
      // Formateo de hora estilo 12 horas AM/PM
      const horaFormateada = horaDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      return {
        id: cita.id_cita,
        cedula_cliente_id: cita.cedula_cliente,
        cliente_nombre: cita.cliente 
          ? `${cita.cliente.nombre} ${cita.cliente.apellidos}`.trim().toLowerCase()
          : "desconocido",
        fecha: cita.fecha.toISOString().split('T')[0],
        hora: horaDate.toTimeString().split(' ')[0].substring(0, 5), // "HH:MM"
        hora_formateada: horaFormateada,
        id_servicio: cita.id_servicio,
        nombre_servicio: cita.servicio ? cita.servicio.nombre.toLowerCase() : "desconocido",
        estado: cita.estado
      };
    });
  }

  // Mapea la configuración de horarios laborales
  static toAgendaResponseList(agendas: any[]) {
    return agendas.map(agenda => ({
      cedula_barbero: agenda.cedula_barbero,
      dia: agenda.dia,
      // Usamos toISOString para forzar la lectura en UTC y evitar el desfase de 5 horas
      hora_inicio: new Date(agenda.hora_inicio).toISOString().substring(11, 16),
      hora_fin: new Date(agenda.hora_fin).toISOString().substring(11, 16)
    }));
  }
}