export interface EstadisticasFiltroDTO {
  fechaInicio?: Date;
  fechaFin?: Date;
  cedula_barbero?: string;
}

export interface EstadisticasResponseDTO {
  totalCitas: number;
  pendientes: number;
  canceladas: number;
  completadas: number;
  ingresos: number;
  perdidas: number; 
  nombreBarbero?: string; 
  ingresosPorMes: {
    mes: string;
    total: number;
  }[];
}