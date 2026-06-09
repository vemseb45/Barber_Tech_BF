export interface CrearCalificacionDTO {
  id_cita: number;
  puntuacion: number;
  comentario?: string;
}

export interface PromedioBarberoResponse {
  promedio: number;
}