import { ServiciosRepository } from './servicios.repository';
import { CreateServicioDTO, UpdateServicioDTO } from './servicios.types';

export class ServiciosService {
  
  // Función auxiliar para convertir el Buffer a Base64
  private static formatearServicio(servicio: any) {
  if (!servicio) return null;
  return {
    ...servicio,
    imagen: servicio.imagen ? servicio.imagen.toString('base64') : null,
  };
}

  static async createServicio(data: CreateServicioDTO) {
    const barberia = await ServiciosRepository.findBarberiaById(data.id_barberia);
    if (!barberia) throw new Error("La barbería no existe.");
    
    const nuevoServicio = await ServiciosRepository.create(data);
    return this.formatearServicio(nuevoServicio);
  }

  static async getAllServicios() {
    const servicios = await ServiciosRepository.findAll();
    return servicios.map(this.formatearServicio); // Convertimos toda la lista
  }

  static async getServicioById(id: number) {
    const servicio = await ServiciosRepository.findById(id);
    if (!servicio) throw new Error("El servicio no formatearServicioexiste.");
    return this.formatearServicio(servicio);
  }

  static async updateServicio(id: number, data: UpdateServicioDTO) {
    const servicioExistente = await ServiciosRepository.findById(id);
    if (!servicioExistente) throw new Error("El servicio no existe.");

    if (data.id_barberia) {
      const barberia = await ServiciosRepository.findBarberiaById(data.id_barberia);
      if (!barberia) throw new Error("La nueva barbería no existe.");
    }

    const actualizado = await ServiciosRepository.update(id, data);
    return this.formatearServicio(actualizado);
  }

  static async deleteServicio(id: number) {
    const servicioExistente = await ServiciosRepository.findById(id);
    if (!servicioExistente) throw new Error("El servicio no existe.");
    return ServiciosRepository.delete(id);
  }
}