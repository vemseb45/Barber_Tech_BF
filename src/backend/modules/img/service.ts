// src/modules/usuarios/usuario.service.ts
import { UsuarioRepository } from './repository';
import { UsuarioMapper } from './mapper';
import { UpdateUsuarioImagenDto } from './dto';

export class UsuarioService {
  static async actualizarImagen(dto: UpdateUsuarioImagenDto) {
    if (!dto.cedula) {
      throw new Error('La cédula del usuario es obligatoria.');
    }

    // Mapeamos los datos para Prisma
    const dataPrisma = UsuarioMapper.toPrismaUpdate(dto);

    try {
      const usuarioActualizado = await UsuarioRepository.updateImagen(
        dto.cedula,
        dataPrisma.imagen
      );
      
      return usuarioActualizado;
    } catch (error: any) {
      // Prisma lanza un error "P2025" si el registro a actualizar no existe
      if (error.code === 'P2025') {
        throw new Error('Usuario no encontrado.');
      }
      throw new Error('Error al actualizar la imagen en la base de datos.');
    }
  }
}