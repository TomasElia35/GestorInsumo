// src/app/models/user.model.ts
export interface User {
  id?: number;
  nombre: string;
  apellido: string;
  mail: string;
  contrasena?: string;
  estado: boolean;
  fechaCreacion?: Date;
  rol: Rol;
}

export interface UserRequest {
  nombre: string;
  apellido: string;
  mail: string;
  contrasena: string;
  estado?: boolean;
  rol: number;
}

export interface UserResponse {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  contrasena: string;
  estado: boolean;
  fechaCreacion: Date;
  rol: RolDTO;
}

export interface Rol {
  id: number;
  nombre: string;
}

export interface RolDTO {
  id: number;
  nombre: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  eliminado?: boolean;
  mensaje?: string;
}