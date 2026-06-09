export interface CreateServicioDTO {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracion_minutos: number;
  imagen?: string;
  id_barberia: number;
}

export type UpdateServicioDTO = Partial<CreateServicioDTO>;