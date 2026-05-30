export interface Barberia {
  id_barberia: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
}

export type CreateBarberiaInput = Omit<Barberia, 'id_barberia'>;
export type UpdateBarberiaInput = Partial<CreateBarberiaInput>;