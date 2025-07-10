import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from '../../services/token.service';

export interface LoginRequest {
  email: string;
  contrasena: string; // Cambiado de 'password' a 'contrasena' para coincidir con el backend
}

export interface LoginResponse {
  token: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  userId: number;
}

export interface AuthServiceResponse {
  success: boolean;
  data?: LoginResponse;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Cambiar la URL para coincidir con el backend
  private apiUrl = 'http://localhost:8080/insumomanager-app';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  // Login
  login(credentials: { email: string; password: string }): Observable<AuthServiceResponse> {
    // Transformar password a contrasena para coincidir con el backend
    const backendCredentials: LoginRequest = {
      email: credentials.email,
      contrasena: credentials.password
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, backendCredentials)
      .pipe(
        map((response: LoginResponse) => {
          // Si llegamos aquí, el login fue exitoso
          this.tokenService.setToken(response.token);
          this.tokenService.setUser({
            email: response.email,
            nombre: response.nombre,
            apellido: response.apellido,
            rol: response.rol,
            userId: response.userId
          });
          
          return {
            success: true,
            data: response,
            message: 'Login exitoso'
          };
        }),
        catchError(this.handleError)
      );
  }

  // Logout
  logout(): void {
    this.tokenService.clearAll();
  }

  // Verificar si está logueado
  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  // Obtener usuario actual
  getCurrentUser(): any {
    return this.tokenService.getUser();
  }

  // Manejo de errores
  private handleError = (error: HttpErrorResponse): Observable<AuthServiceResponse> => {
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    console.error('Error completo:', error);
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      if (error.status === 401) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.status === 403) {
        errorMessage = 'Acceso denegado. Verifica tus credenciales.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    return throwError(() => ({
      success: false,
      message: errorMessage
    }));
  }
}