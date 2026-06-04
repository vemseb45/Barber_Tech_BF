import { ServiciosRepository } from './servicios.repository';
import { CreateServicioDTO, UpdateServicioDTO } from './servicios.types';

export class ServiciosService {
  
  static async createServicio(data: CreateServicioDTO) {


    const barberia = await ServiciosRepository.findBarberiaById(data.id_barberia);
    if (!barberia) {
      throw new Error("La barbería especificada no existe.");
    }
    
    return ServiciosRepository.create(data);
  }

  static async getAllServicios() {
    return ServiciosRepository.findAll();
  }

  static async getServicioById(id: number) {
    const servicio = await ServiciosRepository.findById(id);
    if (!servicio) throw new Error("El servicio no existe.");
    return servicio;
  }

  static async updateServicio(id: number, data: UpdateServicioDTO) {

    const servicioExistente = await ServiciosRepository.findById(id);
    if (!servicioExistente) throw new Error("El servicio no existe.");

    if (data.id_barberia) {
      const barberia = await ServiciosRepository.findBarberiaById(data.id_barberia);
      if (!barberia) throw new Error("La nueva barbería especificada no existe.");
    }

    return ServiciosRepository.update(id, data);
  }

  static async deleteServicio(id: number) {
    const servicioExistente = await ServiciosRepository.findById(id);
    if (!servicioExistente) throw new Error("El servicio no existe.");
    
    return ServiciosRepository.delete(id);
  }
}