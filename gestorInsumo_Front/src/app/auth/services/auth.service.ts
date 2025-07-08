import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from '../../shared/services/token.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api'; // Ajusta según tu backend

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  // Login
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        map((response: LoginResponse) => {
          if (response.success && response.token) {
            // Guardar token y datos del usuario
            this.tokenService.setToken(response.token);
            if (response.user) {
              this.tokenService.setUser(response.user);
            }
          }
          return response;
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
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      if (error.status === 401) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    return throwError(() => errorMessage);
  }
}