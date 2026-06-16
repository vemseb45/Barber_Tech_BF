export class CitaMapper {
  static toResponse(cita: any) {
    if (!cita) return null;

    const horaDate = new Date(cita.hora);
    const horaFormateada = horaDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return {
      id: cita.id_cita,
      fecha: cita.fecha.toISOString().split('T')[0],
      hora: horaDate.toTimeString().split(' ')[0].substring(0, 5),
      servicio: cita.id_servicio,
      cedula_cliente: cita.cedula_cliente,
      cedula_barbero: cita.cedula_barbero,
      cliente_nombre: cita.cliente ? `${cita.cliente.nombre} ${cita.cliente.apellidos}`.toLowerCase() : "desconocido",
      barbero_nombre: cita.barbero ? `${cita.barbero.nombre} ${cita.barbero.apellidos}`.toLowerCase() : "desconocido",
      servicio_nombre: cita.servicio ? cita.servicio.nombre.toLowerCase() : "desconocido",
      servicio_precio: cita.servicio ? parseFloat(cita.servicio.precio) : 0
    };
  }

  static toResponseList(citas: any[]) {
    return citas.map(cita => this.toResponse(cita));
  }

  static toHistorialResponseList(citas: any[]) {
    return citas.map(cita => {
      const horaDate = new Date(cita.hora);
      return {
        id: cita.id_cita,
        cliente: cita.cliente ? `${cita.cliente.nombre} ${cita.cliente.apellidos}`.trim().toLowerCase() : "desconocido",
        servicio: cita.servicio ? cita.servicio.nombre.toLowerCase() : "desconocido",
        fecha: cita.fecha.toISOString().split('T')[0],
        hora: horaDate.toTimeString().split(' ')[0].substring(0, 5),
        precio: cita.servicio ? parseFloat(cita.servicio.precio) : 0
      };
    });
  }
}