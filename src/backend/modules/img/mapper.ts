// src/modules/usuarios/usuario.mapper.ts
import { UpdateUsuarioImagenDto } from './dto';

export class UsuarioMapper {
  static toPrismaUpdate(dto: UpdateUsuarioImagenDto) {
    return {
      // Prisma requiere un objeto Buffer para los campos de tipo Bytes
      imagen: dto.imagen ? Buffer.from(dto.imagen, 'base64') : null,
    };
  }
}