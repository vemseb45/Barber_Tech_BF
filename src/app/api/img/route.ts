// src/app/api/usuarios/imagen/route.ts
import { NextRequest } from 'next/server';
import { UsuarioController } from '@/backend/modules/img/controller';

export async function PATCH(req: NextRequest) {
  return await UsuarioController.updateImagen(req);
}