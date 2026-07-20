import { ReagendarCitaDto } from './reagendar.dto';

export class CitaMapper {
  static toReagendarDto(body: any): ReagendarCitaDto {
    if (!body.id_cita || !body.nueva_fecha || !body.nueva_hora) {
      throw new Error('Faltan campos obligatorios: id_cita, nueva_fecha o nueva_hora');
    }

    return {
      id_cita: Number(body.id_cita),
      nueva_fecha: body.nueva_fecha,
      nueva_hora: body.nueva_hora,
      cedula_barbero: body.cedula_barbero
    };
  }
}