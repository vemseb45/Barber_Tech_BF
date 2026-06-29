import { BarberosRepository } from "./barberos.repository";
import { CreateBarberoDTO } from "./dto/barbero.dto";
import { prisma } from "@/backend/shared/prisma";
import { hashPassword } from "@/backend/shared/password";

export class BarberosService {
  
  static async getAllBarberos() {
    const barberosRaw = await BarberosRepository.findAll();
    
    // Mapeamos los datos para proteger el modelo de base de datos 
    // y entregar al front exactamente la interfaz que necesita.
    return barberosRaw.map((user) => ({
      id: user.cedula,
      username: `${user.nombre} ${user.apellidos}`.trim(),
      especialidad: user.detalle_barbero?.barberia?.nombre || "Barbero"
    }));
  }

  static async createBarbero(data: CreateBarberoDTO) {
    const barberia = await prisma.barberia.findUnique({
      where: { id_barberia: data.id_barberia }
    });

    if (!barberia) {
      throw new Error("La barbería especificada no existe.");
    }

    const existingUser = await prisma.usuario.findFirst({
      where: {
        OR: [
          { cedula: data.cedula },
          { email: data.email },
          { telefono: data.telefono }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.cedula === data.cedula) throw new Error("La cédula ingresada ya está registrada.");
      if (existingUser.email === data.email) throw new Error("El correo electrónico ya está registrado.");
      if (existingUser.telefono === data.telefono) throw new Error("El teléfono ya está registrado.");
    }

    const passwordHash = await hashPassword(data.contrasena);

    return await BarberosRepository.create(data, passwordHash);
  }
}