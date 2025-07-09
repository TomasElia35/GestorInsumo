// src/app/shared/models/user.models.ts

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  contrasena?: string;
  estado: boolean;
  fechaCreacion: Date;
  rol: Rol;
}

export interface Rol {
  id: number;
  nombre: string;
}

export interface UserRequest {
  nombre: string;
  apellido: string;
  mail: string;
  contrasena: string;
  estado: boolean;
  rol: number;
}

export interface UserResponse {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  contrasena: string;
  estado: boolean;
  fechaCreacion: string;
  rol: Rol;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DeleteResponse {
  eliminado: boolean;
  mensaje: string;
}