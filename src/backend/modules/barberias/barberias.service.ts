import { BarberiasRepository } from "./barberias.repository";
import { CreateBarberiaDTO, UpdateBarberiaDTO } from "./dto/barberia.dto";

export class BarberiasService {

  static async getAllBarberias() {
    return await BarberiasRepository.findAll();
  }

  static async getBarberiaByIdentificador(identificador: string) {

    const valorDecodificado = decodeURIComponent(identificador);

    const esNumero = /^\d+$/.test(valorDecodificado);

    let barberia;

    if (esNumero) {
      barberia = await BarberiasRepository.findById(Number(valorDecodificado));
    } else {
      barberia = await BarberiasRepository.findByNombre(valorDecodificado);
    }

    if (!barberia) {
      throw new Error(`La barbería '${valorDecodificado}' no fue encontrada.`);
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
    await this.checkDuplicates(data.email, data.telefono);
    return await BarberiasRepository.create(data);
  }

  static async updateBarberia(identificador: string, data: UpdateBarberiaDTO) {
    // 1. Obtenemos el registro actual (sea por nombre o ID)
    const barberiaExistente = await this.getBarberiaByIdentificador(identificador);

    // 2. Verificamos duplicados excluyendo el ID actual
    await this.checkDuplicates(data.email, data.telefono, barberiaExistente.id_barberia);

    // 3. Actualizamos en base al ID real obtenido
    return await BarberiasRepository.update(barberiaExistente.id_barberia, data);
  }

  static async deleteBarberia(identificador: string) {
    // 1. Obtenemos la barbería (valida que exista)
    const barberiaExistente = await this.getBarberiaByIdentificador(identificador);

    // 2. Eliminamos mediante el ID real
    return await BarberiasRepository.delete(barberiaExistente.id_barberia);
  }
}