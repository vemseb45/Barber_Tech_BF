import { BarberiasRepository } from "./barberias.repository";
import { CreateBarberiaDTO, UpdateBarberiaDTO } from "./dto/barberia.dto";

export class BarberiasService {
  
  static async getAllBarberias() {
    return await BarberiasRepository.findAll();
  }

  static async getBarberiaById(id: number) {
    const barberia = await BarberiasRepository.findById(id);
    if (!barberia) {
      throw new Error("La barbería no fue encontrada.");
    }
    return barberia;
  }

  /**
   * Verifica lógicamente si el email o teléfono ingresado colisionan con otro registro
   */
  private static async checkDuplicates(email?: string, telefono?: string, excludeId?: number) {
    const existente = await BarberiasRepository.findByEmailOrTelefono(email, telefono, excludeId);
    if (existente) {
      if (email && existente.email === email) {
        throw new Error("El correo electrónico ingresado ya está registrado en otra sede.");
      }
      if (telefono && existente.telefono === telefono) {
        throw new Error("El teléfono ingresado ya está registrado en otra sede.");
      }
    }
  }

  static async createBarberia(data: CreateBarberiaDTO) {
    // 1. Aplicar regla de negocio para evitar duplicados en email o teléfono
    await this.checkDuplicates(data.email, data.telefono);
    // 2. Transmitir al repositorio
    return await BarberiasRepository.create(data);
  }

  static async updateBarberia(id: number, data: UpdateBarberiaDTO) {
    await this.getBarberiaById(id);
    await this.checkDuplicates(data.email, data.telefono, id);
    return await BarberiasRepository.update(id, data);
  }

  static async deleteBarberia(id: number) {
    await this.getBarberiaById(id);
    return await BarberiasRepository.delete(id);
  }
}