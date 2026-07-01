// src/modules/usuarios/usuario.controller.ts
import { NextRequest, NextResponse } from 'next/server';
import { UsuarioService } from './service';
import { UpdateUsuarioImagenDto } from './dto';

export class UsuarioController {
  static async updateImagen(req: NextRequest) {
    try {
      const body = await req.json();
      
      const dto: UpdateUsuarioImagenDto = {
        cedula: body.cedula,
        imagen: body.imagen,
      };

      const result = await UsuarioService.actualizarImagen(dto);

      return NextResponse.json(
        { 
          message: 'Imagen actualizada correctamente', 
          data: result 
        },
        { status: 200 }
      );
      
    } catch (error: any) {
      const statusCode = error.message === 'Usuario no encontrado.' ? 404 : 400;
      
      return NextResponse.json(
        { error: error.message || 'Error interno del servidor' },
        { status: statusCode }
      );
    }
  }
}