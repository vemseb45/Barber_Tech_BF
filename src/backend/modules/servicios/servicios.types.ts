export interface CreateServicioDTO {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion_minutos: number;
  imagen?: Buffer | null; 
  id_barberia: number;
}

export type UpdateServicioDTO = Partial<CreateServicioDTO>;