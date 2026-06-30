// Define los tipos de vista que manejamos en el Sidebar y Layout
export type AdminView = 'Inicio' | 'Clientes' | 'Barberos' | 'Servicios' | 'Barberías' | 'Reportes';

// Definición de Usuario para clientes y barberos
export interface Usuario {
  id: number;
  username: string;
  email: string;
  cedula?: string;
  rol: 'Cliente' | 'Barbero' | 'Administrador';
  telefono?: string;
  // Agregamos las propiedades faltantes para que TypeScript deje de marcar error
  nombre?: string;
  apellidos?: string;
  apellido?: string; // Lo dejamos por precaución por si la API lo envía en singular
}

// Definición para las sucursales
export interface Barberia {
  id_barberia: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
}

// Definición para la agenda/horarios
export interface Horario {
  id: number;
  barberoId: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

// Puedes añadir aquí cualquier otra interfaz que necesites a medida que crezca el proyecto