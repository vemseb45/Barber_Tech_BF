import api from "@/app/api/axios"; 

// 1. Definimos las reglas exactas de los datos que necesitamos para iniciar sesión
export interface LoginData {
  username: string;
  password: string;
}

// 2. Definimos las reglas exactas de los datos que necesitamos para registrarnos
export interface RegisterData {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
}

/**
 * Función para iniciar sesión.
 * Envía las credenciales al servidor para obtener el token de acceso.
 * @param data Objeto con el username y password
 */
export const login = (data: LoginData) => {
  return api.post("token/", data);
};

/**
 * Función para registrar un nuevo usuario.
 * Envía los datos personales y de seguridad al backend.
 * @param data 
 */
export const register = (data: RegisterData) => {
  return api.post("usuarios/registro/", data);
};