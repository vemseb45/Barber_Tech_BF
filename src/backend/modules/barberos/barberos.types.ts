export interface BarberoDetalle {
  cedula: string;
  id_barberia: number;
}

export type CreateBarberoInput = {
  cedula: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  contrasena: string;
  id_barberia: number;
  imagen?: string | null; 
};